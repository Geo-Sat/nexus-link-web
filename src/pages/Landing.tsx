
import React, { useState, useEffect } from 'react';
import { GoogleTrackingMap } from '@/components/GoogleTrackingMap';
import { VehicleSearchOverlay } from '@/components/VehicleSearchOverlay';
import { SelectedVehiclesTable } from '@/components/SelectedVehiclesTable';
import { Vehicle } from '@/types/vehicle';
import { fetchVehicles, simulateVehicleMovement } from '@/data/mockVehicles';
import { fetchAccounts } from '@/data/mockAccount';
import { useToast } from '@/hooks/use-toast';
import '@/styles/overlays.css';
import { AccountSearchOverlay } from '@/components/AccountSearchOverlay';
import { Account } from '@/types/account';

export function LandingPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Account[]>([]);
  const [selectedVehicles, setSelectedVehicles] = useState<number[]>([]);
  const [selectedDrivers, setSelectedDrivers] = useState<number[]>([]);
  const [showingHistory, setShowingHistory] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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
    window.open(`/trips?vIds=${btoa(vehicleIds.join(','))}`, '_blank');
  };

  const handleAccountSelect = (accountId: number, isSelected: boolean) => {
    setSelectedDrivers(prev =>
      isSelected
        ? [...prev, accountId]
        : prev.filter(id => id !== accountId)
    );
  };

  // Filter vehicles based on selected drivers
  const filteredVehicles = selectedDrivers.length > 0
    ? vehicles.filter(vehicle => selectedDrivers.includes(vehicle.account.id))
    : vehicles;

  const selectedVehicleData = filteredVehicles.filter(v => selectedVehicles.includes(v.id));

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
    <div className="relative h-[calc(100vh-10rem)]">
      {/* Left Panel */}
      <div className="absolute top-0 left-0 w-1/4 h-full flex flex-col space-y-4 p-4 z-10 left-panel">
        {/* Accounts */}
        <div className="glass-overlay flex flex-col p-4 h-[45%] overflow-y-auto account-search-overlay">
          <AccountSearchOverlay
            accounts={drivers}
            vehicles={vehicles}
            selectedAccounts={selectedDrivers}
            onAccountSelect={handleAccountSelect}
          />
        </div>
        {/* Vehicle Search */}
        <div className="glass-overlay p-4 flex-shrink-0 h-[55%] overflow-y-auto vehicle-search-overlay">
          <VehicleSearchOverlay
            vehicles={filteredVehicles}
            selectedVehicles={selectedVehicles}
            onVehicleSelect={handleVehicleSelect}
            onShowHistory={handleShowHistory}
            showingHistory={showingHistory}
          />
        </div>
      </div>

      {/* Right Panel (Map) */}
      <div className="w-full h-full google-map-container">
        <GoogleTrackingMap
          vehicles={filteredVehicles}
          selectedVehicles={selectedVehicles}
          showingHistory={showingHistory}
        />
      </div>

      {/* Selected Vehicles Table */}
      <div className="selected-vehicles-overlay selected-vehicles-table">
        <SelectedVehiclesTable
          vehicles={selectedVehicleData}
          onRemoveVehicle={handleRemoveVehicle}
          showingHistory={showingHistory}
        />
      </div>
    </div>
  );
}
