import React from 'react';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import type { Toast } from '../hooks/useVolunteerMatch';

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

const iconMap = {
  success: <CheckCircle size={16} className="text-emerald-500 shrink-0" />,
  error: <AlertTriangle size={16} className="text-rose-500 shrink-0" />,
  info: <Info size={16} className="text-blue-500 shrink-0" />,
};

const bgMap = {
  success: 'bg-emerald-50 border-emerald-200',
  error: 'bg-rose-50 border-rose-200',
  info: 'bg-blue-50 border-blue-200',
};

const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onDismiss,
}) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-sm animate-slide-in ${bgMap[toast.type]}`}
        >
          {iconMap[toast.type]}
          <p className="text-sm font-medium text-slate-800 flex-1 leading-snug">
            {toast.message}
          </p>
          <button
            onClick={() => onDismiss(toast.id)}
            className="text-slate-400 hover:text-slate-600 transition-colors shrink-0"
            aria-label="Dismiss notification"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
