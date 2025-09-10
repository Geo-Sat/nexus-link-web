import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, subHours, startOfDay, endOfDay, differenceInDays } from 'date-fns';
import { CalendarIcon, SearchIcon, MapPinIcon, ClockIcon, CarIcon, WifiOffIcon, AlertCircleIcon, UserIcon, RouteIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GoogleTrackingMap } from '@/components/GoogleTrackingMap';
import { useToast } from '@/hooks/use-toast';
import { Vehicle, RoutePoint } from '@/types/vehicle';
import { Trip } from '@/types/trip';
import { useParams } from 'react-router-dom';


export function TripsPage() {
  // check if there are any navigation parameters for a specific trip or vehicle
  const params = useParams();
  const initialVehicleIds = params.vIds || null;
  
  const [activeTab, setActiveTab] = useState('active');
  const [trips, setTrips] = useState<Trip[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [historicalRoutes, setHistoricalRoutes] = useState<RoutePoint[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [dateRange, setDateRange] = useState({
    from: subHours(new Date(), 4),
    to: new Date()
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const offlineVehicles = vehicles.filter(v => 
    v.status === 'offline' && 
    differenceInDays(new Date(), v.lastUpdate) > 7
  );
  
  const activeTrips = trips.filter(t => t.status === 'active');

  const handleSelectTrip = (trip: Trip) => {
    setSelectedTrip(trip);
    if (historicalRoutes[trip.vehicle.id]) {
      setSelectedTrip({
        ...trip,
        route: historicalRoutes[trip.vehicle.id]
      });
    }
  };

  const handleSearchHistorical = () => {
    if (!selectedVehicle) {
      toast({
        title: "No vehicle selected",
        description: "Please select a vehicle to view historical data",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const historicalData = historicalRoutes[selectedVehicle.id] || [];
      setSelectedTrip({
        id: 'historical',
        vehicle: selectedVehicle,
        startTime: dateRange.from.toISOString(),
        endTime: dateRange.to.toISOString(),
        startLocation: 'Historical Route',
        distance: 0,
        duration: 0,
        status: 'completed',
        route: historicalData
      });
      setIsLoading(false);
      
      toast({
        title: "Route loaded",
        description: `Showing route for ${selectedVehicle.registrationNumber} from ${format(dateRange.from, 'PPpp')} to ${format(dateRange.to, 'PPpp')}`
      });
    }, 1000);
  };

  const getDurationString = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getDaysOffline = (lastUpdate: Date) => {
    return differenceInDays(new Date(), lastUpdate);
  };

  const formatCoordinate = (coord: number) => {
    return coord.toFixed(4);
  };

  return (
    <div className="flex h-full">
      {/* Left sidebar */}
      <div className="w-96 border-r bg-card">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Trips & Routes</h1>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="active">Active Trips</TabsTrigger>
              <TabsTrigger value="historical">Historical</TabsTrigger>
              <TabsTrigger value="offline">Offline Vehicles</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              <div className="space-y-2">
                {activeTrips.map(trip => (
                  <Card 
                    key={trip.id} 
                    className={cn(
                      "p-4 cursor-pointer transition-all hover:border-primary",
                      selectedTrip?.id === trip.id && "border-primary bg-primary/5"
                    )}
                    onClick={() => handleSelectTrip(trip)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CarIcon className="h-4 w-4 text-primary" />
                          <h3 className="font-semibold">{trip.vehicle.registrationNumber}</h3>
                          <Badge variant={trip.status === 'active' ? 'default' : 'secondary'}>
                            {trip.status}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPinIcon className="h-3 w-3 text-muted-foreground" />
                            <span>{trip.startLocation}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ClockIcon className="h-3 w-3 text-muted-foreground" />
                            <span>Started {format(new Date(trip.startTime), 'HH:mm')}</span>
                          </div>
                          {trip.vehicle.driverName && (
                            <div className="flex items-center gap-2">
                              <UserIcon className="h-3 w-3 text-muted-foreground" />
                              <span>{trip.vehicle.driverName}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Distance:</span>
                            <span>{trip.distance} km</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Duration:</span>
                            <span>{getDurationString(trip.duration)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Speed:</span>
                            <span>{trip.vehicle.speed} km/h</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
                {activeTrips.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <CarIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No active trips</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="historical" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="vehicle-search">Select Vehicle</Label>
                  <Input
                    id="vehicle-search"
                    placeholder="Search vehicles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>From</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal mt-1",
                            !dateRange.from && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange.from ? format(dateRange.from, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dateRange.from}
                          onSelect={(date) => date && setDateRange(prev => ({ ...prev, from: date }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label>To</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal mt-1",
                            !dateRange.to && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange.to ? format(dateRange.to, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dateRange.to}
                          onSelect={(date) => date && setDateRange(prev => ({ ...prev, to: date }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  onClick={handleSearchHistorical}
                  disabled={!selectedVehicle || isLoading}
                >
                  <SearchIcon className="mr-2 h-4 w-4" />
                  {isLoading ? 'Loading...' : 'Show Route'}
                </Button>

                <Separator />

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {vehicles
                    .filter(v => v.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map(vehicle => (
                      <Card 
                        key={vehicle.id}
                        className={cn(
                          "p-3 cursor-pointer transition-all",
                          selectedVehicle?.id === vehicle.id && "border-primary bg-primary/5"
                        )}
                        onClick={() => setSelectedVehicle(vehicle)}
                      >
                        <div className="flex items-center gap-3">
                          <CarIcon className="h-5 w-5 text-primary" />
                          <div>
                            <h4 className="font-medium">{vehicle.registrationNumber}</h4>
                            <p className="text-sm text-muted-foreground">
                              {vehicle.make} {vehicle.model} ({vehicle.year})
                            </p>
                            {vehicle.driverName && (
                              <p className="text-xs text-muted-foreground">{vehicle.driverName}</p>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="offline" className="space-y-4">
              <div className="space-y-2">
                {offlineVehicles.map(vehicle => (
                  <Card key={vehicle.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <WifiOffIcon className="h-4 w-4 text-destructive" />
                          <h3 className="font-semibold">{vehicle.registrationNumber}</h3>
                          <Badge variant="destructive">Offline</Badge>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <AlertCircleIcon className="h-3 w-3 text-muted-foreground" />
                            <span>Last seen: {format(vehicle.lastUpdate, 'PPpp')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Duration:</span>
                            <span>
                              {getDaysOffline(vehicle.lastUpdate)} days offline
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">IMEI:</span>
                            <span>{vehicle.imei}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      Investigate Issue
                    </Button>
                  </Card>
                ))}
                {offlineVehicles.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <WifiOffIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>All vehicles are online</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Main content - Map */}
      <div className="flex-1 relative">
        {selectedTrip ? (
          <div className="h-full flex flex-col">
            {/* Trip details header */}
            <div className="border-b bg-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">
                    {selectedTrip.vehicle.registrationNumber}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedTrip.status === 'active' ? 'Active Trip' : 'Historical Route'} • 
                    {selectedTrip.startTime && ` Started: ${format(new Date(selectedTrip.startTime), 'PPpp')}`}
                    {selectedTrip.endTime && ` Ended: ${format(new Date(selectedTrip.endTime), 'PPpp')}`}
                  </p>
                  {selectedTrip.vehicle.driverName && (
                    <p className="text-sm text-muted-foreground">
                      Driver: {selectedTrip.vehicle.driverName}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    IMEI: {selectedTrip.vehicle.imei}
                  </p>
                </div>
                <Button variant="outline" onClick={() => setSelectedTrip(null)}>
                  Close
                </Button>
              </div>
            </div>

            {/* Map */}
            <div className="flex-1">
              <GoogleTrackingMap
                vehicles={[selectedTrip.vehicle]}
                selectedVehicles={[selectedTrip.vehicle.id]}
                showingHistory={true}
                // historicalRoute={selectedTrip.route}
              />
            </div>

            {/* Trip stats footer */}
            {selectedTrip.route && selectedTrip.route.length > 0 && (
              <div className="border-t bg-card p-4">
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Route Points</p>
                    <p className="font-semibold">{selectedTrip.route.length}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Time Range</p>
                    <p className="font-semibold">
                      {format(selectedTrip.route[0].timestamp, 'HH:mm')} - 
                      {format(selectedTrip.route[selectedTrip.route.length - 1].timestamp, 'HH:mm')}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Duration</p>
                    <p className="font-semibold">
                      {Math.round((selectedTrip.route[selectedTrip.route.length - 1].timestamp.getTime() - 
                        selectedTrip.route[0].timestamp.getTime()) / (60 * 1000))} minutes
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Avg. Speed</p>
                    <p className="font-semibold">
                      {Math.round(selectedTrip.route.reduce((sum, point) => sum + point.speed, 0) / selectedTrip.route.length)} km/h
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-md">
              <RouteIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Select a Trip or Vehicle</h2>
              <p className="text-muted-foreground">
                Choose a trip from the list to view its route on the map, or search for historical vehicle data.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}