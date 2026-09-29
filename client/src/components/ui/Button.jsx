const Button = ({ children, className = "", variant = "primary", ...props }) => {
  return (
    <button
      {...props}
      className={`
        w-full py-2.5 px-4 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-700
        shadow-[0_2px_8px_rgba(37,99,235,0.2)] hover:shadow-[0_4px_16px_rgba(37,99,235,0.3)]
        hover:-translate-y-[1px]
        active:scale-[0.98] active:translate-y-0
        transition-all duration-200 ease-[cubic-bezier(0.25,1,0.5,1)]
        focus:outline-none focus:ring-2 focus:ring-blue-500/30
        cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:transform-none
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
