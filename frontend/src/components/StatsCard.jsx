import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ title, value, change, changeType, icon, gradient = false }) => {
  const changeColorClass = changeType === 'positive'
    ? 'text-emerald-700 bg-emerald-50 border border-emerald-100'
    : 'text-rose-700 bg-rose-50 border border-rose-100';

  const cardClass = gradient
    ? 'bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-500/30'
    : 'glass-card hover:border-indigo-100';

  const textColorClass = gradient ? 'text-white' : 'text-slate-900';
  const subtitleColorClass = gradient ? 'text-indigo-100' : 'text-slate-500';

  return (
    <div className={`${cardClass} rounded-2xl p-6 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl group`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className={`text-xs font-bold uppercase tracking-wider ${subtitleColorClass} mb-3`}>{title}</p>
          <p className={`text-3xl font-bold ${textColorClass} mb-4 tracking-tight`}>{value}</p>
          <div className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold ${gradient ? 'bg-white/20 text-white backdrop-blur-sm border border-white/20' : changeColorClass}`}>
            {changeType === 'positive' ? (
              <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 mr-1.5" />
            )}
            {change}
          </div>
        </div>
        <div className={`p-4 rounded-xl ${gradient ? 'bg-white/20 backdrop-blur-sm border border-white/20' : 'bg-slate-50 group-hover:bg-indigo-50 group-hover:text-indigo-600'} transition-all duration-300`}>
          <div className={`${gradient ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'}`}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
