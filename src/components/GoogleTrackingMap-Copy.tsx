/// <reference types="@types/google.maps" />
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { Vehicle } from '@/types/vehicle';
import { GOOGLE_MAPS_API_KEY, GOOGLE_MAPS_LIBRARIES, NAIROBI_CENTER, LIGHT_MAP_STYLE } from '@/config/maps';
import { animateMarkerRotation } from '@/utils/markerAnimations';
import { formatDistanceToNow } from 'date-fns';
import { Share2, Navigation, Info } from 'lucide-react';

import { MarkerClusterer } from '@googlemaps/markerclusterer';

interface GoogleTrackingMapProps {
  vehicles: Vehicle[];
  selectedVehicles: number[];
  showingHistory: boolean;
  onMapLoad?: () => void;
}

interface MapComponentProps {
  vehicles: Vehicle[];
  selectedVehicles: number[];
  showingHistory: boolean;
  onMapLoad?: () => void;
}

const MapComponent: React.FC<MapComponentProps> = ({
  vehicles,
  selectedVehicles,
  showingHistory,
  onMapLoad
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const markers = useRef<{ [key: string]: google.maps.Marker }>({});
  const polylines = useRef<{ [key: string]: google.maps.Polyline }>({});
  const infoWindow = useRef<google.maps.InfoWindow | null>(null);
  const markerClusterer = useRef<MarkerClusterer | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || map.current) return;

    map.current = new google.maps.Map(mapRef.current, {
      center: NAIROBI_CENTER,
      zoom: 6,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
      backgroundColor: '#f5f5f5',
      clickableIcons: false,
      disableDefaultUI: false,
      gestureHandling: 'greedy'
    });

    // Initialize InfoWindow with better styling and behavior
    infoWindow.current = new google.maps.InfoWindow({
      disableAutoPan: true, // Prevent map from panning to center the info window
      maxWidth: 320,
      pixelOffset: new google.maps.Size(0, -20) // Offset to position above marker
    });

    if (onMapLoad) {
      onMapLoad();
    }
  }, [onMapLoad]);

  // Create custom car marker
  const createCarMarker = useCallback((vehicle: Vehicle): google.maps.Symbol => {
    const isSelected = selectedVehicles.includes(vehicle.id);
    let fillColor = '#64748b'; // inactive color
    let scale = isSelected ? 1.5 : 1; // larger size for selected vehicles

    if (vehicle.status === 'online') {
      // fillColor = '#10b981';
      fillColor = isSelected ? '#10b981' : '#277105ff'; // green for active
    } else if (vehicle.status === 'offline') {
      fillColor = isSelected ? '#b75151ff' : '#ef4444'; // red for offline
    } else if (vehicle.status === 'offline') {
      // scale *= 0.8; // smaller size for inactive vehicles
    }

    // Improved navigation/vehicle icon with clear directional indication
    const carIcon: google.maps.Symbol = {
      path: `M 3,11 L 22,2 L 13,21 L 11,13 L 3,11 Z`,
      fillColor: fillColor,
      fillOpacity: 0.9,
      strokeColor: '#ffffff',
      strokeWeight: 1.5,
      scale: scale,
      anchor: new google.maps.Point(14, 11), // Adjusted anchor for better centering
      rotation: vehicle.heading || 0
    };

    return carIcon;
  }, [selectedVehicles]);

  // Update vehicle markers
  useEffect(() => {
    if (!map.current) return;

    const newMarkers: google.maps.Marker[] = [];
    const existingMarkerIds = new Set(Object.keys(markers.current));

    // Update or create markers for each vehicle
    vehicles.forEach(vehicle => {
      const position = { lat: vehicle.coordinates[1], lng: vehicle.coordinates[0] };

      if (markers.current[vehicle.id]) {
        // Update existing marker
        const marker = markers.current[vehicle.id];
        const oldIcon = marker.getIcon() as google.maps.Symbol;
        const newIcon = createCarMarker(vehicle);
        marker.setPosition(position);
        marker.setIcon(newIcon);

        // Animate rotation if heading has changed
        if (oldIcon.rotation !== vehicle.heading) {
          animateMarkerRotation(vehicle.id.toString(), marker, oldIcon.rotation || 0, vehicle.heading || 0);
        }
        newMarkers.push(marker);
        existingMarkerIds.delete(vehicle.id.toString());
      } else {
        // Create new marker
        const marker = new google.maps.Marker({
          position: position,
          icon: createCarMarker(vehicle),
          optimized: true,
          title: vehicle.registrationNumber,
          animation: google.maps.Animation.DROP
        });

        // Add click listener
        marker.addListener('click', () => {
          const content = createInfoWindowContent(vehicle);

          infoWindow.current?.close();
          infoWindow.current?.setContent(content);
          infoWindow.current?.open(map.current!, marker);
        });

        markers.current[vehicle.id] = marker;
        newMarkers.push(marker);
      }
    });

    // Remove markers for vehicles that no longer exist
    existingMarkerIds.forEach(id => {
      if (markers.current[id]) {
        markers.current[id].setMap(null);
        delete markers.current[id];
      }
    });

    // Initialize or update MarkerClusterer
    if (markerClusterer.current) {
      markerClusterer.current.clearMarkers();
      markerClusterer.current.addMarkers(newMarkers);
    } else {
      markerClusterer.current = new MarkerClusterer({ markers: newMarkers, map: map.current! });
    }

    // Update route history lines if showing history
    if (showingHistory) {
      Object.values(polylines.current).forEach(line => line.setMap(null));
      selectedVehicles.forEach(vehicleId => {
        const vehicle = vehicles.find(v => v.id === vehicleId);
        if (!vehicle || !vehicle.routeHistory) return;

        const path = vehicle.routeHistory.map(point => ({
          lat: point.coordinates[1],
          lng: point.coordinates[0]
        }));

        if (polylines.current[vehicleId]) {
          polylines.current[vehicleId].setPath(path);
        } else {
          polylines.current[vehicleId] = new google.maps.Polyline({
            path,
            map: map.current!,
            geodesic: true,
            strokeColor: '#10b981',
            strokeOpacity: 0.8,
            strokeWeight: 2
          });
        }
      });
    } else {
      // Hide all polylines if not showing history
      Object.values(polylines.current).forEach(line => line.setMap(null));
    }
  }, [vehicles, selectedVehicles, showingHistory, createCarMarker]);

  // Handle route history
  useEffect(() => {
    if (!map.current) return;

    // Clear existing polylines
    Object.values(polylines.current).forEach(polyline => polyline.setMap(null));
    polylines.current = {};

    if (showingHistory && selectedVehicles.length > 0) {
      selectedVehicles.forEach(vehicleId => {
        const vehicle = vehicles.find(v => v.id === vehicleId);
        if (!vehicle || vehicle.routeHistory.length < 2) return;

        const path = vehicle.routeHistory.map(point => ({
          lat: point.coordinates[1],
          lng: point.coordinates[0]
        }));

        const polyline = new google.maps.Polyline({
          path: path,
          geodesic: true,
          strokeColor: '#0ea5e9',
          strokeOpacity: 0.8,
          strokeWeight: 3,
          map: map.current!
        });

        polylines.current[vehicleId] = polyline;

        // Add start and end markers for route
        if (path.length > 0) {
          // Start marker (green)
          new google.maps.Marker({
            position: path[0],
            map: map.current!,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: '#10b981',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
              scale: 6
            },
            title: `${vehicle.registrationNumber} - Route Start`
          });

          // End marker (red) 
          new google.maps.Marker({
            position: path[path.length - 1],
            map: map.current!,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: '#ef4444',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
              scale: 6
            },
            title: `${vehicle.registrationNumber} - Route End`
          });
        }
      });
    }
  }, [vehicles, selectedVehicles, showingHistory]);

  // Function to generate popup content with updated styling
  // Function to generate popup content with updated styling
  const createInfoWindowContent = (vehicle: Vehicle): string => {
    // Generate Google Maps navigation URL
    const navUrl = `https://www.google.com/maps/dir/?api=1&destination=${vehicle.coordinates[1]},${vehicle.coordinates[0]}&travelmode=driving`;

    // Generate shareable tracking link (using a URL shortener service)
    const trackingUrl = `https://btly.com/track/${vehicle.id}`;

    // Generate vehicle details page URL
    const detailsUrl = `/tracking/${vehicle.id}`;

    return `
    <div style="min-width: 280px">
      <div style="margin-bottom: 0.5rem">
        <div style="font-size: 0.875rem; font-weight: 600; color: #475569">
          ${vehicle.registrationNumber}
        </div>
        <div style="font-size: 0.75rem; color: #64748b">
          ${vehicle.imei}
        </div>
        <div style="font-size: 0.75rem; color: #64748b">
          Last Update: ${formatDistanceToNow(new Date(vehicle.lastUpdate))} ago
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; margin-bottom: 1rem">
        <div>
          <div style="font-size: 0.75rem; font-weight: 500; color: #64748b; margin-bottom: 0.25rem">
            Status
          </div>
          <div style="font-size: 0.75rem; font-weight: 500; display: flex; align-items: center; gap: 0.5rem">
            <span style="display: inline-block; width: 0.5rem; height: 0.5rem; border-radius: 9999px; background-color: ${vehicle.status === 'online' ? '#10b981' :
        vehicle.status === 'offline' ? '#ef4444' : '#3acd30ff'
      }"></span>
            ${vehicle.status}
          </div>
        </div>

        <div>
          <div style="font-size: 0.75rem; font-weight: 500; color: #64748b; margin-bottom: 0.25rem">
            Speed
          </div>
          <div style="font-size: 0.75rem; font-weight: 500">
            ${vehicle.speed.toFixed(2)} km/h
          </div>
        </div>

        <div>
          <div style="font-size: 0.75rem; font-weight: 500; color: #64748b; margin-bottom: 0.25rem">
            Direction
          </div>
          <div style="font-size: 0.75rem; font-weight: 500">
            ${vehicle.heading.toFixed(2)}°
          </div>
        </div>

        <div>
          <div style="font-size: 0.75rem; font-weight: 500; color: #64748b; margin-bottom: 0.25rem">
            Location
          </div>
          <div style="font-size: 0.75rem; font-weight: 500">
            ${vehicle.coordinates.join(', ')}
          </div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem">
        <button onclick="window.open('${trackingUrl}', '_blank')" style="
          padding: 0.375rem;
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 0.375rem;
          font-size: 0.75rem;
          color: #0f172a;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.375rem;
          font-weight: 500;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        ">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
            <polyline points="16 6 12 2 8 6"/>
            <line x1="12" y1="2" x2="12" y2="15"/>
          </svg>
          Share
        </button>
        
        <button onclick="window.open('${navUrl}', '_blank')" style="
          padding: 0.375rem;
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 0.375rem;
          font-size: 0.75rem;
          color: #0f172a;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.375rem;
          font-weight: 500;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        ">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="3 11 22 2 13 21 11 13 3 11"/>
          </svg>
          Navigate
        </button>
        
        <button onclick="" style="
          padding: 0.375rem;
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 0.375rem;
          font-size: 0.75rem;
          color: #0f172a;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.375rem;
          font-weight: 500;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        ">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          Details
        </button>
      </div>
    </div>
  `;
  };
  return <div ref={mapRef} className="w-full h-full" />;
};

const LoadingComponent = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-background">
    <div className="glass-panel p-6 text-center">
      <div className="animate-pulse-slow mb-4">
        <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z" />
          </svg>
        </div>
      </div>
      <h2 className="text-lg font-semibold text-foreground mb-2">
        Loading Google Maps
      </h2>
      <p className="text-sm text-muted-foreground">
        Initializing map with tracking data...
      </p>
    </div>
  </div>
);

const ErrorComponent = ({ status }: { status: Status }) => (
  <div className="absolute inset-0 flex items-center justify-center bg-background">
    <div className="glass-panel p-6 max-w-md text-center">
      <h2 className="text-lg font-semibold text-destructive mb-2">
        Map Loading Error
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        Status: {status}
      </p>
      <p className="text-xs text-muted-foreground">
        Please check your internet connection and try refreshing the page.
      </p>
    </div>
  </div>
);

export const GoogleTrackingMap: React.FC<GoogleTrackingMapProps> = (props) => {
  const render = (status: Status) => {
    switch (status) {
      case Status.LOADING:
        return <LoadingComponent />;
      case Status.FAILURE:
        return <ErrorComponent status={status} />;
      case Status.SUCCESS:
        return <MapComponent {...props} />;
    }
  };

  return (
    <div className="absolute inset-0">
      <Wrapper
        apiKey={GOOGLE_MAPS_API_KEY}
        libraries={GOOGLE_MAPS_LIBRARIES}
        render={render}
      />

      {/* Map overlay gradient */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-background/5" />
    </div>
  );
};