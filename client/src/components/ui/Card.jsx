const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`
        p-6 rounded-2xl bg-[var(--card)]/80 backdrop-blur-xl border border-slate-200/70 dark:border-slate-800/80
        shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)]
        hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)]
        hover:border-slate-300 dark:hover:border-slate-700
        transition-all duration-300
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
