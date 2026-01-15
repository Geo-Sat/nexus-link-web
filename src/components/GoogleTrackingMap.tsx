import React, {useCallback, useEffect, useRef} from 'react';
import {Status, Wrapper} from '@googlemaps/react-wrapper';
import { AssetTrackingAccount } from '@/types/asset.ts';
import { GOOGLE_MAPS_API_KEY, GOOGLE_MAPS_LIBRARIES, NAIROBI_CENTER } from '@/config/maps';
import { formatDistanceToNow } from 'date-fns';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { LoadingView } from "@/components/shared/LoadingView.tsx";
import { ErrorView } from "@/components/shared/ErrorView.tsx";
import { animateMarkerRotation } from "@/utils/markerAnimations.ts";
import { useNavigate } from "react-router-dom";

import LatLng = google.maps.LatLng;

interface GoogleTrackingMapProps {
    ata: AssetTrackingAccount | null;
    onMapLoad?: () => void;
}

interface MapComponentProps {
    ata: AssetTrackingAccount | null;
    onMapLoad?: () => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ata, onMapLoad}) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const map = useRef<google.maps.Map | null>(null);
    const markers = useRef<{ [key: string]: google.maps.Marker }>({});
    const infoWindow = useRef<google.maps.InfoWindow | null>(null);
    const markerClusterer = useRef<MarkerClusterer | null>(null);
    const prevAtaRef = useRef<AssetTrackingAccount | null>(null);

    useEffect(() => {
        if (!mapRef.current || map.current) return;

        map.current = new google.maps.Map(mapRef.current, {
            center: NAIROBI_CENTER,
            zoom: 4,
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

        infoWindow.current = new google.maps.InfoWindow({
            disableAutoPan: true,
            maxWidth: 320,
            pixelOffset: new google.maps.Size(0, -20)
        });

        if (onMapLoad) {
            onMapLoad();
        }
    }, [onMapLoad]);

    const createMarker = useCallback((assetTrackingAccount: AssetTrackingAccount): google.maps.Symbol => {
        const getFillColor = () => {
            const status = assetTrackingAccount?.devices_status?.status ||
                (assetTrackingAccount?.devices_status?.gps_located ? 'online' : 'offline');

            switch (status) {
                case 'online':
                    return '#10b981';
                case 'offline':
                    return '#ef4444';
                default:
                    return '#f59e0b';
            }
        };

        const fillColor = getFillColor();
        const scale = 1.8;
        const carIcon: google.maps.Symbol = {
            path: `M 3,11 L 22,2 L 13,21 L 11,13 L 3,11 Z`,
            fillColor: fillColor,
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
            scale: scale,
            anchor: new google.maps.Point(14, 11),
            rotation: assetTrackingAccount.devices_status?.heading || 0
        }
        return carIcon;
    }, []);

    const createInfoWindowContent = useCallback((assetTrackingAccount: AssetTrackingAccount): string => {
        if (!assetTrackingAccount) return '<div>No asset data</div>';

        const coordinates = assetTrackingAccount.devices_status?.coordinates;
        const navUrl = coordinates
            ? `https://www.google.com/maps/dir/?api=1&destination=${coordinates}&travelmode=driving`
            : '#';

        const trackingUrl = `https://btly.com/track/${assetTrackingAccount.id}`;
        const detailsUrl = `/tracking/${assetTrackingAccount.id}`;

        // Determine status display
        const status = assetTrackingAccount.devices_status?.status ||
            (assetTrackingAccount.devices_status?.gps_located ? 'online' : 'offline');
        const statusColor = status === 'online' ? '#10b981' :
            status === 'offline' ? '#ef4444' : '#f59e0b';

        return `
        <div style="min-width: 280px">
          <div style="margin-bottom: 0.5rem">
            <div style="font-size: 0.875rem; font-weight: 600; color: #475569">
              ${assetTrackingAccount.asset?.registration || 'Unknown Vehicle'}
            </div>
            <div style="font-size: 0.75rem; color: #64748b">
              IMEI: ${assetTrackingAccount.imei || 'N/A'}
            </div>
            <div style="font-size: 0.75rem; color: #64748b">
              Last Update: ${assetTrackingAccount.devices_status?.timestamp
            ? formatDistanceToNow(new Date(assetTrackingAccount.devices_status.timestamp)) + ' ago'
            : 'Unknown'
        }
            </div>
          </div>
    
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; margin-bottom: 1rem">
            <div>
              <div style="font-size: 0.75rem; font-weight: 500; color: #64748b; margin-bottom: 0.25rem">
                Status
              </div>
              <div style="font-size: 0.75rem; font-weight: 500; display: flex; align-items: center; gap: 0.5rem">
                <span style="display: inline-block; width: 0.5rem; height: 0.5rem; border-radius: 9999px; background-color: ${statusColor}"></span>
                ${status}
              </div>
            </div>
    
            <div>
              <div style="font-size: 0.75rem; font-weight: 500; color: #64748b; margin-bottom: 0.25rem">
                Speed
              </div>
              <div style="font-size: 0.75rem; font-weight: 500">
                ${(assetTrackingAccount.devices_status?.speed || 0).toFixed(2)} km/h
              </div>
            </div>
    
            <div>
              <div style="font-size: 0.75rem; font-weight: 500; color: #64748b; margin-bottom: 0.25rem">
                Direction
              </div>
              <div style="font-size: 0.75rem; font-weight: 500">
                ${(assetTrackingAccount.devices_status?.heading || 0).toFixed(2)}°
              </div>
            </div>
    
            <div>
              <div style="font-size: 0.75rem; font-weight: 500; color: #64748b; margin-bottom: 0.25rem">
                GPS Located
              </div>
              <div style="font-size: 0.75rem; font-weight: 500">
                ${assetTrackingAccount.devices_status?.gps_located ? 'Yes' : 'No'}
              </div>
            </div>
          </div>

          ${assetTrackingAccount.devices_status?.alarm_status && assetTrackingAccount.devices_status.alarm_status !== 'Normal' ? `
          <div style="margin-bottom: 1rem; padding: 0.5rem; background-color: #fef3c7; border-radius: 0.375rem; border: 1px solid #f59e0b">
            <div style="font-size: 0.75rem; font-weight: 600; color: #92400e; margin-bottom: 0.25rem">
              Alarm Status
            </div>
            <div style="font-size: 0.75rem; color: #b45309">
              ${assetTrackingAccount.devices_status.alarm_status}
            </div>
          </div>
          ` : ''}
    
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
            
            <button onclick="${coordinates ? `window.open('${navUrl}', '_blank')` : 'alert(\'No coordinates available\')'}" style="
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
            
            <button onclick="window.location.href='${detailsUrl}'" style="
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
    }, []);

    const updateMarkerAndInfoWindow = useCallback(() => {
        if (!map.current || !ata) {
            // Clear markers if no ata provided
            if (markerClusterer.current) {
                markerClusterer.current.clearMarkers();
            }
            Object.values(markers.current).forEach(marker => marker.setMap(null));
            markers.current = {};
            infoWindow.current?.close();
            return;
        }

        if (!markerClusterer.current) {
            markerClusterer.current = new MarkerClusterer({
                map: map.current,
                algorithmOptions: {
                    maxZoom: 15
                }
            });
        }

        const newMarkers: google.maps.Marker[] = [];

        // Safe coordinate parsing
        const coordinates = ata?.devices_status?.coordinates;
        if (!coordinates) {
            console.warn('No coordinates for asset:', ata.id);
            return;
        }

        const [latStr, lngStr] = coordinates.split(',');
        const lat = parseFloat(latStr);
        const lng = parseFloat(lngStr);

        if (isNaN(lat) || isNaN(lng)) {
            console.warn('Invalid latitude/longitude for asset:', ata.id);
            return;
        }

        const position: LatLng = new google.maps.LatLng(lat, lng);

        if (markers.current[ata.id]) {
            // Update existing marker
            const marker = markers.current[ata.id];
            const oldIcon = marker.getIcon() as google.maps.Symbol;
            const newIcon = createMarker(ata);

            // Update position
            marker.setPosition(position);
            marker.setIcon(newIcon);

            // Animate rotation if heading changed
            const newHeading = ata.devices_status?.heading || 0;
            const oldHeading = oldIcon.rotation || 0;

            if (Math.abs(newHeading - oldHeading) > 1) {
                animateMarkerRotation(
                    ata.id.toString(),
                    marker,
                    oldHeading,
                    newHeading
                );
            }

            newMarkers.push(marker);

            // Update info window if it's open
            if (infoWindow.current && infoWindow.current.isOpen) {
                const content = createInfoWindowContent(ata);
                infoWindow.current.setContent(content);
            }
        } else {
            // Create new marker
            const marker = new google.maps.Marker({
                position: position,
                icon: createMarker(ata),
                optimized: true,
                title: ata.asset?.registration || 'Unknown Asset',
                animation: google.maps.Animation.DROP
            });

            // Add click listener
            marker.addListener('click', () => {
                const content = createInfoWindowContent(ata);
                infoWindow.current?.close();
                infoWindow.current?.setContent(content);
                infoWindow.current?.open(map.current!, marker);
            });

            markers.current[ata.id] = marker;
            newMarkers.push(marker);

            // Auto-open info window for new marker
            setTimeout(() => {
                const content = createInfoWindowContent(ata);
                infoWindow.current?.close();
                infoWindow.current?.setContent(content);
                infoWindow.current?.open(map.current!, marker);
            }, 500);
        }

        // Update marker clusterer
        markerClusterer.current.clearMarkers();
        markerClusterer.current.addMarkers(newMarkers);

        // Center map on marker if it's the only one
        if (newMarkers.length === 1) {
            const marker = newMarkers[0];
            map.current.panTo(marker.getPosition()!);
            if (map.current.getZoom() < 15) {
                map.current.setZoom(15);
            }
        }

    }, [ata, createMarker, createInfoWindowContent]);

    // Main effect that handles updates
    useEffect(() => {
        // Check if ata actually changed
        const hasAtaChanged = ata !== prevAtaRef.current;
        const hasDataChanged = ata?.devices_status?.timestamp !== prevAtaRef.current?.devices_status?.timestamp;

        if (hasAtaChanged || hasDataChanged) {
            updateMarkerAndInfoWindow();
            prevAtaRef.current = ata;
        }
    }, [ata, updateMarkerAndInfoWindow]);

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