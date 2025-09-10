import { RoutePoint, Vehicle } from "./vehicle";

export interface Trip {
  id: string;
  vehicle: Vehicle;
  startTime: string;
  endTime?: string;
  startLocation: string;
  endLocation?: string;
  distance: number;
  duration: number;
  status: 'active' | 'completed' | 'scheduled';
  route?: RoutePoint[];
}
