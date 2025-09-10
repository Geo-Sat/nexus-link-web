export interface Account {
  id: number;
  name: string;
  phone?:string;
  
  isSelected?: boolean; // Optional selection state
}