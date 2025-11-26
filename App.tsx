import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Customers from './components/Customers';
import Products from './components/Products';
import SalesEntry from './components/SalesEntry';
import Analytics from './components/Analytics';
import Targets from './components/Targets';
import { AppState, View, Customer, Product, Sale, Goal } from './types';
import { loadData, saveData } from './services/storageService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [state, setState] = useState<AppState | null>(null);

  useEffect(() => {
    // Simulate loading
    const data = loadData();
    setState(data);
  }, []);

  useEffect(() => {
    if (state) {
      saveData(state);
    }
  }, [state]);

  const addCustomer = (customer: Customer) => {
    if (!state) return;
    setState({
      ...state,
      customers: [...state.customers, customer]
    });
  };

  const updateCustomer = (updatedCustomer: Customer) => {
    if (!state) return;
    setState({
      ...state,
      customers: state.customers.map(c => c.id === updatedCustomer.id ? updatedCustomer : c)
    });
  };

  const addProduct = (product: Product) => {
    if (!state) return;
    setState({
      ...state,
      products: [...state.products, product]
    });
  };

  const addSale = (sale: Sale) => {
    if (!state) return;
    
    // Decrease stock for sold items
    const updatedProducts = state.products.map(p => {
      const soldItem = sale.items.find(i => i.productId === p.id);
      if (soldItem) {
        return { ...p, stock: p.stock - soldItem.quantity };
      }
      return p;
    });

    // Update goals progress
    const updatedGoals = state.goals.map(g => {
      if (g.type === 'revenue') {
        return { ...g, currentAmount: g.currentAmount + sale.totalAmount };
      } else if (g.type === 'sales_count') {
        return { ...g, currentAmount: g.currentAmount + 1 };
      }
      return g;
    });

    setState({
      ...state,
      products: updatedProducts,
      sales: [sale, ...state.sales],
      goals: updatedGoals
    });
    
    // Redirect to dashboard or show success? Let's go to Dashboard to see the impact
    setCurrentView('dashboard');
  };

  const addGoal = (goal: Goal) => {
    if (!state) return;
    setState({
      ...state,
      goals: [...state.goals, goal]
    });
  };

  if (!state) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="animate-spin h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard state={state} />;
      case 'customers':
        return <Customers customers={state.customers} onAddCustomer={addCustomer} onUpdateCustomer={updateCustomer} />;
      case 'products':
        return <Products products={state.products} onAddProduct={addProduct} />;
      case 'sales_entry':
        return <SalesEntry customers={state.customers} products={state.products} onSaveSale={addSale} />;
      case 'analytics':
        return <Analytics state={state} />;
      case 'targets':
        return <Targets goals={state.goals} onAddGoal={addGoal} />;
      default:
        return <Dashboard state={state} />;
    }
  };

  return (
    <Layout currentView={currentView} onChangeView={setCurrentView}>
      {renderContent()}
    </Layout>
  );
};

export default App;