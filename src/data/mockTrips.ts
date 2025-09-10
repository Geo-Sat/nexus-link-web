import { Trip } from "@/types/trip";
import { mockVehicles } from './mockVehicles';


export const mockTrips: Trip[] = [
    {
    id: '1',
    vehicle: mockVehicles[0],
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    startLocation: 'Nairobi Warehouse',
    distance: 85,
    duration: 120,
    status: 'active',
    route: [
      {
        coordinates: [36.8219, -1.2921],
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        speed: 0,
        heading: 0
      },
      {
        coordinates: [36.8190, -1.2890],
        timestamp: new Date(Date.now() - 90 * 60 * 1000),
        speed: 45,
        heading: 45
      },
      {
        coordinates: [36.8150, -1.2850],
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        speed: 60,
        heading: 50
      },
      {
        coordinates: [36.8100, -1.2800],
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        speed: 65,
        heading: 55
      }
    ]
  },
  {
    id: '2',
    vehicle: mockVehicles[1],
    startTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    startLocation: 'Mombasa Depot',
    distance: 15,
    duration: 30,
    status: 'active',
    route: [
      {
        coordinates: [36.8172, -1.2863],
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        speed: 0,
        heading: 0
      },
      {
        coordinates: [36.8160, -1.2850],
        timestamp: new Date(Date.now() - 20 * 60 * 1000),
        speed: 40,
        heading: 120
      },
      {
        coordinates: [36.8145, -1.2835],
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        speed: 45,
        heading: 125
      }
    ]
  }
  ];

// Mock API functions
export const mockApiDelay = () => new Promise(resolve => setTimeout(resolve, 800));
