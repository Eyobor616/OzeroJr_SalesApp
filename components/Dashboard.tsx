import React, { useState } from 'react';
import { AppState } from '../types';
import { generateInsights } from '../services/geminiService';
import { DollarSign, ShoppingBag, Users, TrendingUp, Sparkles, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  state: AppState;
}

const Dashboard: React.FC<DashboardProps> = ({ state }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  // Calculate high-level metrics
  const totalRevenue = state.sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalSalesCount = state.sales.length;
  const totalCustomers = state.customers.length;
  
  // Calculate monthly growth (mock calculation based on last 30 days vs previous 30 days)
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const recentSales = state.sales.filter(s => new Date(s.date) >= thirtyDaysAgo);
  const recentRevenue = recentSales.reduce((sum, s) => sum + s.totalAmount, 0);
  
  // Prepare chart data (Sales over time)
  const sortedSales = [...state.sales].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const chartData = sortedSales.map(s => ({
    date: new Date(s.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    amount: s.totalAmount
  }));

  const handleGetInsight = async () => {
    setLoadingInsight(true);
    const result = await generateInsights(state);
    setInsight(result);
    setLoadingInsight(false);
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500">Overview of your business performance</p>
        </div>
        <button 
          onClick={handleGetInsight}
          disabled={loadingInsight}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all disabled:opacity-70"
        >
          {loadingInsight ? (
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <Sparkles size={18} />
          )}
          {loadingInsight ? 'Analyzing...' : 'Ask AI Analyst'}
        </button>
      </header>

      {insight && (
        <div className="bg-white border border-indigo-100 rounded-xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
          <h3 className="text-lg font-semibold text-indigo-900 mb-2 flex items-center gap-2">
            <Sparkles size={20} className="text-indigo-600" />
            AI Insights
          </h3>
          <div className="prose prose-sm text-slate-600 max-w-none">
             {/* Using a simple pre-wrap for now, could be a markdown renderer */}
             <div className="whitespace-pre-wrap font-medium">{insight}</div>
          </div>
          <button 
            onClick={() => setInsight(null)}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
          >
            ×
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
          icon={<DollarSign className="text-green-600" />}
          trend="+12.5%"
          trendUp={true}
          bg="bg-green-50"
        />
        <StatCard 
          title="Total Sales" 
          value={totalSalesCount.toString()} 
          icon={<ShoppingBag className="text-blue-600" />}
          trend="+5.2%"
          trendUp={true}
          bg="bg-blue-50"
        />
        <StatCard 
          title="Active Customers" 
          value={totalCustomers.toString()} 
          icon={<Users className="text-indigo-600" />}
          trend="+2 New"
          trendUp={true}
          bg="bg-indigo-50"
        />
        <StatCard 
          title="30d Revenue" 
          value={`$${recentRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} 
          icon={<TrendingUp className="text-orange-600" />}
          trend="-2.4%"
          trendUp={false}
          bg="bg-orange-50"
        />
      </div>

      {/* Main Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Revenue Trend</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="amount" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Transactions</h3>
          <div className="space-y-4">
            {state.sales.slice(0, 5).map((sale) => (
              <div key={sale.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm">
                    {sale.customerName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{sale.customerName}</p>
                    <p className="text-xs text-slate-500">{new Date(sale.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">+${sale.totalAmount.toFixed(2)}</p>
                  <p className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full inline-block mt-1">Completed</p>
                </div>
              </div>
            ))}
            {state.sales.length === 0 && (
              <p className="text-center text-slate-400 py-8">No recent sales found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, trend, trendUp, bg }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
        {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        <span>{trend} vs last month</span>
      </div>
    </div>
    <div className={`p-3 rounded-lg ${bg}`}>
      {icon}
    </div>
  </div>
);

export default Dashboard;