import React, { useState, useMemo } from 'react';
import { Search, Filter, MapPin, Clock, User, UserCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Vehicle } from '@/types/vehicle';
import { cn } from '@/lib/utils';
import { Account } from '@/types/account';
import {Asset} from "@/types/asset.ts";

interface VehicleSearchOverlayProps {
  assets: Asset[];
  selectedVehicles: number[];
  onVehicleSelect: (vehicleId: number, isSelected: boolean) => void;
  onShowHistory: (vehicleIds: number[]) => void;
  showingHistory: boolean;
}

export const VehicleSearchOverlay: React.FC<VehicleSearchOverlayProps> = ({assets, selectedVehicles,
  onVehicleSelect,
  onShowHistory,
  showingHistory
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  const filteredVehicles = useMemo(() => {
    return assets.filter(asset => {
      const matchesSearch =
          asset.registration.toLowerCase().includes(searchTerm.toLowerCase())

      // const matchesStatus = statusFilter.length === 0 || statusFilter.includes(asset.i);

      return matchesSearch && matchesStatus;
    });
  }, [assets, searchTerm, statusFilter]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'online': return 'default';
      case 'offline': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-vehicle-active';
      case 'offline': return 'text-vehicle-inactive';
      default: return 'text-muted-foreground';
    }
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const formatLastUpdate = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
      <div className="space-y-1">
        {/* Header */}
        <div className="flex items-center justify-between">
          {/* <h2 className="text-lg font-semibold text-foreground text-sm">Vehicle Search</h2> */}
          <Badge variant="outline" className="text-xs">
            {filteredVehicles.length} vehicles
          </Badge>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by registration, account"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-card/50 border-border/50"
          />
        </div>

        {/* Status Filters */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            Status Filter
          </div>
          <div className="flex flex-wrap gap-2">
            {['online', 'offline'].map(status => (
              <Button
                key={status}
                variant={statusFilter.includes(status) ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStatusFilter(status)}
                className="text-xs capitalize"
              >
                {status}
              </Button>
            ))}
          </div>
        </div>

        {/* Selected Vehicles Actions */}
        {selectedVehicles.length > 0 && (
          <div className="p-1 bg-primary/5 rounded-sm border border-primary/10">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-primary">
                {selectedVehicles.length} selected
              </span>
              <Button
                size="sm"
                onClick={() => onShowHistory(selectedVehicles)}
                disabled={showingHistory}
                className="text-xs"
                variant={showingHistory ? 'secondary' : 'default'}
              >
                {showingHistory ? 'Showing History' : 'Show History'}
              </Button>
            </div>
          </div>
        )}

        {/* Vehicle List */}
        <div className="max-h-96 overflow-y-auto">
          {filteredVehicles.map(vehicle => (
            <div
              key={vehicle.id}
              className={cn(
                "p-1 border transition-all duration-200 cursor-pointer",
                selectedVehicles.includes(vehicle.id)
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card/30 hover:bg-card/50"
              )}
              onClick={() => onVehicleSelect(vehicle.id, !selectedVehicles.includes(vehicle.id))}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={selectedVehicles.includes(vehicle.id)}
                    onChange={() => {}}
                    className="mt-1"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-xs text-foreground">
                        {vehicle.registrationNumber}
                      </h3>
                      <Badge 
                        variant={getStatusBadgeVariant(vehicle.status)}
                        className="text-xs"
                      >
                        {vehicle.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1 text-[0.65rem] text-muted-foreground">
                      {/* <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {vehicle.driverName || 'Unassigned'}
                      </div> */}
                      {/* <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {vehicle.make} {vehicle.model} ({vehicle.year})
                      </div> */}
                      {/* <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {vehicle.placeName}
                      </div> */}
                      <div className="flex items-center gap-1">
                        <UserCircle className="h-3 w-3" />
                        {vehicle.account ? vehicle.account.name : 'No Account'}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatLastUpdate(vehicle.lastUpdate)}
                      </div>
                    </div>
                  </div>
                </div>
                
                {vehicle.status === 'online' && (
                  <div className="text-right text-xs">
                    <div className={getStatusColor(vehicle.status)}>
                      {vehicle.speed} km/h
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredVehicles.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No vehicles found</p>
          </div>
        )}
      </div>
  );
};