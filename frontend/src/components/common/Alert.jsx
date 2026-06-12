const variants = {
  success: 'bg-green-50 border-green-200 text-green-700',
  error:   'bg-red-50 border-red-200 text-red-700',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  info:    'bg-blue-50 border-blue-200 text-blue-700',
};

const Alert = ({ type = 'info', message, onClose }) => {
  if (!message) return null;
  return (
    <div className={`flex items-start justify-between px-4 py-3 rounded-lg border text-sm ${variants[type]}`}>
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} className="ml-4 opacity-60 hover:opacity-100">✕</button>
      )}
    </div>
  );
};

export default Alert;