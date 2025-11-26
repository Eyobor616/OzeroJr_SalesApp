import React, { useState, useMemo } from 'react';
import { Customer, Product, Sale, SaleItem } from '../types';
import { Plus, Trash2, ShoppingCart, Check, User, Search } from 'lucide-react';

interface SalesEntryProps {
  customers: Customer[];
  products: Product[];
  onSaveSale: (sale: Sale) => void;
}

const SalesEntry: React.FC<SalesEntryProps> = ({ customers, products, onSaveSale }) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [productSearch, setProductSearch] = useState('');
  
  const selectedCustomer = useMemo(() => 
    customers.find(c => c.id === selectedCustomerId), 
  [customers, selectedCustomerId]);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
    p.sku.toLowerCase().includes(productSearch.toLowerCase())
  );

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.productId === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.productId === product.id 
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.priceAtSale }
          : item
      ));
    } else {
      setCart([...cart, {
        productId: product.id,
        productName: product.name,
        quantity: 1,
        priceAtSale: product.price,
        total: product.price
      }]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, qty: number) => {
    if (qty < 1) return;
    setCart(cart.map(item => 
      item.productId === productId 
        ? { ...item, quantity: qty, total: qty * item.priceAtSale }
        : item
    ));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.total, 0);

  const handleCompleteSale = () => {
    if (!selectedCustomer || cart.length === 0) return;

    const newSale: Sale = {
      id: `s${Date.now()}`,
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      items: cart,
      totalAmount: cartTotal,
      date: new Date().toISOString(),
      status: 'completed'
    };

    onSaveSale(newSale);
    // Reset form
    setCart([]);
    setSelectedCustomerId('');
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 h-full md:h-[calc(100vh-4rem)]">
      {/* Left: Product Selection */}
      <div className="flex-1 flex flex-col space-y-4 min-h-[500px]">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">New Sale</h1>
          <p className="text-slate-500">Select products to add to cart</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-3">
          <Search className="text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search products by name or SKU..." 
            className="flex-1 outline-none text-slate-700"
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 content-start pb-4">
          {filteredProducts.map(product => (
            <button 
              key={product.id}
              onClick={() => addToCart(product)}
              className="bg-white p-4 rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all text-left flex flex-col justify-between group h-32"
            >
              <div className="w-full">
                <h4 className="font-semibold text-slate-800 group-hover:text-indigo-700 truncate w-full">{product.name}</h4>
                <p className="text-xs text-slate-500">{product.sku}</p>
              </div>
              <div className="flex justify-between items-end mt-2">
                <span className="font-bold text-slate-900">${product.price.toFixed(2)}</span>
                <div className="bg-slate-100 p-1.5 rounded-full text-slate-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Plus size={16} />
                </div>
              </div>
            </button>
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-400">
              No products found matching "{productSearch}"
            </div>
          )}
        </div>
      </div>

      {/* Right: Cart & Checkout */}
      <div className="w-full md:w-96 bg-white rounded-xl shadow-lg border border-slate-200 flex flex-col shrink-0 h-auto md:h-full">
        <div className="p-6 border-b border-slate-100 bg-slate-50 rounded-t-xl">
          <h2 className="font-bold text-lg text-slate-800 flex items-center gap-2 mb-4">
            <ShoppingCart size={20} className="text-indigo-600" />
            Current Order
          </h2>
          
          <div className="relative">
             <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
             <select 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white text-slate-700"
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
             >
               <option value="" disabled>Select Customer</option>
               {customers.map(c => (
                 <option key={c.id} value={c.id}>{c.name} - {c.company}</option>
               ))}
             </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] max-h-[400px] md:max-h-none">
          {cart.map((item, index) => (
            <div key={`${item.productId}-${index}`} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
              <div className="flex-1 mr-2">
                <p className="font-medium text-slate-800 text-sm truncate">{item.productName}</p>
                <p className="text-xs text-slate-500">${item.priceAtSale.toFixed(2)} / unit</p>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <input 
                  type="number" 
                  className="w-12 text-center border border-slate-300 rounded p-1 text-sm"
                  value={item.quantity}
                  min="1"
                  onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value))}
                />
                <span className="font-bold text-slate-800 w-16 text-right text-sm">${item.total.toFixed(2)}</span>
                <button 
                  onClick={() => removeFromCart(item.productId)}
                  className="text-red-400 hover:text-red-600 p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {cart.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2 opacity-60 py-8 md:py-0">
              <ShoppingCart size={48} />
              <p>Cart is empty</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-xl">
          <div className="flex justify-between items-center mb-6">
            <span className="text-slate-600">Total Amount</span>
            <span className="text-2xl font-bold text-slate-900">${cartTotal.toFixed(2)}</span>
          </div>
          <button 
            onClick={handleCompleteSale}
            disabled={!selectedCustomer || cart.length === 0}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-indigo-500/30"
          >
            <Check size={20} />
            Complete Sale
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalesEntry;