import React from 'react';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import type { Toast } from '../hooks/useVolunteerMatch';

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

const iconMap = {
  success: <CheckCircle size={16} className="text-[#2a9d8f] shrink-0" />,
  error: <AlertTriangle size={16} className="text-[#e76f51] shrink-0" />,
  info: <Info size={16} className="text-[#f4a261] shrink-0" />,
};

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="warm-card !hover:scale-100 flex items-start gap-3 p-4 animate-slide-in"
        >
          {iconMap[toast.type]}
          <p className="text-sm font-medium text-gray-700 flex-1 leading-snug">{toast.message}</p>
          <button
            onClick={() => onDismiss(toast.id)}
            className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
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
