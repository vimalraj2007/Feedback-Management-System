import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '../components/ui/StarRating';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback(({ type = 'info', title, message, duration = 3000 }) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, title, message }]);
    
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col space-y-2 pointer-events-none">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem = ({ toast, onRemove }) => {
  const { type, title, message } = toast;
  
  const iconMap = {
    success: <CheckCircle2 className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />
  };

  const bgMap = {
    success: 'bg-green-50/50 border-green-100',
    error: 'bg-red-50/50 border-red-100',
    warning: 'bg-yellow-50/50 border-yellow-100',
    info: 'bg-white border-gray-100'
  };

  return (
    <div className={cn(
      "pointer-events-auto flex items-start p-4 rounded-xl shadow-lg border backdrop-blur-md animate-in slide-in-from-bottom-5 fade-in duration-300 w-full max-w-sm",
      bgMap[type] || bgMap.info
    )}>
      <div className="shrink-0 mr-3 mt-0.5">
        {iconMap[type] || iconMap.info}
      </div>
      <div className="flex-1 pr-4">
        {title && <h4 className="text-sm font-semibold text-gray-900">{title}</h4>}
        {message && <p className="text-sm text-gray-600 mt-1">{message}</p>}
      </div>
      <button 
        onClick={onRemove}
        className="shrink-0 ml-auto flex items-center justify-center w-6 h-6 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
