const Button = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className="
      w-full p-3 rounded-xl font-semibold text-blue-600 bg-[#eef2f7]
      shadow-[6px_6px_12px_#d1d9e6,-6px_-6px_12px_#ffffff]
      transition-all duration-300 ease-in-out
      hover:shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff]
      hover:-translate-y-0.5
      active:translate-y-0
      active:scale-95
      active:shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff]
      focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-[#eef2f7]
      cursor-pointer
      "
    >
      {children}
    </button>
  );
};

export default Button;
