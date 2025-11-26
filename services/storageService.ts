import { AppState, Customer, Product, Sale, Goal } from '../types';

const STORAGE_KEY = 'sales_pulse_data_v1';

const SEED_CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'Acme Corp', email: 'contact@acme.com', phone: '555-0101', company: 'Acme Inc.', joinedAt: '2023-01-15' },
  { id: 'c2', name: 'Globex', email: 'procurement@globex.com', phone: '555-0102', company: 'Globex Corp', joinedAt: '2023-03-22' },
  { id: 'c3', name: 'Soylent Corp', email: 'info@soylent.com', phone: '555-0103', company: 'Soylent', joinedAt: '2023-05-10' },
  { id: 'c4', name: 'Initech', email: 'sales@initech.com', phone: '555-0104', company: 'Initech', joinedAt: '2023-06-05' },
];

const SEED_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Premium Widget', category: 'Hardware', price: 199.99, stock: 45, sku: 'WDG-001' },
  { id: 'p2', name: 'Service Plan Basic', category: 'Services', price: 49.99, stock: 9999, sku: 'SVC-BSC' },
  { id: 'p3', name: 'Service Plan Pro', category: 'Services', price: 149.99, stock: 9999, sku: 'SVC-PRO' },
  { id: 'p4', name: 'Super Gadget', category: 'Hardware', price: 299.50, stock: 12, sku: 'GDG-002' },
  { id: 'p5', name: 'Consulting Hour', category: 'Services', price: 150.00, stock: 500, sku: 'CNS-001' },
];

const SEED_GOALS: Goal[] = [
  { id: 'g1', title: 'Q4 Revenue Target', targetAmount: 50000, currentAmount: 32450, deadline: '2023-12-31', type: 'revenue' },
  { id: 'g2', title: 'New Customer Acquisition', targetAmount: 100, currentAmount: 65, deadline: '2023-12-31', type: 'sales_count' },
];

// Helper to generate some random past sales
const generatePastSales = (): Sale[] => {
  const sales: Sale[] = [];
  const now = new Date();
  for (let i = 0; i < 25; i++) {
    const date = new Date(now.getTime() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000); // Last 90 days
    const customer = SEED_CUSTOMERS[Math.floor(Math.random() * SEED_CUSTOMERS.length)];
    const numItems = Math.floor(Math.random() * 3) + 1;
    const items = [];
    let total = 0;

    for (let j = 0; j < numItems; j++) {
      const product = SEED_PRODUCTS[Math.floor(Math.random() * SEED_PRODUCTS.length)];
      const qty = Math.floor(Math.random() * 5) + 1;
      const lineTotal = product.price * qty;
      items.push({
        productId: product.id,
        productName: product.name,
        quantity: qty,
        priceAtSale: product.price,
        total: lineTotal
      });
      total += lineTotal;
    }

    sales.push({
      id: `s${i}`,
      customerId: customer.id,
      customerName: customer.name,
      items: items,
      totalAmount: total,
      date: date.toISOString(),
      status: 'completed'
    });
  }
  return sales.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const SEED_SALES = generatePastSales();

export const loadData = (): AppState => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  const initialState: AppState = {
    customers: SEED_CUSTOMERS,
    products: SEED_PRODUCTS,
    sales: SEED_SALES,
    goals: SEED_GOALS,
  };
  saveData(initialState);
  return initialState;
};

export const saveData = (state: AppState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};