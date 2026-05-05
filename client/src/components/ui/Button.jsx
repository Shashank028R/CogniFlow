const Button = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className="
      w-full p-3 rounded-xl font-semibold text-blue-600 bg-[#eef2f7]

      shadow-[6px_6px_12px_#d1d9e6,-6px_-6px_12px_#ffffff]

      transition-all duration-300 ease-out

      hover:scale-105
      hover:shadow-[4px_4px_10px_#d1d9e6,-4px_-4px_10px_#ffffff,0_0_10px_rgba(37,99,235,0.4)]

      active:scale-95
      active:shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff]

      focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer
      "
    >
      {children}
    </button>
  );
};

export default Button;
