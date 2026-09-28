const Button = ({ children, className = "", ...props }) => {
  return (
    <button
      {...props}
      className={`
        w-full py-2.5 px-4 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-700
        shadow-[0_2px_8px_rgba(37,99,235,0.2)] hover:shadow-[0_4px_12px_rgba(37,99,235,0.3)]
        active:scale-[0.99]
        transition-all duration-200 ease-out
        focus:outline-none focus:ring-2 focus:ring-blue-500/30
        cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
