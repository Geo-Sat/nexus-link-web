import React, { useState, useEffect, useRef } from 'react';
import { GoogleTrackingMap } from '@/components/GoogleTrackingMap';
import { VehicleSearchOverlay } from '@/components/VehicleSearchOverlay';
import { SelectedVehiclesTable } from '@/components/SelectedVehiclesTable';
import { Vehicle } from '@/types/vehicle';
import { fetchVehicles, simulateVehicleMovement } from '@/data/mockVehicles';
import { fetchAccounts } from '@/data/mockAccount';
import { useToast } from '@/hooks/use-toast';
import '@/styles/overlays.css';
import { X, ChevronDown, Search, Check, ChevronUp, Car } from 'lucide-react';
import { Account } from '@/types/account';
import { useNavigate } from 'react-router-dom';
import { LiveTrackingData } from '@/types/live-tracking';

export function MapsPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Account[]>([]);
  const [selectedVehicles, setSelectedVehicles] = useState<number[]>([]);
  const [selectedDrivers, setSelectedDrivers] = useState<number[]>([]);
  const [showingHistory, setShowingHistory] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showDriverPopup, setShowDriverPopup] = useState(false);
  const [driverSearchTerm, setDriverSearchTerm] = useState('');
  const { toast } = useToast();
  const [isVehicleSearchOpen, setIsVehicleSearchOpen] = useState(true);
  const [isSelectedVehiclesOpen, setIsSelectedVehiclesOpen] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'error'>('disconnected');
  
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  // Get WebSocket URL based on environment
  const getWebSocketUrl = () => {
    let wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    let imeiParam = '0358657105381656'; 
    let hostParam = window.location.host;
    hostParam = '65.109.170.207:8000';
    // For development - use localhost or your server URL
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return `${wsProtocol}://${hostParam}/ws/${imeiParam}`;
    }
    // For production - use wss:// with the same host
    return `wss://${hostParam}/ws/${imeiParam}`;
  };

  // WebSocket connection management
  useEffect(() => {
    connectWebSocket();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
    };
  }, []);

  const connectWebSocket = () => {
    try {
      const socketUrl = getWebSocketUrl();
      console.log('Connecting to WebSocket:', socketUrl);
      
      ws.current = new WebSocket(socketUrl);
      
      ws.current.onopen = () => {
        setConnectionStatus('connected');
        console.log('WebSocket connected');
        toast({
          title: "Connected",
          description: "Real-time tracking enabled",
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
        
        // Attempt to reconnect after 5 seconds
        reconnectTimeout.current = setTimeout(() => {
          console.log('Attempting to reconnect...');
          connectWebSocket();
        }, 5000);
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
      // Fallback to mock data if WebSocket fails
      startMockUpdates();
    }
  };

  // Fallback to mock updates if WebSocket fails
  const startMockUpdates = () => {
    const interval = setInterval(() => {
      simulateVehicleMovement();
      const updatedVehicles = [...vehicles];
      setVehicles(updatedVehicles);
    }, 5000);

    return () => clearInterval(interval);
  };

  const handleWebSocketMessage = (data: any) => {
    // Handle different types of WebSocket messages
    switch (data.type) {
      case 'gps_log':
        handleVehicleUpdate(data);
        break;
      case 'status_log':
        handleVehicleStatusUpdate(data);
        break;
      case 'bulk_update':
        handleBulkVehicleUpdate(data);
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  };

  const handleVehicleUpdate = (data: LiveTrackingData) => {
    var updatedVehicle: Partial<Vehicle> = {
      imei: data.imei,
      coordinates: [data.longitude, data.latitude],
      speed: data.speed,
      heading: parseFloat(data.course),
      lastUpdate: new Date(data.timestamp * 1000),
    };    
    setVehicles(prev => prev.map(vehicle => 
      vehicle.imei == updatedVehicle.imei
        ? { ...vehicle, ...updatedVehicle }
        : vehicle
    ));

    // Show notification for significant movements
    // const oldVehicle = vehicles.find(v => v.imei == updatedVehicle.imei);
    // console.log(vehicles);


    // if (oldVehicle && 
    //     (oldVehicle.coordinates[0] !== updatedVehicle.coordinates[0] ||
    //      oldVehicle.coordinates[1] !== updatedVehicle.coordinates[1])) {
    //   toast({
    //     title: "Vehicle Moved",
    //     description: `${oldVehicle.registrationNumber} has updated its position and is moving at ${updatedVehicle.speed} km/h heading ${updatedVehicle.heading}°`,
    //   });
    // }
  };

  const handleVehicleStatusUpdate = (statusUpdate: { vehicleId: number; status: string }) => {
    // setVehicles(prev => prev.map(vehicle => 
    //   vehicle.id === statusUpdate.vehicleId 
    //     ? { ...vehicle, status: statusUpdate.status }
    //     : vehicle
    // ));

    const vehicle = vehicles.find(v => v.id === statusUpdate.vehicleId);
    if (vehicle) {
      toast({
        title: "Status Update",
        description: `${vehicle.registrationNumber} is now ${statusUpdate.status}`,
      });
    }
  };

  const handleBulkVehicleUpdate = (vehiclesData: Vehicle[]) => {
    setVehicles(prev => {
      const updatedVehicles = [...prev];
      vehiclesData.forEach(updatedVehicle => {
        const index = updatedVehicles.findIndex(v => v.id === updatedVehicle.id);
        if (index !== -1) {
          updatedVehicles[index] = { ...updatedVehicles[index], ...updatedVehicle };
        }
      });
      return updatedVehicles;
    });
  };

  // Send message to WebSocket (e.g., to subscribe to specific vehicles)
  const sendWebSocketMessage = (message: any) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  };

  // Subscribe to selected vehicles for real-time updates
  useEffect(() => {
    if (selectedVehicles.length > 0 && connectionStatus === 'connected') {
      sendWebSocketMessage({
        type: 'subscribe',
        vehicleIds: selectedVehicles
      });
    }
  }, [selectedVehicles, connectionStatus]);

  // Load initial vehicle and driver data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [vehicleData, driverData] = await Promise.all([
          fetchVehicles(),
          fetchAccounts()
        ]);
        setVehicles(vehicleData);
        setDrivers(driverData);
        setLoading(false);

        toast({
          title: "Data Loaded",
          description: `${vehicleData.length} vehicles and ${driverData.length} drivers loaded`,
        });
      } catch (error) {
        console.error('Failed to load data:', error);
        toast({
          title: "Error",
          description: "Failed to load data",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    loadData();
  }, [toast]);

  const handleVehicleSelect = (vehicleId: number, isSelected: boolean) => {
    setSelectedVehicles(prev =>
      isSelected
        ? [...prev, vehicleId]
        : prev.filter(id => id !== vehicleId)
    );

    // Update vehicle selection state
    setVehicles(prev =>
      prev.map(vehicle =>
        vehicle.id === vehicleId
          ? { ...vehicle, isSelected }
          : vehicle
      )
    );

    if (isSelected) {
      const vehicle = vehicles.find(v => v.id === vehicleId);
      if (vehicle) {
        toast({
          title: "Vehicle Selected",
          description: `${vehicle.registrationNumber} added to tracking`,
        });

        // Subscribe to this vehicle for real-time updates
        if (connectionStatus === 'connected') {
          sendWebSocketMessage({
            type: 'subscribe',
            vehicleIds: [vehicleId]
          });
        }
      }
    }
  };

  const handleRemoveVehicle = (vehicleId: number) => {
    handleVehicleSelect(vehicleId, false);
  };

  const handleShowHistory = (vehicleIds: number[]) => {
    if (vehicleIds.length === 0) return;
    navigate(`/trips?vIds=${btoa(vehicleIds.join(','))}`);
  };

  const toggleDriverSelection = (driverId: number) => {
    setSelectedDrivers(prev =>
      prev.includes(driverId)
        ? prev.filter(id => id !== driverId)
        : [...prev, driverId]
    );
  };

  const selectAllDrivers = () => {
    if (selectedDrivers.length === drivers.length) {
      setSelectedDrivers([]);
    } else {
      setSelectedDrivers(drivers.map(d => d.id));
    }
  };

  const clearDriverFilters = () => {
    setSelectedDrivers([]);
    setShowDriverPopup(false);
  };

  const applyDriverFilters = () => {
    setShowDriverPopup(false);
    toast({
      title: "Filters Applied",
      description: selectedDrivers.length > 0
        ? `Showing vehicles for ${selectedDrivers.length} driver(s)`
        : "Showing all vehicles",
    });
  };

  const handleViewAccount = (accountId: number) => {
    navigate(`/accounts/${accountId}`);
  };

  // Filter vehicles based on selected drivers
  const filteredVehicles = selectedDrivers.length > 0
    ? vehicles.filter(vehicle => selectedDrivers.includes(vehicle.account.id))
    : vehicles;

  const selectedVehicleData = filteredVehicles.filter(v => selectedVehicles.includes(v.id));
  const mappedVehicles = (selectedVehicleData.length > 0) ? selectedVehicleData : filteredVehicles;

  const filteredDrivers = drivers.filter(driver =>
    driver.name.toLowerCase().includes(driverSearchTerm.toLowerCase()) ||
    driver.id.toString().toLowerCase().includes(driverSearchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="glass-panel p-8 text-center">
          <div className="animate-pulse-slow mb-4">
            <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z" />
              </svg>
            </div>
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Loading...
          </h2>
          <p className="text-sm text-muted-foreground">
            Initializing and loading map...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex-1 bg-background h-[calc(100vh-5rem)]">
      {/* Map container */}
      <GoogleTrackingMap
        vehicles={mappedVehicles}
        selectedVehicles={selectedVehicles}
        showingHistory={showingHistory}
      />

      {/* Connection status indicator */}
      <div className="absolute top-4 right-4 z-40">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
          connectionStatus === 'connected' 
            ? 'bg-green-500/20 text-green-600' 
            : connectionStatus === 'error'
            ? 'bg-red-500/20 text-red-600'
            : 'bg-yellow-500/20 text-yellow-600'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            connectionStatus === 'connected' 
              ? 'bg-green-500 animate-pulse' 
              : connectionStatus === 'error'
              ? 'bg-red-500'
              : 'bg-yellow-500'
          }`}></div>
          {connectionStatus === 'connected' ? 'Live' : 
           connectionStatus === 'error' ? 'Connection Error' : 'Connecting...'}
        </div>
      </div>

      {/* Search Overlay */}
      <div className="search-overlay glass-overlay p-0.5">
        <div
          className="flex items-center justify-between p-2 cursor-pointer"
          onClick={() => setIsVehicleSearchOpen(!isVehicleSearchOpen)}
        >
          <h4 className="text-md font-semibold text-foreground">Vehicle Search</h4>

          {isVehicleSearchOpen ? (
            <ChevronDown size={20} />
          ) : (
            <ChevronUp size={20} />
          )}
        </div>

        {isVehicleSearchOpen && (
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
                  {selectedDrivers.length === 0
                    ? 'All Accounts'
                    : selectedDrivers.length === 1
                      ? "1 Account Selected"
                      : `${selectedDrivers.length} Accounts Selected`}
                </span>
                <ChevronDown size={16} />
              </button>
            </div>

            <VehicleSearchOverlay
              vehicles={filteredVehicles}
              selectedVehicles={selectedVehicles}
              onVehicleSelect={handleVehicleSelect}
              onShowHistory={handleShowHistory}
              showingHistory={showingHistory}
            />
          </>
        )}
      </div>

      {/* Selected Vehicles Table */}
      {selectedVehicleData.length > 0 && (
        <SelectedVehiclesTable
          vehicles={selectedVehicleData}
          onRemoveVehicle={handleRemoveVehicle}
          showingHistory={showingHistory}
          isCollapsed={!isSelectedVehiclesOpen}
          onToggleCollapse={() => setIsSelectedVehiclesOpen(!isSelectedVehiclesOpen)}
        />
      )}

      {/* Status Bar */}
      <div className="status-bar" style={{ bottom: '0.1rem' }}>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
            }`}></div>
            <span className="text-muted-foreground">
              {connectionStatus === 'connected' ? 'Live' : 'Offline'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-muted-foreground">
              {filteredVehicles.filter(v => v.status === 'online').length} Online
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-400"></div>
            <span className="text-muted-foreground">
              {filteredVehicles.filter(v => v.status === 'offline').length} Offline
            </span>
          </div>
        </div>
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
                  value={driverSearchTerm}
                  onChange={(e) => setDriverSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-2 border-b border-border sticky top-0 bg-background z-10">
                <button
                  onClick={selectAllDrivers}
                  className="text-sm text-primary hover:underline"
                >
                  {selectedDrivers.length === drivers.length ? "Deselect All" : "Select All"}
                </button>
              </div>

              <div className="divide-y divide-border">
                {filteredDrivers.length > 0 ? (
                  filteredDrivers.map(driver => (
                    <div
                      key={driver.id}
                      className="p-3 flex items-center gap-3 cursor-pointer hover:bg-accent/30 transition-colors"
                      onClick={() => toggleDriverSelection(driver.id)}
                    >
                      <div className={`w-5 h-5 rounded border flex items-center justify-center ${selectedDrivers.includes(driver.id)
                        ? 'bg-primary border-primary'
                        : 'border-border'
                        }`}>
                        {selectedDrivers.includes(driver.id) && (
                          <Check size={14} className="text-primary-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{driver.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {vehicles.filter(v => v.account.id === driver.id).length} vehicles
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No drivers found
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between p-4 border-t border-border">
              <button
                onClick={clearDriverFilters}
                className="px-4 py-2 text-foreground/70 hover:text-foreground"
              >
                Clear
              </button>
              <button
                onClick={applyDriverFilters}
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