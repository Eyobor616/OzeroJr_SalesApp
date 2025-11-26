import React from 'react';
import { AppState } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface AnalyticsProps {
  state: AppState;
}

const COLORS = ['#4f46e5', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316'];

const Analytics: React.FC<AnalyticsProps> = ({ state }) => {
  // Data for Sales by Product
  const productSales = state.products.map(product => {
    const totalSold = state.sales.reduce((acc, sale) => {
      const item = sale.items.find(i => i.productId === product.id);
      return acc + (item ? item.total : 0);
    }, 0);
    return { name: product.name, value: totalSold };
  }).sort((a, b) => b.value - a.value).slice(0, 5);

  // Data for Sales by Customer
  const customerSales = state.customers.map(customer => {
    const totalBought = state.sales
      .filter(s => s.customerId === customer.id)
      .reduce((acc, s) => acc + s.totalAmount, 0);
    return { name: customer.name, value: totalBought };
  }).sort((a, b) => b.value - a.value).slice(0, 5);

  // Daily Sales
  const salesByDate = state.sales.reduce((acc: any, sale) => {
    const date = sale.date.split('T')[0];
    acc[date] = (acc[date] || 0) + sale.totalAmount;
    return acc;
  }, {});
  
  const dailyData = Object.keys(salesByDate)
    .sort()
    .slice(-14) // Last 14 days with data
    .map(date => ({ date, amount: salesByDate[date] }));

  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-2xl font-bold text-slate-800">Analytics & Reports</h1>
        <p className="text-slate-500">Deep dive into your sales data</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Top Products by Revenue</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productSales} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0"/>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  formatter={(value: number) => `$${value.toFixed(2)}`}
                />
                <Bar dataKey="value" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Customers Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Revenue Distribution (Top Customers)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={customerSales}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {customerSales.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-4 justify-center mt-4">
            {customerSales.map((entry, index) => (
              <div key={index} className="flex items-center gap-2 text-xs text-slate-600">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                {entry.name}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Daily Trend Line Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 lg:col-span-2">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Daily Sales Performance</h3>
           <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`}/>
                <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Sales']} />
                <Line type="monotone" dataKey="amount" stroke="#f43f5e" strokeWidth={3} dot={{r: 4, fill: '#f43f5e', strokeWidth: 2, stroke: '#fff'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;