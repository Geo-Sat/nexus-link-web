
import React, { useState, useEffect, ReactElement } from 'react';
import mapboxgl from 'mapbox-gl';

interface MapboxWrapperProps {
    accessToken: string;
    render: (status: 'loading' | 'success' | 'failure') => ReactElement;
}

const MapboxWrapper: React.FC<MapboxWrapperProps> = ({ accessToken, render }): ReactElement => {
    const [status, setStatus] = useState<'loading' | 'success' | 'failure'>('loading');

    useEffect(() => {
        mapboxgl.accessToken = accessToken;
        setStatus('success');
    }, [accessToken]);

    return render(status);
};

export default MapboxWrapper;
