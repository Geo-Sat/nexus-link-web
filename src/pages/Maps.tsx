import React, { useState, useEffect } from 'react';
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

  const navigate = useNavigate();

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

  // Simulate real-time vehicle movement
  useEffect(() => {
    const interval = setInterval(() => {
      simulateVehicleMovement();
      const updatedVehicles = [...vehicles];
      setVehicles(updatedVehicles);

      // Show notification for vehicle updates
      const movedVehicles = updatedVehicles.filter(v => {
        const oldVehicle = vehicles.find(oldV => oldV.id === v.id);
        return oldVehicle &&
          (oldVehicle.coordinates[0] !== v.coordinates[0] ||
            oldVehicle.coordinates[1] !== v.coordinates[1]);
      });

      if (movedVehicles.length > 0) {
        toast({
          title: "Vehicle Updates",
          description: `${movedVehicles.length} vehicles have moved`,
        });
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [vehicles, toast]);

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
      }
    }
  };

  const handleRemoveVehicle = (vehicleId: number) => {
    handleVehicleSelect(vehicleId, false);
  };

  const handleShowHistory = (vehicleIds: number[]) => {
    if (vehicleIds.length === 0) return;
    // navigate to trip history page with vehicleIds as query param in a blank tab
    // lets btoa the vehicleIds array
    // window.open(`/trips?vIds=${btoa(vehicleIds.join(','))}`, '_blank');
    navigate(`/trips?vIds=${btoa(vehicleIds.join(','))}`);
    // setShowingHistory(!showingHistory);
    // toast({
    //   title: showingHistory ? "History Hidden" : "History Visible",
    //   description: showingHistory 
    //     ? "Route history has been hidden" 
    //     : `Showing route history for ${vehicleIds.length} vehicle(s)`,
    // });
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
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
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