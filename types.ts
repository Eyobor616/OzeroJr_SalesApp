export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  joinedAt: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sku: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  priceAtSale: number;
  total: number;
}

export interface Sale {
  id: string;
  customerId: string;
  customerName: string;
  items: SaleItem[];
  totalAmount: number;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  type: 'revenue' | 'sales_count';
}

export type View = 'dashboard' | 'customers' | 'products' | 'sales_entry' | 'analytics' | 'targets';

export interface AppState {
  customers: Customer[];
  products: Product[];
  sales: Sale[];
  goals: Goal[];
}