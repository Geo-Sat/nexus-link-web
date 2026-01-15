
import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@/styles/markers.css';
import { AssetTrackingAccount } from '@/types/asset.ts';
import { MAPBOX_ACCESS_TOKEN, NAIROBI_CENTER } from '@/config/maps';
import { formatDistanceToNow } from 'date-fns';
import MapboxWrapper from './MapboxWrapper';
import { LoadingView } from "@/components/shared/LoadingView.tsx";
import { ErrorView } from "@/components/shared/ErrorView.tsx";

interface MapComponentProps {
    ata: AssetTrackingAccount | null;
    onMapLoad?: () => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ ata, onMapLoad }) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const marker = useRef<mapboxgl.Marker | null>(null);
    const popup = useRef<mapboxgl.Popup | null>(null);

    useEffect(() => {
        if (map.current) return; // initialize map only once
        if (!mapContainer.current) return;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [NAIROBI_CENTER.lng, NAIROBI_CENTER.lat],
            zoom: 4
        });

        map.current.on('load', () => {
            if (onMapLoad) {
                onMapLoad();
            }
        });
    }, [onMapLoad]);

    const createPopupContent = (assetTrackingAccount: AssetTrackingAccount): string => {
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
        <div class="mapboxgl-popup-content">
            <button class="mapboxgl-popup-close-button" type="button">×</button>
            <div class="popup-header">
                <div class="popup-title">
                    ${assetTrackingAccount.asset?.registration || 'Unknown Vehicle'}
                </div>
                <div class="popup-subtitle">
                    IMEI: ${assetTrackingAccount.imei || 'N/A'}
                </div>
                <div class="popup-subtitle">
                    Last Update: ${assetTrackingAccount.devices_status?.timestamp
            ? formatDistanceToNow(new Date(assetTrackingAccount.devices_status.timestamp)) + ' ago'
            : 'Unknown'
        }
                </div>
            </div>

            <div class="popup-grid">
                <div>
                    <div class="popup-grid-item-title">Status</div>
                    <div class="popup-grid-item-value">
                        <span class="popup-status-indicator" style="background-color: ${statusColor};"></span>
                        ${status}
                    </div>
                </div>
                <div>
                    <div class="popup-grid-item-title">Speed</div>
                    <div class="popup-grid-item-value">${(assetTrackingAccount.devices_status?.speed || 0).toFixed(1)} km/h</div>
                </div>
            </div>

            <div class="popup-button-grid">
                <a href="${trackingUrl}" target="_blank" class="popup-button">Share</a>
                <a href="${navUrl}" target="_blank" class="popup-button">Navigate</a>
                <a href="${detailsUrl}" class="popup-button">Details</a>
            </div>
        </div>
      `;
    };

    useEffect(() => {
        if (!map.current || !ata) {
            if (marker.current) {
                marker.current.remove();
                marker.current = null;
            }
            return;
        };

        const coordinates = ata.devices_status?.coordinates;
        if (!coordinates) return;

        const [latStr, lngStr] = coordinates.split(',');
        const lat = parseFloat(latStr);
        const lng = parseFloat(lngStr);

        if (isNaN(lat) || isNaN(lng)) return;

        const el = document.createElement('div');
        el.className = 'marker';

        const innerEl = document.createElement('div');
        innerEl.className = 'marker-inner';
        innerEl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-navigation"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>`;

        const pulseEl = document.createElement('div');
        pulseEl.className = 'pulse';

        el.appendChild(innerEl);
        el.appendChild(pulseEl);


        if (marker.current) {
            marker.current.setLngLat([lng, lat]);
        } else {
            marker.current = new mapboxgl.Marker(el)
                .setLngLat([lng, lat])
                .addTo(map.current);
        }

        if (popup.current) {
            popup.current.setLngLat([lng, lat])
                         .setHTML(createPopupContent(ata));
        } else {
            popup.current = new mapboxgl.Popup({ offset: 25, closeButton: false })
                .setLngLat([lng, lat])
                .setHTML(createPopupContent(ata))
                .addTo(map.current);
        }

        map.current.flyTo({
            center: [lng, lat],
            zoom: 15
        });

    }, [ata]);

    return <div ref={mapContainer} className="w-full h-full" />;
};

export const MapboxTrackingMap: React.FC<MapComponentProps> = (props) => {
    const render = (status: 'loading' | 'success' | 'failure') => {
        switch (status) {
            case 'loading':
                return <LoadingView headline={"Map"} subline={"Loading map data..."} />;
            case 'failure':
                return <ErrorView headline={"Map error"} status={status} subline={"Failed to load map data."} />;
            case 'success':
                return <MapComponent {...props} />;
        }
    };

    return (
        <div className="absolute inset-0">
            <MapboxWrapper
                accessToken={MAPBOX_ACCESS_TOKEN}
                render={render}
            />
        </div>
    );
};