import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
        {icon || <Inbox size={24} />}
      </div>
      <h3 className="text-sm font-bold text-slate-600 mb-1">{title}</h3>
      <p className="text-xs text-slate-400 max-w-[260px] leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default EmptyState;
