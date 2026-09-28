const Input = ({ className = "", ...props }) => {
  return (
    <input
      {...props}
      className={`
        w-full p-3 rounded-xl outline-none bg-[var(--card)] text-sm text-[var(--text)]
        shadow-[inset_4px_4px_8px_var(--shadow-dark),inset_-4px_-4px_8px_var(--shadow-light)]
        focus:shadow-[inset_2px_2px_4px_var(--shadow-dark),inset_-2px_-2px_4px_var(--shadow-light)]
        transition-all duration-300
        placeholder:text-gray-400 outline-0
        ${className}
      `}
    />
  );
};

export default Input;