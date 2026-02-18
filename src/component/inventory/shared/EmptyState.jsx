import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({ title, description, action }) {
  return (
    <div className="text-center py-12 px-6 bg-white border border-dashed border-gray-300 rounded-2xl">
      <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
        <Inbox size={24} className="text-gray-500" />
      </div>
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600 mt-2">{description}</p>
      {action}
    </div>
  );
}
