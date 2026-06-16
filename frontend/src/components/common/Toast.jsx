import { useEffect } from 'react';

const VARIANTS = {
  success: 'bg-green-600',
  error:   'bg-red-600',
  warning: 'bg-yellow-500',
  info:    'bg-blue-600',
};

const Toast = ({ id, type = 'info', message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), 5000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  return (
    <div className={`${VARIANTS[type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-start gap-3 min-w-72 max-w-sm`}>
      <span className="text-lg">
        {type === 'success' ? '✓' : type === 'error' ? '✕' : type === 'warning' ? '⚠️' : 'ℹ️'}
      </span>
      <p className="text-sm flex-1">{message}</p>
      <button onClick={() => onClose(id)} className="opacity-70 hover:opacity-100 text-lg leading-none">✕</button>
    </div>
  );
};

export default Toast;