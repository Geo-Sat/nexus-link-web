import React, { useState, useEffect, useRef } from 'react';

import '@/styles/overlays.css';
import apiClient from '@/lib/api.ts';
import { Account } from '@/types/account.ts';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast.ts';
import { MapsData } from '@/types/pages/maps.ts';
import { TrackingWebSocketData } from '@/types/tracking.ts';
import { Asset, AssetTrackingAccount } from '@/types/asset.ts';
import { LoadingView } from "@/components/shared/LoadingView.tsx";
import { GoogleTrackingMap } from '@/components/GoogleTrackingMap.tsx';
import { MapboxTrackingMap }  from '@/components/MapboxTrackingMap.tsx';
import { AssetSearchOverlay } from '@/components/AssetSearchOverlay.tsx';
import { X, ChevronDown, Search, Check, ChevronUp, Car, Map, Globe } from 'lucide-react';


export function MapsPage() {
    const [loading, setLoading] = useState(true);
    const [mapsData, setMapsData] = useState<MapsData>(null);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [selectedAsset, setSelectedAsset] = useState<Asset>(null);
    const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
    const [selectedCurrentAssetTrackingAccount, setSelectedCurrentAssetTrackingAccount] = useState<AssetTrackingAccount>(null);
    const [selectedAccountIds, setSelectedAccountIds] = useState<number[]>([]);
    const [showDriverPopup, setShowDriverPopup] = useState(false);
    const [accountSearchTerm, setAccountSearchTerm] = useState('');
    const { toast } = useToast();
    const [isAssetSearchOpen, setIsAssetSearchOpen] = useState(true);
    const [mapType, setMapType] = useState<'google' | 'mapbox'>('google'); // Add mapType state

    const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'error'>('disconnected');
    const ws = useRef<WebSocket | null>(null);
    const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await apiClient.get('core/maps/data');
                const apiData:MapsData = response.data;
                setMapsData(apiData);
                setAssets(apiData.accounts.flatMap(account => account.assets));
                setLoading(false);
            } catch (error) {
                console.error('Failed to load map data', error);
                toast({
                    title: "Server Error",
                    description: "No data to show.",
                    variant: "destructive",
                });
                setLoading(false);
            }
        };
        loadData().then().catch().finally();
    }, [toast]);

    const filteredAccounts: Account[] = mapsData?.accounts?.filter(account =>
        account.name.toLowerCase().includes(accountSearchTerm.toLowerCase()) ||
        account.phone.toString().toLowerCase().includes(accountSearchTerm.toLowerCase())
    );

    const filteredAssets = selectedAccountIds.length > 0
        ? assets.filter(asset => selectedAccountIds.includes(asset.account.id))
        : assets;

    const handleSelectAllAccounts = () => {
        if (selectedAccountIds.length === mapsData.accounts.length) {
            setSelectedAccountIds([]);
        } else {
            setSelectedAccountIds(mapsData.accounts.map(d => d.id));
        }
    };

    const handleAssetSelect = (assetId: string, isSelected: boolean) => {
        setSelectedAssetIds([]);
        setSelectedAsset(null);

        setSelectedAssetIds(prev =>
            isSelected
                ? [...prev, assetId]
                : prev.filter(id => id !== assetId)
        );

        const newlySelectedAsset = assets.find(asset => asset.code === assetId);
        setAssets(prev =>
            prev.map(asset =>
                asset.code === assetId
                    ? {...asset, isSelected}
                    : asset
            )
        );

        if (isSelected && newlySelectedAsset) {
            setSelectedAsset(newlySelectedAsset);
            // check if asset has an account tracking
            if (newlySelectedAsset.tracking_accounts.length > 0) {
                setSelectedCurrentAssetTrackingAccount(newlySelectedAsset.tracking_accounts[0]);
                // Start WebSocket connection when asset is selected
                connectWebSocket(newlySelectedAsset, 0);
            }else{
                toast({
                    title: "No Account Tracking",
                    description: "This asset does not have an account tracking enabled.",
                    variant: "destructive",
                })
                disconnectWebSocket();
            }
        } else {
            // Close WebSocket connection when asset is deselected
            disconnectWebSocket();
            setSelectedAsset(null);
        }
    };

    const toggleAccountSelection = (accountId: number) => {
        setSelectedAccountIds(prev =>
            prev.includes(accountId)
                ? prev.filter(id => id !== accountId)
                : [...prev, accountId]
        );
        console.log(selectedAccountIds);
    };

    const clearAccountFilters = () => {
        setSelectedAccountIds([]);
        setShowDriverPopup(false);
    };

    const applyAccountFilters = () => {
        setShowDriverPopup(false);
        toast({
            title: "Filters Applied",
            description: selectedAccountIds.length > 0
                ? `Showing assets for ${selectedAccountIds.length} accounts(s)`
                : "Showing all assets",
        });
    };

    // WEBSOCKET CONNECTION MANAGEMENT
    const handleWebSocketMessage = (data: TrackingWebSocketData) => {
        // Handle different types of WebSocket messages
        switch (data?.type) {
            case 'gps_log':
                handleAssetLocationUpdate(data);
                break;
            case 'status_log':
                handleAssetStatusUpdate(data);
                break;
            default:
                console.log('Unknown message type:', data.type);
                break;
        }
    };

    const handleAssetLocationUpdate = (data: any) => {
        if (selectedCurrentAssetTrackingAccount) {
            setSelectedCurrentAssetTrackingAccount(prev => {
                if (!prev) return prev;

                // Convert timestamp to ISO string if it's a Unix timestamp
                const timestamp = data.timestamp
                    ? (typeof data.timestamp === 'number'
                        ? new Date(data.timestamp * 1000).toISOString()
                        : data.timestamp)
                    : new Date().toISOString();

                // Create a completely new object to force React to detect changes
                const newDevicesStatus = {
                    ...prev.devices_status,
                    coordinates: `${data.latitude},${data.longitude}`,
                    speed: parseFloat(data.speed) || 0,
                    heading: parseFloat(data.course) || 0,
                    timestamp: timestamp,
                    gps_located: data.gps_located,
                    status: 'online'
                };

                // Return completely new object
                return {
                    ...prev,
                    devices_status: newDevicesStatus
                };
            });
        }
        console.log('Asset location update:', data);
    };

    const handleAssetStatusUpdate = (data: any) => {
        if (selectedCurrentAssetTrackingAccount) {
            setSelectedCurrentAssetTrackingAccount(prev => {
                if (!prev) return prev;

                // Convert timestamp to ISO string if it's a Unix timestamp
                const timestamp = data.timestamp
                    ? (typeof data.timestamp === 'number'
                        ? new Date(data.timestamp * 1000).toISOString()
                        : data.timestamp)
                    : new Date().toISOString();

                // Create a completely new object to force React to detect changes
                const newDevicesStatus = {
                    ...prev.devices_status,
                    timestamp: timestamp,
                    alarm_status: data.alarm_status,
                    charging: data.charging,
                    fortified: data.fortified,
                    petrol_electricity_off: data.petrol_electricity_off,
                    gsm_signal: data.gsm_signal,
                    voltage_level: data.voltage_level,
                    acc_high: data.acc_high,
                    gps_located: data.gps_located,
                    // Preserve existing location data
                    coordinates: prev.devices_status?.coordinates || prev.devices_status?.coordinates,
                    speed: prev.devices_status?.speed || prev.devices_status?.speed,
                    heading: prev.devices_status?.heading || prev.devices_status?.heading
                };

                // Return completely new object
                return {
                    ...prev,
                    devices_status: newDevicesStatus
                };
            });
        }
        console.log('Asset status update:', data);
    };

    const getWebSocketUrl = (assetTrackingAccount: AssetTrackingAccount) => {
        const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
        // Use the asset's IMEI or unique identifier for the WebSocket connection
        const imeiParam = assetTrackingAccount.imei;
        let hostParam = window.location.host;
        hostParam = '65.109.170.207:8000';

        // For development - use localhost or your server URL
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return `${wsProtocol}://${hostParam}/ws/${imeiParam}`;
        }

        hostParam = 'ws.nexus-link.geo-sat.co.ke';
        // For production - use wss:// with the same host
        return `wss://${hostParam}/ws/${imeiParam}`;
    };

    const connectWebSocket = (asset: Asset, _index: number) => {
        // Close existing connection if any
        disconnectWebSocket();
        try {
            const socketUrl = getWebSocketUrl(asset.tracking_accounts[_index]);
            console.log('Connecting to WebSocket:', socketUrl);
            ws.current = new WebSocket(socketUrl);

            ws.current.onopen = () => {
                setConnectionStatus('connected');
                console.log('WebSocket connected');
                toast({
                    title: "Connected",
                    description: `Real-time tracking enabled for ${asset.registration} on account ${asset.tracking_accounts[_index].imei}`,
                    variant: "default",
                });
            };

            ws.current.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    handleWebSocketMessage(data);
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };

            ws.current.onclose = () => {
                setConnectionStatus('disconnected');
                console.log('WebSocket disconnected');

                // Only attempt to reconnect if there's still a selected asset
                if (selectedAsset) {
                    reconnectTimeout.current = setTimeout(() => {
                        console.log('Attempting to reconnect...');
                        connectWebSocket(selectedAsset, 0);
                    }, 5000);
                }
            };

            ws.current.onerror = (error) => {
                console.error('WebSocket error:', error);
                setConnectionStatus('error');
                toast({
                    title: "Connection Error",
                    description: "Failed to connect to real-time server",
                    variant: "destructive",
                });
            };

        } catch (error) {
            console.error('Failed to create WebSocket:', error);
        }
    };

    const disconnectWebSocket = () => {
        if (ws.current) {
            ws.current.close();
            ws.current = null;
        }
        if (reconnectTimeout.current) {
            clearTimeout(reconnectTimeout.current);
            reconnectTimeout.current = null;
        }
        setConnectionStatus('disconnected');
    };

    // Cleanup WebSocket on component unmount
    useEffect(() => {
        return () => {
            disconnectWebSocket();
        };
    }, []);

    // END OF WEBSOCKET CONNECTION MANAGEMENT

    if (loading) {
        return (<LoadingView headline={`Loading`} subline={`Initializing map...`}/>);
    }

    return (
        <div className="relative flex-1 bg-background h-[calc(100vh-5rem)]">
            {/* Map container */}
            {mapType === 'google' ? (
                <GoogleTrackingMap
                    ata={selectedCurrentAssetTrackingAccount}
                />
            ) : (
                <MapboxTrackingMap
                    ata={selectedCurrentAssetTrackingAccount}
                />
            )}

            {/* Map type toggle */}
            <div className="absolute top-4 right-4 z-10 bg-background p-1 rounded-full shadow-lg flex items-center gap-1">
                <button
                    className={`p-2 rounded-full ${mapType === 'google' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
                    onClick={() => setMapType('google')}
                    aria-label="Switch to Google Maps"
                >
                    <Globe size={20} />
                </button>
                <button
                    className={`p-2 rounded-full ${mapType === 'mapbox' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
                    onClick={() => setMapType('mapbox')}
                    aria-label="Switch to Mapbox"
                >
                    <Map size={20} />
                </button>
            </div>

            {/* Search Overlay */}
            <div className="search-overlay glass-overlay p-0.5">
                <div
                    className="flex items-center justify-between p-2 cursor-pointer"
                    onClick={() => setIsAssetSearchOpen(!isAssetSearchOpen)}
                >
                    <h4 className="text-md font-semibold text-foreground">Vehicle Search</h4>

                    {isAssetSearchOpen ? (
                        <ChevronDown size={20} />
                    ) : (
                        <ChevronUp size={20} />
                    )}
                </div>

                {isAssetSearchOpen && (
                    <>
                        <div className="driver-filter-container mb-3 px-2">
                            <button
                                className="driver-filter-button flex items-center gap-2 px-3 py-2 bg-background/80 rounded-md border border-border hover:bg-accent transition-colors w-full"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowDriverPopup(true);
                                }}
                            >
                    <span className="float-right text-sm text-foreground w-full">
                      {selectedAccountIds.length === 0
                          ? 'All Accounts'
                          : selectedAccountIds.length === 1
                              ? "1 Account Selected"
                              : `${selectedAccountIds.length} Accounts Selected`}
                    </span>
                                <ChevronDown size={16} />
                            </button>
                        </div>

                        <AssetSearchOverlay
                            assets={filteredAssets}
                            selectedAssetIds={selectedAssetIds}
                            onAssetSelect={handleAssetSelect}
                            onShowHistory={null}
                            showingHistory={null}
                        />
                    </>
                )}
            </div>

            {/* Driver Selection Popup */}
            {showDriverPopup && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-background rounded-lg shadow-lg w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b border-border">
                            <h3 className="font-semibold">Select Accounts</h3>
                            <button
                                onClick={() => setShowDriverPopup(false)}
                                className="p-1 rounded-full hover:bg-accent"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-4 border-b border-border">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search account..."
                                    className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background"
                                    value={accountSearchTerm}
                                    onChange={(e) => setAccountSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            <div className="p-2 border-b border-border sticky top-0 bg-background z-10">
                                <button
                                    onClick={handleSelectAllAccounts}
                                    className="text-sm text-primary hover:underline"
                                >
                                    { (selectedAccountIds.length === mapsData.accounts.length) ? "Deselect All" : (mapsData.accounts.length > 0 ? "Select All" : "No Accounts Found")}
                                </button>
                            </div>

                            <div className="divide-y divide-border">
                                { (filteredAccounts.length > 0) ? (
                                        filteredAccounts.map(account => (
                                            <div
                                                key={account.id}
                                                className="p-3 flex items-center gap-3 cursor-pointer hover:bg-accent/30 transition-colors"
                                                onClick={() => toggleAccountSelection(account.id)}
                                            >
                                                <div className={`w-5 h-5 rounded border flex items-center justify-center ${selectedAccountIds.includes(account.id)
                                                    ? 'bg-primary border-primary'
                                                    : 'border-border'
                                                }`}>
                                                    {selectedAccountIds.includes(account.id) && (
                                                        <Check size={14} className="text-primary-foreground" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-medium">{account.name}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {account.assets_count} assets
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) :
                                    (
                                        <div className="p-4 text-center text-muted-foreground">
                                            No Accounts found
                                        </div>
                                    )
                                }
                            </div>
                        </div>

                        <div className="flex justify-between p-4 border-t border-border">
                            <button
                                onClick={clearAccountFilters}
                                className="px-4 py-2 text-foreground/70 hover:text-foreground"
                            >
                                Clear
                            </button>
                            <button
                                onClick={applyAccountFilters}
                                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}