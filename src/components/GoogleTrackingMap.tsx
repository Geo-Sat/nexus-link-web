import React, {useCallback, useEffect, useRef} from 'react';
import {Status, Wrapper} from '@googlemaps/react-wrapper';
import { Asset, AssetTrackingAccount } from '@/types/asset.ts';
import {GOOGLE_MAPS_API_KEY, GOOGLE_MAPS_LIBRARIES, NAIROBI_CENTER} from '@/config/maps';
import {formatDistanceToNow} from 'date-fns';

import {MarkerClusterer} from '@googlemaps/markerclusterer';
import {LoadingView} from "@/components/shared/LoadingView.tsx";
import {ErrorView} from "@/components/shared/ErrorView.tsx";
import {animateMarkerRotation} from "@/utils/markerAnimations.ts";
import LatLng = google.maps.LatLng;

interface GoogleTrackingMapProps {
  asset: Asset;
  showingHistory: boolean;
  onMapLoad?: () => void;
}

interface MapComponentProps {
    asset: Asset;
    showingHistory: boolean;
    onMapLoad?: () => void;
}

const MapComponent: React.FC<MapComponentProps> = ({
  asset,
  showingHistory,
  onMapLoad
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const markers = useRef<{ [key: string]: google.maps.Marker }>({});
  const polylines = useRef<{ [key: string]: google.maps.Polyline }>({});
  const infoWindow = useRef<google.maps.InfoWindow | null>(null);
  const markerClusterer = useRef<MarkerClusterer | null>(null);

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

    const createMarker = useCallback((assetTrackingAccount: AssetTrackingAccount): google.maps.Symbol => {
      const fillColor = '#64748b'; // inactive color
      const scale = 1;

      return {
          path: `M 3,11 L 22,2 L 13,21 L 11,13 L 3,11 Z`,
          fillColor: fillColor,
          fillOpacity: 0.9,
          strokeColor: '#ffffff',
          strokeWeight: 1.5,
          scale: scale,
          anchor: new google.maps.Point(14, 11), // Adjusted anchor for better centering
          rotation: assetTrackingAccount.heading || 0
      };
  }, []);

    useEffect(() => {
        if (!map.current) return;

        const newMarkers: google.maps.Marker[] = [];
        const existingMarkerIds = new Set(Object.keys(markers.current));

        // update or create markers for each assetTrackingAccount
        asset?.asset_tracking_accounts.forEach((assetTrackingAccount) => {
            const markerId = assetTrackingAccount.id.toString();
            const existingMarker = markers.current[markerId];
        })

        asset?.asset_tracking_accounts.forEach(asset_tracking => {
            // create a LatLng object from the coordinates
            const position: LatLng = new google.maps.LatLng(asset_tracking.coordinates[0], asset_tracking.coordinates[1]);

            if (markers.current[asset_tracking.id]) {
                // Update existing marker
                const marker = markers.current[asset_tracking.id];
                const oldIcon = marker.getIcon() as google.maps.Symbol;
                const newIcon = createMarker(asset_tracking);
                marker.setPosition(position);
                marker.setIcon(newIcon);

                if (oldIcon.rotation !== asset_tracking.heading) {
                    animateMarkerRotation(asset_tracking.id.toString(), marker, oldIcon.rotation || 0, asset_tracking.heading || 0);
                }
                newMarkers.push(marker);
                existingMarkerIds.delete(asset_tracking.id.toString());
            } else {
                const marker = new google.maps.Marker({
                    position: position,
                    icon: createMarker(asset_tracking),
                    optimized: true,
                    title: asset_tracking.asset.registration,
                    animation: google.maps.Animation.DROP
                });

                // Add click listener
                marker.addListener('click', () => {
                    const content = createInfoWindowContent(asset_tracking);

                    infoWindow.current?.close();
                    infoWindow.current?.setContent(content);
                    infoWindow.current?.open(map.current!, marker);
                });

                markers.current[asset_tracking.id] = marker;
                newMarkers.push(marker);
            }
        });

    })
    // Function to generate popup content with updated styling
    const createInfoWindowContent = (assetTrackingAccount: AssetTrackingAccount): string => {
        const navUrl = `https://www.google.com/maps/dir/?api=1&destination=${assetTrackingAccount.coordinates[1]},${assetTrackingAccount.coordinates[0]}&travelmode=driving`;
        const trackingUrl = `https://btly.com/track/${assetTrackingAccount.id}`;
        const detailsUrl = `/tracking/${assetTrackingAccount.id}`;

        return `
        <div style="min-width: 280px">
          <div style="margin-bottom: 0.5rem">
            <div style="font-size: 0.875rem; font-weight: 600; color: #475569">
              ${assetTrackingAccount.asset.registration}
            </div>
            <div style="font-size: 0.75rem; color: #64748b">
              ${assetTrackingAccount.device.imei}
            </div>
            <div style="font-size: 0.75rem; color: #64748b">
              Last Update: ${formatDistanceToNow(new Date(assetTrackingAccount.last_update_time))} ago
            </div>
          </div>
    
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; margin-bottom: 1rem">
            <div>
              <div style="font-size: 0.75rem; font-weight: 500; color: #64748b; margin-bottom: 0.25rem">
                Status
              </div>
              <div style="font-size: 0.75rem; font-weight: 500; display: flex; align-items: center; gap: 0.5rem">
                <span style="display: inline-block; width: 0.5rem; height: 0.5rem; border-radius: 9999px; background-color: ${assetTrackingAccount.status === 'online' ? '#10b981' :
            assetTrackingAccount.status === 'offline' ? '#ef4444' : '#3acd30ff'
          }"></span>
                ${assetTrackingAccount.status}
              </div>
            </div>
    
            <div>
              <div style="font-size: 0.75rem; font-weight: 500; color: #64748b; margin-bottom: 0.25rem">
                Speed
              </div>
              <div style="font-size: 0.75rem; font-weight: 500">
                ${assetTrackingAccount.speed.toFixed(2)} km/h
              </div>
            </div>
    
            <div>
              <div style="font-size: 0.75rem; font-weight: 500; color: #64748b; margin-bottom: 0.25rem">
                Direction
              </div>
              <div style="font-size: 0.75rem; font-weight: 500">
                ${assetTrackingAccount.heading.toFixed(2)}°
              </div>
            </div>
    
            <div>
              <div style="font-size: 0.75rem; font-weight: 500; color: #64748b; margin-bottom: 0.25rem">
                Location
              </div>
              <div style="font-size: 0.75rem; font-weight: 500">
                ${assetTrackingAccount.coordinates.join(', ')}
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

export const GoogleTrackingMap: React.FC<GoogleTrackingMapProps> = (props) => {
  const render = (status: Status) => {
    switch (status) {
      case Status.LOADING:
        return <LoadingView headline={"Map"} subline={"Loading map data..."} />;
      case Status.FAILURE:
        return <ErrorView headline={"Map error"} status={status} subline={"Failed to load map data."} />;
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