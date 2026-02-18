import React from 'react';

export default function LoadingSkeleton({ rows = 5, cards = 4 }) {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: cards }).map((_, idx) => (
          <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
            <div className="h-8 bg-gray-200 rounded w-2/3" />
          </div>
        ))}
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl p-4">
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="h-10 bg-gray-100 rounded mb-3 last:mb-0" />
        ))}
      </div>
    </div>
  );
}
