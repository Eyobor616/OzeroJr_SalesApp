import React, { useState } from 'react';
import { View } from '../types';
import { LayoutDashboard, Users, ShoppingBag, ShoppingCart, BarChart2, Target, Menu, X } from 'lucide-react';

interface LayoutProps {
  currentView: View;
  onChangeView: (view: View) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentView, onChangeView, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Desktop collapse state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Mobile drawer state

  const NavItem = ({ view, icon, label }: { view: View, icon: React.ReactNode, label: string }) => (
    <button
      onClick={() => {
        onChangeView(view);
        setMobileMenuOpen(false); // Close mobile menu when an item is clicked
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium text-sm
        ${currentView === view 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'}`}
    >
      <div className="shrink-0">{icon}</div>
      {/* Label is hidden on desktop if sidebar is collapsed, but always visible (block) on mobile */}
      <span className={`${!sidebarOpen ? 'md:hidden' : 'block'} transition-opacity whitespace-nowrap`}>
        {label}
      </span>
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-50 relative overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 text-white flex items-center justify-between px-4 z-40 shadow-md">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
             <BarChart2 size={20} />
           </div>
           <span className="font-bold text-lg">SalesPulse AI</span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 text-slate-300 hover:text-white"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Overlay Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 bg-slate-900 text-white transition-all duration-300 flex flex-col
        w-64 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:static md:h-full
        ${sidebarOpen ? 'md:w-64' : 'md:w-20'}
      `}>
        {/* Sidebar Header */}
        <div className="p-6 flex items-center justify-between border-b border-slate-800 h-20 md:h-auto shrink-0">
          <div className={`flex items-center gap-3 ${!sidebarOpen ? 'md:justify-center w-full' : ''}`}>
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shrink-0">
              <BarChart2 size={20} className="text-white" />
            </div>
            {/* Title: Visible on mobile, hidden on desktop if collapsed */}
            <span className={`font-bold text-lg tracking-tight whitespace-nowrap ${!sidebarOpen ? 'md:hidden' : 'block'}`}>
              SalesPulse AI
            </span>
          </div>
          {/* Close button for mobile only */}
          <button 
            onClick={() => setMobileMenuOpen(false)} 
            className="md:hidden text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavItem view="dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <NavItem view="sales_entry" icon={<ShoppingCart size={20} />} label="Sales Entry" />
          <NavItem view="customers" icon={<Users size={20} />} label="Customers" />
          <NavItem view="products" icon={<ShoppingBag size={20} />} label="Products" />
          <NavItem view="analytics" icon={<BarChart2 size={20} />} label="Analytics" />
          <NavItem view="targets" icon={<Target size={20} />} label="Goals & Targets" />
        </nav>

        {/* Sidebar Footer (Desktop Collapse) */}
        <div className="p-4 border-t border-slate-800 hidden md:block shrink-0">
           <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`flex items-center gap-3 text-slate-400 hover:text-white transition-colors w-full px-2 ${!sidebarOpen ? 'justify-center' : ''}`}
           >
             <Menu size={20} />
             <span className={`${!sidebarOpen ? 'hidden' : 'block'} text-sm whitespace-nowrap`}>Collapse Menu</span>
           </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto w-full pt-16 md:pt-0">
        <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;