import React from 'react';
import { useMechanic } from '../contexts/MechanicContext';
import { TrendingUp, Clock, Star, CheckCircle } from 'lucide-react';

/* -- Helper: Last 6 Months -- */
const getLast6Months = () => {
  const months = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(date.toLocaleString('default', { month: 'short' }));
  }
  
  return months;
};

/* -- Reusable Chart Card -- */
const ChartCard = ({ title, color, data }) => {
  const maxValue = Math.max(...data);
  const months = getLast6Months();

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm h-[360px] flex flex-col">
      <h2 className="text-lg font-bold text-black mb-6">{title}</h2>

      <div className="flex-1 flex items-end justify-between px-4">
        {data.map((value, idx) => (
          <div key={idx} className="flex flex-col items-center flex-1">
            {/* Bar */}
            <div className="h-48 flex items-end">
              <div
                className={`w-8 ${color} rounded-t transition-all duration-300`}
                style={{ height: `${(value / maxValue) * 100}%` }}
              />
            </div>

            {/* Value */}
            <span className="text-sm text-gray-700 mt-2">{value}</span>

            {/* Month */}
            <span className="text-xs text-gray-500 mt-1">{months[idx]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function PerformanceTracking() {
  const { performanceMetrics, currentMechanic } = useMechanic();

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-bold text-black mb-2">Performance Tracking</h1>
        <p className="text-gray-600 text-sm">
          View your personal performance metrics • {currentMechanic.name}
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
        <p className="text-sm text-blue-700">
          This dashboard shows only your personal performance data.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {/* Jobs */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <CheckCircle className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-black mb-1">
            {performanceMetrics.thisMonth.jobsCompleted}
          </div>
          <div className="text-sm text-gray-600">Jobs Completed</div>
          <div className="text-xs text-green-600 mt-2 font-semibold">This Month</div>
        </div>

        {/* Avg Time */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <Clock className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-black mb-1">
            {performanceMetrics.thisMonth.avgCompletionTime}
          </div>
          <div className="text-sm text-gray-600">Avg Completion Time</div>
          <div className="text-xs text-blue-600 mt-2 font-semibold">On Target</div>
        </div>

        {/* Quality */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <Star className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-black mb-1">
            {performanceMetrics.thisMonth.qualityRating}
            <span className="text-lg text-gray-500">/5</span>
          </div>
          <div className="text-sm text-gray-600">Quality Rating</div>
          <div className="text-xs text-purple-600 mt-2 font-semibold">Excellent</div>
        </div>

        {/* Efficiency */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="text-3xl font-bold text-black mb-1">
            {performanceMetrics.thisMonth.efficiencyRatio}%
          </div>
          <div className="text-sm text-gray-600">Efficiency Ratio</div>
          <div className="text-xs text-yellow-600 mt-2 font-semibold">Above Average</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-6">
        <ChartCard
          title="Jobs Completed (Last 6 Months)"
          color="bg-blue-500"
          data={performanceMetrics.trends.jobsCompleted}
        />

        <ChartCard
          title="Quality Rating Trend"
          color="bg-purple-500"
          data={performanceMetrics.trends.qualityRating}
        />
      </div>
    </div>
  );
}

