import { VehicleModel } from "@/types/vehicle";

export const mockVehicleMoldes: VehicleModel[] = [
  // Toyota
  { id: 1, name: 'Hilux', type: { id: 1, name: 'Toyota' }, make: { id: 1, name: 'Pickup' } },
  { id: 2, name: 'Land Cruiser', type: { id: 1, name: 'Toyota' }, make: { id: 2, name: 'SUV' } },
  { id: 3, name: 'Premio', type: { id: 1, name: 'Toyota' }, make: { id: 3, name: 'Sedan' } },
  { id: 4, name: 'HiAce', type: { id: 1, name: 'Toyota' }, make: { id: 4, name: 'Van' } },
  { id: 5, name: 'RAV4', type: { id: 1, name: 'Toyota' }, make: { id: 2, name: 'SUV' } },
  { id: 6, name: 'Corolla', type: { id: 1, name: 'Toyota' }, make: { id: 3, name: 'Sedan' } },
  { id: 7, name: 'Prado', type: { id: 1, name: 'Toyota' }, make: { id: 2, name: 'SUV' } },

  // Isuzu
  { id: 8, name: 'D-Max', type: { id: 2, name: 'Isuzu' }, make: { id: 1, name: 'Pickup' } },
  { id: 9, name: 'MU-X', type: { id: 2, name: 'Isuzu' }, make: { id: 2, name: 'SUV' } },
  { id: 10, name: 'FRR', type: { id: 2, name: 'Isuzu' }, make: { id: 7, name: 'Truck' } },

  // Nissan
  { id: 11, name: 'Navara', type: { id: 3, name: 'Nissan' }, make: { id: 1, name: 'Pickup' } },
  { id: 12, name: 'Tiida', type: { id: 3, name: 'Nissan' }, make: { id: 5, name: 'Hatchback' } },
  { id: 13, name: 'X-Trail', type: { id: 3, name: 'Nissan' }, make: { id: 2, name: 'SUV' } },
  { id: 14, name: 'Patrol', type: { id: 3, name: 'Nissan' }, make: { id: 2, name: 'SUV' } },
  { id: 15, name: 'Urvan', type: { id: 3, name: 'Nissan' }, make: { id: 4, name: 'Van' } },

  // Ford
  { id: 16, name: 'Ranger', type: { id: 4, name: 'Ford' }, make: { id: 1, name: 'Pickup' } },
  { id: 17, name: 'Everest', type: { id: 4, name: 'Ford' }, make: { id: 2, name: 'SUV' } },
  { id: 18, name: 'Transit', type: { id: 4, name: 'Ford' }, make: { id: 4, name: 'Van' } },

  // Mitsubishi
  { id: 19, name: 'L200', type: { id: 5, name: 'Mitsubishi' }, make: { id: 1, name: 'Pickup' } },
  { id: 20, name: 'Canter', type: { id: 5, name: 'Mitsubishi' }, make: { id: 7, name: 'Truck' } },
  { id: 21, name: 'Pajero', type: { id: 5, name: 'Mitsubishi' }, make: { id: 2, name: 'SUV' } },
  { id: 22, name: 'Outlander', type: { id: 5, name: 'Mitsubishi' }, make: { id: 2, name: 'SUV' } },

  // Mazda
  { id: 23, name: 'CX-5', type: { id: 6, name: 'Mazda' }, make: { id: 2, name: 'SUV' } },
  { id: 24, name: 'Demio', type: { id: 6, name: 'Mazda' }, make: { id: 5, name: 'Hatchback' } },
  { id: 25, name: 'BT-50', type: { id: 6, name: 'Mazda' }, make: { id: 1, name: 'Pickup' } },

  // Mercedes-Benz
  { id: 26, name: 'Actros', type: { id: 7, name: 'Mercedes-Benz' }, make: { id: 7, name: 'Truck' } },
  { id: 27, name: 'C-Class', type: { id: 7, name: 'Mercedes-Benz' }, make: { id: 3, name: 'Sedan' } },
  { id: 28, name: 'GLE', type: { id: 7, name: 'Mercedes-Benz' }, make: { id: 2, name: 'SUV' } },

  // Subaru
  { id: 29, name: 'Forester', type: { id: 8, name: 'Subaru' }, make: { id: 2, name: 'SUV' } },
  { id: 30, name: 'Impreza', type: { id: 8, name: 'Subaru' }, make: { id: 3, name: 'Sedan' } },
  { id: 31, name: 'Outback', type: { id: 8, name: 'Subaru' }, make: { id: 6, name: 'Wagon' } },

  // Volkswagen
  { id: 32, name: 'Polo', type: { id: 9, name: 'Volkswagen' }, make: { id: 5, name: 'Hatchback' } },
  { id: 33, name: 'Tiguan', type: { id: 9, name: 'Volkswagen' }, make: { id: 2, name: 'SUV' } },
  { id: 34, name: 'Amarok', type: { id: 9, name: 'Volkswagen' }, make: { id: 1, name: 'Pickup' } },

  // Volvo
  { id: 35, name: 'FH', type: { id: 10, name: 'Volvo' }, make: { id: 7, name: 'Truck' } },
  { id: 36, name: 'XC90', type: { id: 10, name: 'Volvo' }, make: { id: 2, name: 'SUV' } },
  { id: 37, name: 'S60', type: { id: 10, name: 'Volvo' }, make: { id: 3, name: 'Sedan' } },

  // Land Rover
  { id: 38, name: 'Discovery', type: { id: 11, name: 'Land Rover' }, make: { id: 2, name: 'SUV' } },
  { id: 39, name: 'Defender', type: { id: 11, name: 'Land Rover' }, make: { id: 2, name: 'SUV' } },
  { id: 40, name: 'Range Rover', type: { id: 11, name: 'Land Rover' }, make: { id: 2, name: 'SUV' } },

  // BMW
  { id: 41, name: 'X5', type: { id: 12, name: 'BMW' }, make: { id: 2, name: 'SUV' } },
  { id: 42, name: '3 Series', type: { id: 12, name: 'BMW' }, make: { id: 3, name: 'Sedan' } },
  { id: 43, name: 'X3', type: { id: 12, name: 'BMW' }, make: { id: 2, name: 'SUV' } },

  // Scania
  { id: 44, name: 'R-series', type: { id: 13, name: 'Scania' }, make: { id: 7, name: 'Truck' } },
  { id: 45, name: 'P-series', type: { id: 13, name: 'Scania' }, make: { id: 7, name: 'Truck' } },

  // Honda
  { id: 46, name: 'Civic', type: { id: 14, name: 'Honda' }, make: { id: 3, name: 'Sedan' } },
  { id: 47, name: 'Fit', type: { id: 14, name: 'Honda' }, make: { id: 5, name: 'Hatchback' } },
  { id: 48, name: 'CR-V', type: { id: 14, name: 'Honda' }, make: { id: 2, name: 'SUV' } },

  // Audi
  { id: 49, name: 'A4', type: { id: 15, name: 'Audi' }, make: { id: 3, name: 'Sedan' } },
  { id: 50, name: 'Q5', type: { id: 15, name: 'Audi' }, make: { id: 2, name: 'SUV' } },
  { id: 51, name: 'Q7', type: { id: 15, name: 'Audi' }, make: { id: 2, name: 'SUV' } },

  // Kia
  { id: 52, name: 'Sportage', type: { id: 16, name: 'Kia' }, make: { id: 2, name: 'SUV' } },
  { id: 53, name: 'Sorento', type: { id: 16, name: 'Kia' }, make: { id: 2, name: 'SUV' } },
  { id: 54, name: 'Rio', type: { id: 16, name: 'Kia' }, make: { id: 5, name: 'Hatchback' } },

  // Hyundai
  { id: 55, name: 'Tucson', type: { id: 17, name: 'Hyundai' }, make: { id: 2, name: 'SUV' } },
  { id: 56, name: 'Santa Fe', type: { id: 17, name: 'Hyundai' }, make: { id: 2, name: 'SUV' } },
  { id: 57, name: 'Accent', type: { id: 17, name: 'Hyundai' }, make: { id: 3, name: 'Sedan' } },

  // MAN
  { id: 58, name: 'TGX', type: { id: 18, name: 'MAN' }, make: { id: 7, name: 'Truck' } },
  { id: 59, name: 'TGS', type: { id: 18, name: 'MAN' }, make: { id: 7, name: 'Truck' } },
];