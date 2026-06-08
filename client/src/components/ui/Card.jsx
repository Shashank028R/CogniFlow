const Card = ({ children }) => {
  return (
    <div
      className="
          p-8 rounded-2xl bg-[#eef2f7]
          shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff]
          transition-all duration-500 animate-breath
          hover:shadow-[12px_12px_24px_#d1d9e6,-12px_-12px_24px_#ffffff]
          hover:-translate-y-1
        "
    >
      {children}
    </div>
  );
};

export default Card;
