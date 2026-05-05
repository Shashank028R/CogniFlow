const Input = ({ className = "", ...props }) => {
  return (
    <input
      {...props}
      className={`
        w-full p-3 rounded-xl outline-none bg-[#f5f7fa] text-sm text-gray-800
        shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff]
        focus:shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff]
        transition-all duration-300
        placeholder:text-gray-400 outline-0
        ${className}
      `}
    />
  );
};

export default Input;