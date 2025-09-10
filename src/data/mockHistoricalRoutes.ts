import { Vehicle, RoutePoint } from '@/types/vehicle';

export const mockHistoricalRoutes: Record<string, RoutePoint[]> = {
  '1': [
    {
      coordinates: [36.8219, -1.2921],
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      speed: 0,
      heading: 0
    },
    {
      coordinates: [36.8200, -1.2900],
      timestamp: new Date(Date.now() - 3.5 * 60 * 60 * 1000),
      speed: 45,
      heading: 45
    },
    {
      coordinates: [36.8180, -1.2880],
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      speed: 50,
      heading: 48
    },
    {
      coordinates: [36.8150, -1.2850],
      timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
      speed: 55,
      heading: 50
    },
    {
      coordinates: [36.8120, -1.2820],
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      speed: 60,
      heading: 52
    },
    {
      coordinates: [36.8100, -1.2800],
      timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
      speed: 65,
      heading: 55
    },
    {
      coordinates: [36.8080, -1.2780],
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      speed: 60,
      heading: 60
    },
    {
      coordinates: [36.8050, -1.2750],
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      speed: 0,
      heading: 0
    }
  ]
};
