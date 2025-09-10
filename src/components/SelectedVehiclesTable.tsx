import React, { useState, useMemo } from 'react';
import { Car, MapPin, Clock, Activity, X, TrendingUp, LayoutGrid, LayoutList, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Vehicle } from '@/types/vehicle';
import { cn } from '@/lib/utils';

interface SelectedVehiclesTableProps {
  vehicles: Vehicle[];
  onRemoveVehicle: (vehicleId: number) => void;
  showingHistory: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const SelectedVehiclesTable: React.FC<SelectedVehiclesTableProps> = ({
  vehicles,
  onRemoveVehicle,
  showingHistory,
  isCollapsed,
  onToggleCollapse,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(vehicle => 
      vehicle.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vehicle.driverName && vehicle.driverName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [vehicles, searchTerm]);

  if (vehicles.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground text-sm">
        No vehicles selected
      </div>
    );
  }

  const formatLastUpdate = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-vehicle-active';
      case 'inactive': return 'text-vehicle-inactive';
      case 'maintenance': return 'text-tracking-danger';
      default: return 'text-muted-foreground';
    }
  };

  const getMovementTrend = (vehicle: Vehicle) => {
    const recentPoints = vehicle.routeHistory.slice(-5);
    if (recentPoints.length < 2) return 0;
    
    const avgSpeed = recentPoints.reduce((sum, point) => sum + point.speed, 0) / recentPoints.length;
    return avgSpeed;
  };

  const generateSparklineData = (vehicle: Vehicle) => {
    const speeds = vehicle.routeHistory.slice(-10).map(point => point.speed);
    const maxSpeed = Math.max(...speeds, 1);
    return speeds.map(speed => (speed / maxSpeed) * 100);
  };

  return (
    <div className="selected-vehicles-overlay" style={{ width: '60%', maxHeight: '70vh', overflowY: 'auto' }}>
      <div className="glass-overlay p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Car className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Selected Vehicles</h2>
            <Badge variant="outline" className="text-xs">
              {vehicles.length} active
            </Badge>
            {showingHistory && (
              <Badge variant="default" className="text-xs bg-primary/20 text-primary">
                History Mode
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search vehicles..."
              className="h-8 px-3 py-1 text-sm bg-background/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="flex items-center gap-2"
            >
              {viewMode === 'grid' ? (
                <LayoutList className="h-4 w-4" />
              ) : (
                <LayoutGrid className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className="flex items-center gap-2"
            >
              {isCollapsed ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Vehicle View (Grid or List) */}
        {!isCollapsed && (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredVehicles.map(vehicle => (
                <div
                  key={vehicle.id}
                  className="relative p-4 bg-card/50 rounded-lg border border-border/50 hover:border-primary/50 transition-all duration-200"
                >
                  {/* Remove Button */}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onRemoveVehicle(vehicle.id)}
                    className="absolute top-2 right-2 h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </Button>

                  {/* Vehicle Info */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground">
                        {vehicle.registrationNumber}
                      </h3>
                      <Badge variant="outline" className={cn("text-xs", getStatusColor(vehicle.status))}>
                        {vehicle.status}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{vehicle.coordinates.join(', ')}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{formatLastUpdate(new Date(vehicle.lastUpdate))}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Activity className="h-4 w-4 mr-2" />
                        <span>{vehicle.speed.toFixed(2)} km/h</span>
                      </div>
                    </div>

                    {/* Movement Sparkline */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          Speed Trend
                        </span>
                        <span className="text-foreground">
                          Avg: {Math.round(getMovementTrend(vehicle))} km/h
                        </span>
                      </div>
                      
                      {/* Simple Sparkline */}
                      <div className="flex items-end gap-px h-6 bg-muted/50 rounded p-1">
                        {generateSparklineData(vehicle).map((height, index) => (
                          <div
                            key={index}
                            className={cn(
                              "flex-1 bg-primary/60 rounded-sm transition-all duration-300",
                              vehicle.status === 'online' ? 'bg-primary' : 'bg-muted-foreground'
                            )}
                            style={{ height: `${Math.max(height, 10)}%` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredVehicles.map(vehicle => (
                <div
                  key={vehicle.id}
                  className="relative flex items-center justify-between p-3 bg-card/50 rounded-lg border border-border/50 hover:border-primary/50 transition-all duration-200"
                >
                  <div className="flex-1 flex items-center space-x-4">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">
                        {vehicle.registrationNumber}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{vehicle.speed.toFixed(2)} km/h</span>
                        <span>•</span>
                        <span>{formatLastUpdate(new Date(vehicle.lastUpdate))}</span>
                      </div>
                      {/* Movement Sparkline */}
                      <div className="mt-2 space-y-1 max-w-[200px]">
                        <div className="flex items-end gap-px h-4 bg-muted/50 rounded p-1">
                          {generateSparklineData(vehicle).map((height, index) => (
                            <div
                              key={index}
                              className={cn(
                                "flex-1 bg-primary/60 rounded-sm transition-all duration-300",
                                vehicle.status === 'online' ? 'bg-primary' : 'bg-muted-foreground'
                              )}
                              style={{ height: `${Math.max(height, 10)}%` }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-xs text-muted-foreground">
                      Avg: {Math.round(getMovementTrend(vehicle))} km/h
                    </div>
                    <Badge variant="outline" className={cn("text-xs", getStatusColor(vehicle.status))}>
                      {vehicle.status}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onRemoveVehicle(vehicle.id)}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};