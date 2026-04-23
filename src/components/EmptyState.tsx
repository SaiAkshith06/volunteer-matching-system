import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-14 h-14 rounded-full bg-[#f8f4ec] flex items-center justify-center text-gray-300 mb-5">
        {icon || <Inbox size={24} />}
      </div>
      <h3 className="text-sm font-bold text-gray-500 mb-1 tracking-tight">{title}</h3>
      <p className="text-xs text-gray-400 max-w-[260px] leading-relaxed">{description}</p>
    </div>
  );
};

export default EmptyState;
