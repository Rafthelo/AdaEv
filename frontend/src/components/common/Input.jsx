const Input = ({
  label, name, type = 'text', value, onChange,
  placeholder = '', error = '', required = false,
  disabled = false, className = '',
}) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`
          px-3 py-2 border rounded-lg text-sm transition
          bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
          placeholder:text-gray-400 dark:placeholder:text-gray-500
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:bg-gray-50 dark:disabled:bg-gray-900 disabled:text-gray-400 dark:disabled:text-gray-600
          ${error ? 'border-red-400 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600'}
            [&:-webkit-autofill]:bg-gray-800
  [&:-webkit-autofill]:[box-shadow:0_0_0_1000px_theme(colors.gray.800)_inset]
  [&:-webkit-autofill]:[-webkit-text-fill-color:theme(colors.gray.100)]
        `}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Input;