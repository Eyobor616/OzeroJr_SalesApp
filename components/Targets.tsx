import React, { useState } from 'react';
import { AppState, Goal } from '../types';
import { Target, Trophy, Calendar, Plus } from 'lucide-react';

interface TargetsProps {
  goals: Goal[];
  onAddGoal: (goal: Goal) => void;
}

const Targets: React.FC<TargetsProps> = ({ goals, onAddGoal }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Goal>>({ type: 'revenue' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.targetAmount && formData.deadline) {
      onAddGoal({
        id: `g${Date.now()}`,
        title: formData.title,
        targetAmount: Number(formData.targetAmount),
        currentAmount: 0, // Starts at 0, logic would need to update this based on sales
        deadline: formData.deadline,
        type: formData.type as 'revenue' | 'sales_count'
      });
      setIsModalOpen(false);
      setFormData({ type: 'revenue' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Targets & Goals</h1>
          <p className="text-slate-500">Track your progress towards success</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors"
        >
          <Plus size={18} />
          Set New Goal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal) => {
          const percentage = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
          const isRevenue = goal.type === 'revenue';
          
          return (
            <div key={goal.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${isRevenue ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                    {isRevenue ? <Target size={24} /> : <Trophy size={24} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{goal.title}</h3>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Calendar size={12} />
                      Due {new Date(goal.deadline).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-slate-900">{percentage}%</span>
                </div>
              </div>
              
              <div className="w-full bg-slate-100 rounded-full h-3 mb-2">
                <div 
                  className={`h-3 rounded-full transition-all duration-1000 ease-out ${percentage >= 100 ? 'bg-green-500' : 'bg-indigo-600'}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              
              <div className="flex justify-between text-sm font-medium text-slate-600">
                <span>{isRevenue ? '$' : ''}{goal.currentAmount.toLocaleString()}</span>
                <span className="text-slate-400">Target: {isRevenue ? '$' : ''}{goal.targetAmount.toLocaleString()}</span>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Set New Goal</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Goal Title</label>
                <input 
                  type="text" 
                  required
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.title || ''}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g. Q4 Revenue"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                  <select 
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value as any})}
                  >
                    <option value="revenue">Revenue Target</option>
                    <option value="sales_count">Sales Volume</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Target Amount</label>
                  <input 
                    type="number" 
                    required
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.targetAmount || ''}
                    onChange={e => setFormData({...formData, targetAmount: Number(e.target.value)})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Deadline</label>
                <input 
                  type="date" 
                  required
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.deadline || ''}
                  onChange={e => setFormData({...formData, deadline: e.target.value})}
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Targets;