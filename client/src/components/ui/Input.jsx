const Input = ({ className = "", ...props }) => {
  return (
    <input
      {...props}
      className={`
        w-full py-2.5 px-3.5 rounded-xl outline-none bg-[var(--card)] text-sm text-[var(--text)]
        border border-slate-200/80 dark:border-slate-800
        shadow-[0_1px_2px_rgba(0,0,0,0.03)]
        focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10
        transition-all duration-200
        placeholder:text-slate-400
        ${className}
      `}
    />
  );
};

export default Input;