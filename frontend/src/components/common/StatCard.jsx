import React from 'react';

export default function StatCard({ icon, label, value, percentage, color }) {
  const isPositive = percentage >= 0;
  const colorClass = color === 'blue' ? 'bg-blue-500' : 'bg-gradient-to-br from-blue-500 to-teal-500';

  return (
    <div className={`${colorClass} text-white rounded-lg p-6 relative overflow-hidden`}>
      <div className="absolute -bottom-4 -right-4 w-24 h-24 opacity-10">
        <div className="w-full h-full rounded-full bg-white"></div>
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">{icon}</span>
          <span className="text-sm opacity-90">{label}</span>
        </div>
        <div className="text-2xl md:text-3xl font-bold">{value}</div>
        <p className={`text-sm mt-2 ${isPositive ? 'text-green-200' : 'text-red-200'}`}>
          {isPositive ? '+' : ''}{percentage}%
        </p>
      </div>
    </div>
  );
}