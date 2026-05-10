export type OrderStatus = 'pending' | 'preparing' | 'completed' | 'cancelled';

export interface Category {
  id: string;
  name: string;
  nameEn: string;
  order: number;
}

export interface Product {
  id: string;
  name: string;
  nameEn: string;
  categoryId: string;
  priceM: number;
  priceL: number;
  isRecommended: boolean;
  canBeHot: boolean;
  image?: string;
}

export interface Topping {
  id: string;
  name: string;
  price: number;
}

export interface OrderItem {
  id: string;
  name: string;
  size: 'M' | 'L';
  ice: string;
  sugar: string;
  toppings: string[];
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  customerName: string;
  customerPhone?: string;
  timestamp: any; // Firestore Timestamp
}
