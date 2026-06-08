const Card = ({ children }) => {
  return (
    <div
      className="
          p-8 rounded-2xl bg-[var(--bg)]
          shadow-[10px_10px_20px_var(--shadow-dark),-10px_-10px_20px_var(--shadow-light)]
          transition-all duration-500 animate-breath
          hover:shadow-[12px_12px_24px_var(--shadow-dark),-12px_-12px_24px_var(--shadow-light)]
          hover:-translate-y-1
        "
    >
      {children}
    </div>
  );
};

export default Card;
