const variants = {
  success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400',
  error:   'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400',
  warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400',
  info:    'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400',
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