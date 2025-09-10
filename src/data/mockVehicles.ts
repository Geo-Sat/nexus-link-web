import { Vehicle, RoutePoint } from '@/types/vehicle';

// Generate realistic route history for each vehicle
const generateRouteHistory = (startCoords: [number, number], vehicleId: string): RoutePoint[] => {
  const history: RoutePoint[] = [];
  const now = new Date();
  
  // Generate 20 points over the last 2 hours
  for (let i = 19; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - (i * 6 * 60 * 1000)); // 6-minute intervals
    
    // Add some realistic movement variations around Nairobi
    const latOffset = (Math.random() - 0.5) * 0.01 * (i / 10);
    const lngOffset = (Math.random() - 0.5) * 0.01 * (i / 10);
    
    history.push({
      coordinates: [
        startCoords[0] + lngOffset,
        startCoords[1] + latOffset
      ],
      timestamp,
      speed: Math.floor(Math.random() * 80) + 10, // 10-90 km/h
      heading: Math.floor(Math.random() * 360)
    });
  }
  
  return history;
};
export const mockVehicles: Vehicle[] = [
  // ... (The original 10 vehicles) ...
  {
    id: 1,
    registrationNumber: 'KCA 001A',
    imei: '867329032849257',
    model: { id: 1, name: 'Hilux', type: { id: 1, name: 'Toyota' }, make: { id: 1, name: 'Wagon' }},
    year: 2022,
    coordinates: [36.8219, -1.2921], // Nairobi CBD
    heading: 45,
    speed: 35,
    status: 'online',
    lastUpdate: new Date(),
    driverName: 'John Kamau',
    isSelected: false,
    routeHistory: generateRouteHistory([36.8219, -1.2921], '1'),
    account: { id: 1, name: 'Logistics Co.' }
  },
  {
    id: 2,
    registrationNumber: 'KBZ 205B',
    imei: '867329032849258',
    model: { id: 2, name: 'D-Max', type: { id: 2, name: 'Isuzu' }, make: { id: 2, name: 'Pickup' }},
    year: 2021,
    coordinates: [36.7745, -1.3733], // Karen area
    heading: 180,
    speed: 0,
    status: 'offline',
    lastUpdate: new Date(Date.now() - 15 * 60 * 1000),
    driverName: 'Mary Wanjiku',
    isSelected: false,
    routeHistory: generateRouteHistory([36.7745, -1.3733], '2'),
    account: { id: 2, name: 'Delivery Services Ltd.' }
  },
  {
    id: 3,
    registrationNumber: 'KCF 789C',
    imei: '867329032849259',
    model: { id: 3, name: 'Navara', type: { id: 3, name: 'Nissan' }, make: { id: 2, name: 'Pickup' }},
    year: 2020,
    coordinates: [36.8856, -1.2297], // Westlands
    heading: 270,
    speed: 50,
    status: 'online',
    lastUpdate: new Date(),
    driverName: 'Peter Ochieng',
    isSelected: false,
    routeHistory: generateRouteHistory([36.8856, -1.2297], '3'),
    account: { id: 3, name: 'Kingsmil Co.' }
  },
  {
    id: 4,
    registrationNumber: 'KDA 456D',
    imei: '867329032849260',
    model: { id: 4, name: 'Ranger', type: { id: 4, name: 'Ford' }, make: { id: 2, name: 'Pickup' }},
    year: 2023,
    coordinates: [36.9280, -1.2507], // Eastleigh
    heading: 90,
    speed: 25,
    status: 'online',
    lastUpdate: new Date(),
    driverName: 'Grace Njeri',
    isSelected: false,
    routeHistory: generateRouteHistory([36.9280, -1.2507], '4'),
    account: { id: 4, name: 'Logistics Co.' }
  },
  {
    id: 5,
    registrationNumber: 'KCB 123E',
    imei: '867329032849261',
    model: { id: 5, name: 'L200', type: { id: 5, name: 'Mitsubishi' }, make: { id: 2, name: 'Pickup' }},
    year: 2019,
    coordinates: [36.7320, -1.3019], // Dagoretti
    heading: 315,
    speed: 0,
    status: 'offline',
    lastUpdate: new Date(Date.now() - 2 * 60 * 60 * 1000),
    driverName: 'Samuel Kiprop',
    isSelected: false,
    routeHistory: generateRouteHistory([36.7320, -1.3019], '5'),
    account: { id: 5, name: 'Express Deliveries' }
  },
  {
    id: 6,
    registrationNumber: 'KDD 987F',
    imei: '867329032849262',
    model: { id: 6, name: 'Land Cruiser', type: { id: 1, name: 'Toyota' }, make: { id: 3, name: 'SUV' }},
    year: 2022,
    coordinates: [36.8470, -1.2030], // Gigiri
    heading: 225,
    speed: 40,
    status: 'online',
    lastUpdate: new Date(),
    driverName: 'Catherine Muthoni',
    isSelected: false,
    routeHistory: generateRouteHistory([36.8470, -1.2030], '6'),
    account: { id: 1, name: 'Logistics Co.' }
  },
  {
    id: 7,
    registrationNumber: 'KDE 111G',
    imei: '867329032849263',
    model: { id: 7, name: 'CX-5', type: { id: 6, name: 'Mazda' }, make: { id: 3, name: 'SUV' }},
    year: 2021,
    coordinates: [36.7817, -1.2864], // Lavington
    heading: 10,
    speed: 60,
    status: 'online',
    lastUpdate: new Date(),
    driverName: 'Faith Auma',
    isSelected: false,
    routeHistory: generateRouteHistory([36.7817, -1.2864], '7'),
    account: { id: 2, name: 'Delivery Services Ltd.' }
  },
  {
    id: 8,
    registrationNumber: 'KDF 222H',
    imei: '867329032849264',
    model: { id: 8, name: 'Actros', type: { id: 7, name: 'Mercedes-Benz' }, make: { id: 4, name: 'Truck' }},
    year: 2018,
    coordinates: [37.0094, -1.1481], // Thika Road
    heading: 120,
    speed: 75,
    status: 'online',
    lastUpdate: new Date(),
    driverName: 'David Mutua',
    isSelected: false,
    routeHistory: generateRouteHistory([37.0094, -1.1481], '8'),
    account: { id: 3, name: 'Kingsmil Co.' }
  },
  {
    id: 9,
    registrationNumber: 'KDG 333J',
    imei: '867329032849265',
    model: { id: 9, name: 'Forester', type: { id: 8, name: 'Subaru' }, make: { id: 3, name: 'SUV' }},
    year: 2022,
    coordinates: [36.9450, -1.2925], // Embakasi
    heading: 300,
    speed: 0,
    status: 'offline',
    lastUpdate: new Date(Date.now() - 24 * 60 * 60 * 1000),
    driverName: 'Brian Kibet',
    isSelected: false,
    routeHistory: generateRouteHistory([36.9450, -1.2925], '9'),
    account: { id: 5, name: 'Express Deliveries' }
  },
  {
    id: 10,
    registrationNumber: 'KDH 444K',
    imei: '867329032849266',
    model: { id: 10, name: 'Polo', type: { id: 9, name: 'Volkswagen' }, make: { id: 5, name: 'Hatchback' }},
    year: 2023,
    coordinates: [36.7061, -1.2336], // Lower Kabete
    heading: 195,
    speed: 45,
    status: 'online',
    lastUpdate: new Date(),
    driverName: 'Alice Awino',
    isSelected: false,
    routeHistory: generateRouteHistory([36.7061, -1.2336], '10'),
    account: { id: 1, name: 'Logistics Co.' }
  },
  // ... 40 New Vehicles ...
  {
    id: 11,
    registrationNumber: 'KDJ 555L',
    imei: '867329032849267',
    model: { id: 11, name: 'FH', type: { id: 10, name: 'Volvo' }, make: { id: 4, name: 'Truck' }},
    year: 2019,
    coordinates: [39.6682, -4.0435], // Mombasa
    heading: 88,
    speed: 85,
    status: 'online',
    driverName: 'Joseph Mwangi',
    lastUpdate: new Date(),
    isSelected: false,
    routeHistory: generateRouteHistory([39.6682, -4.0435], '11'),
    account: { id: 3, name: 'Kingsmil Co.' }
  },
  {
    id: 12,
    registrationNumber: 'KDK 666M',
    imei: '867329032849268',
    model: { id: 12, name: 'Canter', type: { id: 5, name: 'Mitsubishi' }, make: { id: 4, name: 'Truck' }},
    year: 2020,
    coordinates: [34.7680, -0.0917], // Kisumu
    heading: 175,
    speed: 60,
    status: 'online',
    driverName: 'Esther Nyambura',
    lastUpdate: new Date(),
    isSelected: false,
    routeHistory: generateRouteHistory([34.7680, -0.0917], '12'),
    account: { id: 5, name: 'Express Deliveries' }
  },
  {
    id: 13,
    registrationNumber: 'KDL 777N',
    imei: '867329032849269',
    model: { id: 13, name: 'Discovery', type: { id: 11, name: 'Land Rover' }, make: { id: 3, name: 'SUV' }},
    year: 2022,
    coordinates: [36.2730, -0.3031], // Nakuru
    heading: 240,
    speed: 30,
    status: 'online',
    driverName: 'James Otieno',
    lastUpdate: new Date(),
    isSelected: false,
    routeHistory: generateRouteHistory([36.2730, -0.3031], '13'),
    account: { id: 2, name: 'Delivery Services Ltd.' }
  },
  {
    id: 14,
    registrationNumber: 'KDM 888P',
    imei: '867329032849270',
    model: { id: 14, name: 'X5', type: { id: 12, name: 'BMW' }, make: { id: 3, name: 'SUV' }},
    year: 2023,
    coordinates: [35.2828, 0.5143], // Eldoret
    heading: 310,
    speed: 0,
    status: 'offline',
    lastUpdate: new Date(Date.now() - 5 * 60 * 60 * 1000),
    driverName: 'Lucy Wairimu',
    isSelected: false,
    routeHistory: generateRouteHistory([35.2828, 0.5143], '14'),
    account: { id: 1, name: 'Logistics Co.' }
  },
  {
    id: 15,
    registrationNumber: 'KDN 999Q',
    imei: '867329032849271',
    model: { id: 15, name: 'Premio', type: { id: 1, name: 'Toyota' }, make: { id: 6, name: 'Sedan' }},
    year: 2018,
    coordinates: [36.4258, -0.7142], // Naivasha
    heading: 45,
    speed: 55,
    status: 'online',
    driverName: 'Daniel Kariuki',
    lastUpdate: new Date(),
    isSelected: false,
    routeHistory: generateRouteHistory([36.4258, -0.7142], '15'),
    account: { id: 4, name: 'Logistics Co.' }
  },
  {
    id: 16,
    registrationNumber: 'KDP 110R',
    imei: '867329032849272',
    model: { id: 16, name: 'R-series', type: { id: 13, name: 'Scania' }, make: { id: 4, name: 'Truck' }},
    year: 2021,
    coordinates: [37.5833, 0.0500], // Nanyuki
    heading: 180,
    speed: 70,
    status: 'online',
    driverName: 'Christine Adhiambo',
    lastUpdate: new Date(),
    isSelected: false,
    routeHistory: generateRouteHistory([37.5833, 0.0500], '16'),
    account: { id: 3, name: 'Kingsmil Co.' }
  },
  {
    id: 17,
    registrationNumber: 'KDQ 221S',
    imei: '867329032849273',
    model: { id: 17, name: 'Civic', type: { id: 14, name: 'Honda' }, make: { id: 6, name: 'Sedan' }},
    year: 2022,
    coordinates: [36.9538, -1.1585], // Ruiru
    heading: 200,
    speed: 40,
    status: 'online',
    driverName: 'Kevin Onyango',
    lastUpdate: new Date(),
    isSelected: false,
    routeHistory: generateRouteHistory([36.9538, -1.1585], '17'),
    account: { id: 2, name: 'Delivery Services Ltd.' }
  },
  {
    id: 18,
    registrationNumber: 'KDR 332T',
    imei: '867329032849274',
    model: { id: 18, name: 'A4', type: { id: 15, name: 'Audi' }, make: { id: 6, name: 'Sedan' }},
    year: 2023,
    coordinates: [36.6787, -1.4326], // Ngong
    heading: 270,
    speed: 50,
    status: 'online',
    driverName: 'Brenda Chepkoech',
    lastUpdate: new Date(),
    isSelected: false,
    routeHistory: generateRouteHistory([36.6787, -1.4326], '18'),
    account: { id: 1, name: 'Logistics Co.' }
  },
  {
    id: 19,
    registrationNumber: 'KDS 443U',
    imei: '867329032849275',
    model: { id: 19, name: 'Sportage', type: { id: 16, name: 'Kia' }, make: { id: 3, name: 'SUV' }},
    year: 2021,
    coordinates: [37.0910, -1.0478], // Juja
    heading: 10,
    speed: 0,
    status: 'offline',
    lastUpdate: new Date(Date.now() - 48 * 60 * 60 * 1000),
    driverName: 'Robert Maina',
    isSelected: false,
    routeHistory: generateRouteHistory([37.0910, -1.0478], '19'),
    account: { id: 5, name: 'Express Deliveries' }
  },
  {
    id: 20,
    registrationNumber: 'KDT 554V',
    imei: '867329032849276',
    model: { id: 20, name: 'Tucson', type: { id: 17, name: 'Hyundai' }, make: { id: 3, name: 'SUV' }},
    year: 2022,
    coordinates: [36.8167, -1.2833], // Kilimani
    heading: 350,
    speed: 20,
    status: 'online',
    driverName: 'Nancy Akoth',
    lastUpdate: new Date(),
    isSelected: false,
    routeHistory: generateRouteHistory([36.8167, -1.2833], '20'),
    account: { id: 4, name: 'Logistics Co.' }
  },
  {
    id: 21,
    registrationNumber: 'KDU 665W',
    imei: '867329032849277',
    model: { id: 21, name: 'Tiida', type: { id: 3, name: 'Nissan' }, make: { id: 5, name: 'Hatchback' }},
    year: 2017,
    coordinates: [36.8913, -1.2144], // Muthaiga
    heading: 135,
    speed: 35,
    status: 'online',
    driverName: 'Paul Wafula',
    lastUpdate: new Date(),
    isSelected: false,
    routeHistory: generateRouteHistory([36.8913, -1.2144], '21'),
    account: { id: 1, name: 'Logistics Co.' }
  },
  {
    id: 22,
    registrationNumber: 'KDV 776X',
    imei: '867329032849278',
    model: { id: 22, name: 'Demio', type: { id: 6, name: 'Mazda' }, make: { id: 5, name: 'Hatchback' }},
    year: 2019,
    coordinates: [36.7644, -1.2727], // Kileleshwa
    heading: 90,
    speed: 45,
    status: 'online',
    driverName: 'Cynthia Jepkemoi',
    lastUpdate: new Date(),
    isSelected: false,
    routeHistory: generateRouteHistory([36.7644, -1.2727], '22'),
    account: { id: 2, name: 'Delivery Services Ltd.' }
  },
  {
    id: 23,
    registrationNumber: 'KDW 887Y',
    imei: '867329032849279',
    model: { id: 23, name: 'TGX', type: { id: 18, name: 'MAN' }, make: { id: 4, name: 'Truck' }},
    year: 2020,
    coordinates: [39.0526, -2.2924], // Malindi
    heading: 180,
    speed: 80,
    status: 'online',
    driverName: 'Felix Omondi',
    lastUpdate: new Date(),
    isSelected: false,
    routeHistory: generateRouteHistory([39.0526, -2.2924], '23'),
    account: { id: 3, name: 'Kingsmil Co.' }
  },
  {
    id: 24,
    registrationNumber: 'KDX 998Z',
    imei: '867329032849280',
    model: { id: 24, name: '3 Series', type: { id: 12, name: 'BMW' }, make: { id: 6, name: 'Sedan' }},
    year: 2021,
    coordinates: [36.7025, -1.3168], // Lang'ata
    heading: 270,
    speed: 0,
    status: 'offline',
    lastUpdate: new Date(Date.now() - 8 * 60 * 60 * 1000),
    driverName: 'Irene Kasandi',
    isSelected: false,
    routeHistory: generateRouteHistory([36.7025, -1.3168], '24'),
    account: { id: 1, name: 'Logistics Co.' }
  },
  {
    id: 25,
    registrationNumber: 'KDY 119A',
    imei: '867329032849281',
    model: { id: 25, name: 'HiAce', type: { id: 1, name: 'Toyota' }, make: { id: 7, name: 'Van' }},
    year: 2022,
    coordinates: [36.8584, -1.3175], // South C
    heading: 0,
    speed: 50,
    status: 'online',
    driverName: 'George Kimani',
    lastUpdate: new Date(),
    isSelected: false,
    routeHistory: generateRouteHistory([36.8584, -1.3175], '25'),
    account: { id: 5, name: 'Express Deliveries' }
  },
  {
    id: 26,
    registrationNumber: 'KDZ 228B',
    imei: '867329032849282',
    model: { id: 26, name: 'Defender', type: { id: 11, name: 'Land Rover' }, make: { id: 3, name: 'SUV' }},
    year: 2023,
    coordinates: [36.0715, -0.2831], // Lake Nakuru National Park
    heading: 210,
    speed: 25,
    status: 'online',
    driverName: 'Susan Moraa',
    lastUpdate: new Date(),
    isSelected: false,
    routeHistory: generateRouteHistory([36.0715, -0.2831], '26'),
    account: { id: 2, name: 'Delivery Services Ltd.' }
  },
  {
    id: 27,
    registrationNumber: 'KEA 337C',
    imei: '867329032849283',
    model: { id: 27, name: 'Fit', type: { id: 14, name: 'Honda' }, make: { id: 5, name: 'Hatchback' }},
    year: 2020,
    coordinates: [36.9110, -1.2210], // Kasarani
    heading: 300,
    speed: 40,
    status: 'online',
    driverName: 'Victor Njoroge',
    lastUpdate: new Date(),
    isSelected: false,
    routeHistory: generateRouteHistory([36.9110, -1.2210], '27'),
    account: { id: 4, name: 'Logistics Co.' }
  },
  {
    id: 28,
    registrationNumber: 'KEB 446D',
    imei: '867329032849284',
    model: { id: 28, name: 'Q5', type: { id: 15, name: 'Audi' }, make: { id: 3, name: 'SUV' }},
    year: 2022,
    coordinates: [36.8286, -1.2481], // Runda
    heading: 60,
    speed: 55,
    status: 'online',
    driverName: 'Sharon Cherono',
    lastUpdate: new Date(),
    isSelected: false,
    routeHistory: generateRouteHistory([36.8286, -1.2481], '28'),
    account: { id: 1, name: 'Logistics Co.' }
  },
  {
    id: 29,
    registrationNumber: 'KEC 555E',
    imei: '867329032849285',
    model: { id: 29, name: 'Sorento', type: { id: 16, name: 'Kia' }, make: { id: 3, name: 'SUV' }},
    year: 2021,
    coordinates: [36.8252, -1.3168], // Nairobi West
    heading: 150,
    speed: 30,
    status: 'online',
    driverName: 'Moses Kuria',
    lastUpdate: new Date(),
    isSelected: false,
    routeHistory: generateRouteHistory([36.8252, -1.3168], '29'),
    account: { id: 3, name: 'Kingsmil Co.' }
  },
  {
    id: 30,
    registrationNumber: 'KED 664F',
    imei: '867329032849286',
    model: { id: 30, name: 'Santa Fe', type: { id: 17, name: 'Hyundai' }, make: { id: 3, name: 'SUV' }},
    year: 2023,
    coordinates: [36.7583, -1.3417], // Bomas of Kenya
    heading: 240,
    speed: 0,
    status: 'offline',
    lastUpdate: new Date(Date.now() - 3 * 60 * 60 * 1000),
    driverName: 'Lilian Wangui',
    isSelected: false,
    routeHistory: generateRouteHistory([36.7583, -1.3417], '30'),
    account: { id: 5, name: 'Express Deliveries' }
  },
  {
    id: 31,
    registrationNumber: 'KEE 773G',
    imei: '867329032849287',
    model: { id: 1, name: 'Hilux', type: { id: 1, name: 'Toyota' }, make: { id: 2, name: 'Pickup' }},
    year: 2023,
    coordinates: [36.6833, -1.1667], // Limuru
    heading: 315,
    speed: 65,
    status: 'online',
    driverName: 'Patrick Koech',
    lastUpdate: new Date(),
    isSelected: false,
    routeHistory: generateRouteHistory([36.6833, -1.1667], '31'),
    account: { id: 1, name: 'Logistics Co.' }
  },
  {
    id: 32,
    registrationNumber: 'KEF 882H',
    imei: '867329032849288',
    model: { id: 2, name: 'D-Max', type: { id: 2, name: 'Isuzu' }, make: { id: 2, name: 'Pickup' }},
    year: 2022,
    coordinates: [37.2833, -0.8333], // Murang'a
    heading: 45,
    speed: 50,
    status: 'online',
    driverName: 'Beatrice Atieno',
    lastUpdate: new Date(),
    isSelected: false,
    routeHistory: generateRouteHistory([37.2833, -0.8333], '32'),
    account: { id: 2, name: 'Delivery Services Ltd.' }
  },
  {
    id: 33,
    registrationNumber: 'KEG 991J',
    imei: '867329032849289',
    model: { id: 8, name: 'Actros', type: { id: 7, name: 'Mercedes-Benz' }, make: { id: 4, name: 'Truck' }},
    year: 2017,
    coordinates: [38.5833, -3.2167], // Voi
    heading: 125,
    speed: 90,
    status: 'online',
    driverName: 'Collins Okoth',
    lastUpdate: new Date(),
    isSelected: false,
    routeHistory: generateRouteHistory([38.5833, -3.2167], '33'),
    account: { id: 3, name: 'Kingsmil Co.' }
  },
  {
    id: 34,
    registrationNumber: 'KEH 110K',
    imei: '867329032849290',
    model: { id: 9, name: 'Forester', type: { id: 8, name: 'Subaru' }, make: { id: 3, name: 'SUV' }},
    year: 2023,
    coordinates: [36.8050, -1.3100], // Wilson Airport
    heading: 180,
    speed: 0,
    status: 'offline',
    lastUpdate: new Date(Date.now() - 12 * 60 * 60 * 1000),
    driverName: 'Diana Nekesa',
    isSelected: false,
    routeHistory: generateRouteHistory([36.8050, -1.3100], '34'),
    account: { id: 4, name: 'Logistics Co.' }
  },
  {
    id: 35,
    registrationNumber: 'KEJ 229L',
    imei: '867329032849291',
    model: { id: 10, name: 'Polo', type: { id: 9, name: 'Volkswagen' }, make: { id: 5, name: 'Hatchback' }},
    year: 2021,
    coordinates: [36.9667, -1.2833], // Jomo Kenyatta International Airport
    heading: 270,
    speed: 30,
    status: 'online',
    driverName: 'Erickson Wamalwa',
    lastUpdate: new Date(),
    isSelected: false,
    routeHistory: generateRouteHistory([36.9667, -1.2833], '35'),
    account: { id: 1, name: 'Logistics Co.' }
  },
  {
    id: 36,
    registrationNumber: 'KEK 338M',
    imei: '867329032849292',
    model: { id: 16, name: 'R-series', type: { id: 13, name: 'Scania' }, make: { id: 4, name: 'Truck' }},
    year: 2022,
    coordinates: [34.5667, 0.0833], // Busia
    heading: 330,
    speed: 75,
    status: 'online',
    driverName: 'Hillary Kiplagat',
    lastUpdate: new Date(),
    isSelected: false,
    routeHistory: generateRouteHistory([34.5667, 0.0833], '36'),
    account: { id: 3, name: 'Kingsmil Co.' }
  },
  {
    id: 37,
    registrationNumber: 'KEL 447N',
    imei: '867329032849293',
    model: { id: 11, name: 'FH', type: { id: 10, name: 'Volvo' }, make: { id: 4, name: 'Truck' }},
    year: 2020,
    coordinates: [40.9000, -0.8500], // Marsabit
    heading: 15,
    speed: 60,
    status: 'online',
    driverName: 'Mercy Cherotich',
    lastUpdate: new Date(),
    isSelected: false,
    routeHistory: generateRouteHistory([40.9000, -0.8500], '37'),
    account: { id: 5, name: 'Express Deliveries' }
  },
  {
    id: 38,
    registrationNumber: 'KEM 556P',
    imei: '867329032849294',
    model: { id: 12, name: 'Canter', type: { id: 5, name: 'Mitsubishi' }, make: { id: 4, name: 'Truck' }},
    year: 2021,
    coordinates: [34.7554, -0.1022], // Kisumu Port
    heading: 190,
    speed: 0,
    status: 'offline',
    lastUpdate: new Date(Date.now() - 30 * 60 * 1000),
    driverName: 'Stephen Gitau',
    isSelected: false,
    routeHistory: generateRouteHistory([34.7554, -0.1022], '38'),
    account: { id: 2, name: 'Delivery Services Ltd.' }
  },
  {
    id: 39,
    registrationNumber: 'KEN 665Q',
    imei: '867329032849295',
    model: { id: 13, name: 'Discovery', type: { id: 11, name: 'Land Rover' }, make: { id: 3, name: 'SUV' }},
    year: 2023,
    coordinates: [37.0833, -0.4167], // Nyeri
    heading: 280,
    speed: 40,
    status: 'online',
    driverName: 'Valerie Mwikali',
    lastUpdate: new Date(),
    isSelected: false,
    routeHistory: generateRouteHistory([37.0833, -0.4167], '39'),
    account: { id: 1, name: 'Logistics Co.' }
  },
  {
    id: 40,
    registrationNumber: 'KEP 774R',
    imei: '867329032849296',
    model: { id: 14, name: 'X5', type: { id: 12, name: 'BMW' }, make: { id: 3, name: 'SUV' }},
    year: 2022,
    coordinates: [36.7562, -1.2982], // The Junction Mall
    heading: 75,
    speed: 20,
    status: 'online',
    driverName: 'Brian Omondi',
    lastUpdate: new Date(),
    isSelected: false,
    routeHistory: generateRouteHistory([36.7562, -1.2982], '40'),
    account: { id: 4, name: 'Logistics Co.' }
  },
  {
    id: 41,
    registrationNumber: 'KEQ 883S',
    imei: '867329032849297',
    model: { id: 25, name: 'HiAce', type: { id: 1, name: 'Toyota' }, make: { id: 7, name: 'Van' }},
    year: 2021,
    coordinates: [36.8792, -1.2829], // Pangani
    heading: 110,
    speed: 50,
    status: 'online',
    driverName: 'Abdi Hassan',
    lastUpdate: new Date(),
    isSelected: false,
    routeHistory: generateRouteHistory([36.8792, -1.2829], '41'),
    account: { id: 5, name: 'Express Deliveries' }
  },
  {
    id: 42,
    registrationNumber: 'KER 992T',
    imei: '867329032849298',
    model: { id: 4, name: 'Ranger', type: { id: 4, name: 'Ford' }, make: { id: 2, name: 'Pickup' }},
    year: 2022,
    coordinates: [36.9417, -1.3333], // Mlolongo
    heading: 95,
    speed: 70,
    status: 'online',
    driverName: 'Zainab Njoki',
    lastUpdate: new Date(),
    isSelected: false,
    routeHistory: generateRouteHistory([36.9417, -1.3333], '42'),
    account: { id: 1, name: 'Logistics Co.' }
  },
  {
    id: 43,
    registrationNumber: 'KES 111U',
    imei: '867329032849299',
    model: { id: 3, name: 'Navara', type: { id: 3, name: 'Nissan' }, make: { id: 2, name: 'Pickup' }},
    year: 2019,
    coordinates: [37.0167, -1.4167], // Machakos
    heading: 180,
    speed: 0,
    status: 'offline',
    lastUpdate: new Date(Date.now() - 72 * 60 * 60 * 1000),
    driverName: 'Dennis Murimi',
    isSelected: false,
    routeHistory: generateRouteHistory([37.0167, -1.4167], '43'),
    account: { id: 2, name: 'Delivery Services Ltd.' }
  },
  {
    id: 44,
    registrationNumber: 'KET 220V',
    imei: '867329032849300',
    model: { id: 17, name: 'Civic', type: { id: 14, name: 'Honda' }, make: { id: 6, name: 'Sedan' }},
    year: 2023,
    coordinates: [36.8194, -1.2831], // University of Nairobi
    heading: 270,
    speed: 15,
    status: 'online',
    driverName: 'Fatuma Ali',
    lastUpdate: new Date(),
    isSelected: false,
    routeHistory: generateRouteHistory([36.8194, -1.2831], '44'),
    account: { id: 3, name: 'Kingsmil Co.' }
  },
  {
    id: 45,
    registrationNumber: 'KEU 339W',
    imei: '867329032849301',
    model: { id: 18, name: 'A4', type: { id: 15, name: 'Audi' }, make: { id: 6, name: 'Sedan' }},
    year: 2020,
    coordinates: [36.7869, -1.2995], // Adams Arcade
    heading: 360,
    speed: 35,
    status: 'online',
    driverName: 'Ahmed Yusuf',
    lastUpdate: new Date(),
    isSelected: false,
    routeHistory: generateRouteHistory([36.7869, -1.2995], '45'),
    account: { id: 1, name: 'Logistics Co.' }
  },
  {
    id: 46,
    registrationNumber: 'KEV 448X',
    imei: '867329032849302',
    model: { id: 7, name: 'CX-5', type: { id: 6, name: 'Mazda' }, make: { id: 3, name: 'SUV' }},
    year: 2022,
    coordinates: [36.8167, -1.2667], // Parklands
    heading: 145,
    speed: 40,
    status: 'online',
    driverName: 'Jacinta Wambui',
    lastUpdate: new Date(),
    isSelected: false,
    routeHistory: generateRouteHistory([36.8167, -1.2667], '46'),
    account: { id: 4, name: 'Logistics Co.' }
  },
  {
    id: 47,
    registrationNumber: 'KEW 557Y',
    imei: '867329032849303',
    model: { id: 23, name: 'TGX', type: { id: 18, name: 'MAN' }, make: { id: 4, name: 'Truck' }},
    year: 2021,
    coordinates: [37.6667, -0.0500], // Meru
    heading: 220,
    speed: 65,
    status: 'online',
    driverName: 'Douglas Simiyu',
    lastUpdate: new Date(),
    isSelected: false,
    routeHistory: generateRouteHistory([37.6667, -0.0500], '47'),
    account: { id: 3, name: 'Kingsmil Co.' }
  },
  {
    id: 48,
    registrationNumber: 'KEX 666Z',
    imei: '867329032849304',
    model: { id: 6, name: 'Land Cruiser', type: { id: 1, name: 'Toyota' }, make: { id: 3, name: 'SUV' }},
    year: 2023,
    coordinates: [36.7833, -1.3333], // The Carnivore Grounds
    heading: 310,
    speed: 0,
    status: 'offline',
    lastUpdate: new Date(Date.now() - 6 * 60 * 60 * 1000),
    driverName: 'Phanice Anyango',
    isSelected: false,
    routeHistory: generateRouteHistory([36.7833, -1.3333], '48'),
    account: { id: 2, name: 'Delivery Services Ltd.' }
  },
  {
    id: 49,
    registrationNumber: 'KEY 775A',
    imei: '867329032849305',
    model: { id: 19, name: 'Sportage', type: { id: 16, name: 'Kia' }, make: { id: 3, name: 'SUV' }},
    year: 2022,
    coordinates: [36.9000, -1.2333], // Garden City Mall
    heading: 170,
    speed: 25,
    status: 'online',
    driverName: 'Morris Githinji',
    lastUpdate: new Date(),
    isSelected: false,
    routeHistory: generateRouteHistory([36.9000, -1.2333], '49'),
    account: { id: 1, name: 'Logistics Co.' }
  },
  {
    id: 50,
    registrationNumber: 'KEZ 884B',
    imei: '867329032849306',
    model: { id: 20, name: 'Tucson', type: { id: 17, name: 'Hyundai' }, make: { id: 3, name: 'SUV' }},
    year: 2023,
    coordinates: [36.7667, -1.3667], // Galleria Shopping Mall
    heading: 20,
    speed: 5,
    status: 'online',
    driverName: 'Winnie Nafula',
    lastUpdate: new Date(),
    isSelected: false,
    routeHistory: generateRouteHistory([36.7667, -1.3667], '50'),
    account: { id: 5, name: 'Express Deliveries' }
  }
];

// Mock API functions
export const mockApiDelay = () => new Promise(resolve => setTimeout(resolve, 800));

export const fetchVehicles = async (): Promise<Vehicle[]> => {
  await mockApiDelay();
  return [...mockVehicles];
};

export const updateVehicleSelection = async (vehicleId: number, isSelected: boolean): Promise<Vehicle[]> => {
  await mockApiDelay();
  const vehicleIndex = mockVehicles.findIndex(v => v.id === vehicleId);
  if (vehicleIndex !== -1) {
    mockVehicles[vehicleIndex].isSelected = isSelected;
  }
  return [...mockVehicles];
};

export const simulateVehicleMovement = () => {
  // Simulate real-time vehicle movement
  mockVehicles.forEach(vehicle => {
    if (vehicle.status === 'online') {
      // Small random movement for online vehicles
      const latChange = (Math.random() - 0.5) * 0.001;
      const lngChange = (Math.random() - 0.5) * 0.001;
      
      vehicle.coordinates = [
        vehicle.coordinates[0] + lngChange,
        vehicle.coordinates[1] + latChange
      ];
      
      // Update heading and speed randomly
      vehicle.heading = (vehicle.heading + (Math.random() - 0.5) * 50) % 360;
      vehicle.speed = Math.round(Math.max(0, Math.min(100, vehicle.speed + (Math.random() - 0.5) * 10)) * 100) / 100;
      vehicle.lastUpdate = new Date();
      
      // Add to route history
      vehicle.routeHistory.push({
        coordinates: [...vehicle.coordinates],
        timestamp: new Date(),
        speed: vehicle.speed,
        heading: vehicle.heading
      });
      
      // Keep only last 20 points
      if (vehicle.routeHistory.length > 20) {
        vehicle.routeHistory.shift();
      }
    }
  });
};
