const Button = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className="
      w-full p-3 rounded-xl font-semibold text-blue-600 bg-[var(--bg)]
      shadow-[6px_6px_12px_var(--shadow-dark),-6px_-6px_12px_var(--shadow-light)]
      transition-all duration-300 ease-in-out
      hover:shadow-[8px_8px_16px_var(--shadow-dark),-8px_-8px_16px_var(--shadow-light)]
      hover:-translate-y-0.5
      active:translate-y-0
      active:scale-95
      active:shadow-[inset_4px_4px_8px_var(--shadow-dark),inset_-4px_-4px_8px_var(--shadow-light)]
      focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-[#eef2f7]
      cursor-pointer
      "
    >
      {children}
    </button>
  );
};

export default Button;
