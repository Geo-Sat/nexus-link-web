import { Account } from "./account";

export interface VehicleType {
  id: number;
  name: string;
};

export interface VehicleMake {
  id: number;
  name: string;
};

export interface VehicleModel {
  id: number;
  type: VehicleType;
  make: VehicleMake;
  name: string;
};


export interface Vehicle {
  id: number;
  registrationNumber: string;
  imei: string;  // Telematic device IMEI
  model: VehicleModel;
  color?: string;
  fuelType?: string;
  mileage?: string;
  year: number;
  coordinates: [number, number]; // [longitude, latitude]
  placeName?: string; // Optional human-readable location
  heading: number; // Vehicle direction in degrees
  speed: number; // km/h
  status: 'online' | 'offline';
  lastUpdate: Date;
  driverName?: string;
  isSelected: boolean;
  routeHistory: RoutePoint[];
  account: Account | null; // Associated account, if any 
};


export interface RoutePoint {
  coordinates: [number, number];
  timestamp: Date;
  speed: number;
  heading: number;
};

export interface VehicleSearchFilters {
  searchTerm: string;
  status: string[];
  selectedOnly: boolean;
};