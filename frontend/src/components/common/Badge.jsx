const variants = {
  green:  'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400',
  red:    'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400',
  blue:   'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400',
  yellow: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400',
  gray:   'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
  purple: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400',
};

const Badge = ({ label, color = 'gray' }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[color]}`}>
    {label}
  </span>
);

export default Badge;