/// <reference types="@types/google.maps" />
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { Vehicle } from '@/types/vehicle';
import { GOOGLE_MAPS_API_KEY, GOOGLE_MAPS_LIBRARIES, NAIROBI_CENTER } from '@/config/maps';
import { animateMarkerRotation } from '@/utils/markerAnimations';
import { formatDistanceToNow } from 'date-fns';

import { MarkerClusterer } from '@googlemaps/markerclusterer';

interface GoogleTrackingMapProps {
  vehicles: Vehicle[];
  selectedVehles: number[];
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

  // Create custom car marker with a white circle background
  const createCarMarker = useCallback((vehicle: Vehicle): google.maps.Icon => {
    const isSelected = selectedVehicles.includes(vehicle.id);
    let fillColor = '#64748b'; // inactive color
    const scale = isSelected ? 1.5 : 1.2; // larger size for selected vehicles
    const opacity = isSelected ? 1 : 0.7;

    if (vehicle.status === 'online') {
      fillColor = isSelected ? '#10b981' : '#277105ff'; // green for active
    } else if (vehicle.status === 'offline') {
      fillColor = isSelected ? '#b75151ff' : '#ef4444'; // red for offline
    }

    const heading = vehicle.heading || 0;
    const arrowPath = 'M 3,11 L 22,2 L 13,21 L 11,13 L 3,11 Z';
    const iconSize = 25 * scale;

    const svg = `
      <svg width="${iconSize}" height="${iconSize}" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
        <circle cx="15" cy="15" r="10" fill="white" stroke="#BDBDBD" stroke-width="1"/>
        <g transform="rotate(${heading}, 15, 15)">
          <g transform="translate(2.5, 3.5)">
            <path d="${arrowPath}" fill="${fillColor}" fill-opacity="${opacity}" stroke="#ffffff" stroke-width="0.7"/>
          </g>
        </g>
      </svg>
    `;

    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
      scaledSize: new window.google.maps.Size(iconSize, iconSize),
      anchor: new window.google.maps.Point(iconSize / 2, iconSize / 2),
    };
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
        const newIcon = createCarMarker(vehicle);
        
        marker.setPosition(position);
        marker.setIcon(newIcon);

        // NOTE: Smooth rotation animation (animateMarkerRotation) is not feasible 
        // when rotation is part of the SVG data URI. The icon's heading will
        // still update instantly with each data refresh.
        // const oldIcon = marker.getIcon() as google.maps.Symbol;
        // if (oldIcon.rotation !== vehicle.heading) {
        //   animateMarkerRotation(vehicle.id.toString(), marker, oldIcon.rotation || 0, vehicle.heading || 0);
        // }

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
  const createInfoWindowContent = (vehicle: Vehicle): string => {
    const navUrl = `https://www.google.com/maps/dir/?api=1&destination=${vehicle.coordinates[1]},${vehicle.coordinates[0]}&travelmode=driving`;
    const trackingUrl = `https://yourdomain.com/track/${vehicle.id}`;
    const detailsUrl = `/tracking/${vehicle.id}`;

    return `
    <div style="font-family: sans-serif; min-width: 280px; color: #333;">
      <div style="margin-bottom: 8px;">
        <div style="font-size: 1rem; font-weight: 600; color: #1e293b;">
          ${vehicle.registrationNumber}
        </div>
        <div style="font-size: 0.75rem; color: #64748b;">
          IMEI: ${vehicle.imei}
        </div>
        <div style="font-size: 0.75rem; color: #64748b;">
          Last Update: ${formatDistanceToNow(new Date(vehicle.lastUpdate))} ago
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 16px;">
        <div>
          <div style="font-size: 0.75rem; font-weight: 500; color: #64748b; margin-bottom: 4px;">Status</div>
          <div style="font-size: 0.875rem; font-weight: 600; display: flex; align-items: center; gap: 6px;">
            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 9999px; background-color: ${vehicle.status === 'online' ? '#10b981' : '#ef4444'
      };"></span>
            ${vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
          </div>
        </div>
        <div>
          <div style="font-size: 0.75rem; font-weight: 500; color: #64748b; margin-bottom: 4px;">Speed</div>
          <div style="font-size: 0.875rem; font-weight: 600;">${vehicle.speed.toFixed(1)} km/h</div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px;">
        <a href="${trackingUrl}" target="_blank" style="text-decoration: none; padding: 6px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 0.75rem; color: #0f172a; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px; font-weight: 500; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">Share</a>
        <a href="${navUrl}" target="_blank" style="text-decoration: none; padding: 6px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 0.75rem; color: #0f172a; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px; font-weight: 500; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">Navigate</a>
        <a href="${detailsUrl}" target="_blank" style="text-decoration: none; padding: 6px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 0.75rem; color: #0f172a; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px; font-weight: 500; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">Details</a>
      </div>
    </div>
  `;
  };

  return <div ref={mapRef} className="w-full h-full" />;
};


// Other components (LoadingComponent, ErrorComponent) remain the same...

const LoadingComponent = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-background">
    <div className="p-6 text-center">
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
    <div className="p-6 max-w-md text-center">
      <h2 className="text-lg font-semibold text-destructive mb-2">
        Map Loading Error
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        Status: {status}
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
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-background/5" />
    </div>
  );
};