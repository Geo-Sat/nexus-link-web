
import { Account } from '@/types/account';

export const mockAccounts: Account[] = [
  { id: 1, name: 'Logistics Co.', isSelected: false },
  { id: 2, name: 'Delivery Services Ltd.', isSelected: false },
  { id: 3, name: 'Kingsmil Co.', isSelected: false },
  { id: 4, name: 'Express Deliveries', isSelected: false },
  { id: 5, name: 'Global Shipping Partners', isSelected: false },
  { id: 6, name: 'Metro Transport Inc.', isSelected: false },
  { id: 7, name: 'Premier Logistics Group', isSelected: false },
  { id: 8, name: 'Nationwide Freight Services', isSelected: false },
  { id: 9, name: 'Swift Distribution Network', isSelected: false },
  { id: 10, name: 'Reliable Transport Solutions', isSelected: false },
  { id: 11, name: 'Elite Courier Services', isSelected: false },
  { id: 12, name: 'Urban Delivery Express', isSelected: false },
  { id: 13, name: 'Continental Logistics Ltd.', isSelected: false },
  { id: 14, name: 'Prime Movers Inc.', isSelected: false },
  { id: 15, name: 'Apex Transport Systems', isSelected: false },
  { id: 16, name: 'Coastal Shipping Co.', isSelected: false },
  { id: 17, name: 'Interstate Freight Lines', isSelected: false },
  { id: 18, name: 'Regional Distribution Co.', isSelected: false },
  { id: 19, name: 'Pioneer Transport Services', isSelected: false },
  { id: 20, name: 'Unified Logistics Network', isSelected: false },
  { id: 21, name: 'Velocity Delivery Systems', isSelected: false },
  { id: 22, name: 'Horizon Shipping Partners', isSelected: false },
  { id: 23, name: 'Summit Transport Group', isSelected: false },
  { id: 24, name: 'Allied Distribution Ltd.', isSelected: false },
  { id: 25, name: 'Progressive Logistics Inc.', isSelected: false },
  { id: 26, name: 'Eagle Eye Transport', isSelected: false },
  { id: 27, name: 'Precision Delivery Co.', isSelected: false },
  { id: 28, name: 'Transcontinental Freight', isSelected: false },
  { id: 29, name: 'Next Day Logistics', isSelected: false },
  { id: 30, name: 'Blue Ocean Shipping', isSelected: false },
  { id: 31, name: 'Metropolitan Delivery Services', isSelected: false },
  { id: 32, name: 'United Cargo Network', isSelected: false },
  { id: 33, name: 'First Class Transport', isSelected: false },
  { id: 34, name: 'Strategic Logistics Partners', isSelected: false },
  { id: 35, name: 'Rapid Response Delivery', isSelected: false },
  { id: 36, name: 'Global Reach Logistics', isSelected: false },
  { id: 37, name: 'Elite Shipping Consortium', isSelected: false },
  { id: 38, name: 'Premium Transport Solutions', isSelected: false },
  { id: 39, name: 'Integrated Distribution Co.', isSelected: false },
  { id: 40, name: 'Masterpiece Logistics Ltd.', isSelected: false },
  { id: 41, name: 'City Wide Delivery Network', isSelected: false },
  { id: 42, name: 'National Transport Alliance', isSelected: false },
  { id: 43, name: 'Express Lane Logistics', isSelected: false },
  { id: 44, name: 'Reliance Shipping Group', isSelected: false },
  { id: 45, name: 'A1 Delivery Services', isSelected: false },
  { id: 46, name: 'Continental Express Lines', isSelected: false },
  { id: 47, name: 'Priority Transport Ltd.', isSelected: false },
  { id: 48, name: 'Superior Logistics Network', isSelected: false },
  { id: 49, name: 'Coast to Coast Shipping', isSelected: false },
  { id: 50, name: 'Elite Fleet Services', isSelected: false }
];
// Mock API functions
export const mockApiDelay = () => new Promise(resolve => setTimeout(resolve, 800));

export const fetchAccounts = async (): Promise<Account[]> => {
  await mockApiDelay();
  return [...mockAccounts];
};

export const updateAccountSelection = async (accountId: number, isSelected: boolean): Promise<Account[]> => {
  await mockApiDelay();
  const accountIndex = mockAccounts.findIndex(a => a.id === accountId);
  if (accountIndex !== -1) {
    mockAccounts[accountIndex].isSelected = isSelected;
  }
  return [...mockAccounts];
};
