const Avatar = ({ text, src, size = "w-10 h-10" }) => {
  return (
    <div
      className={`${size} rounded-full overflow-hidden flex items-center justify-center flex-shrink-0
      bg-[#f5f5f7] dark:bg-[#272729]
      border border-[#e0e0e0] dark:border-[#333336]`}
    >
      {src ? (
        <img src={src} alt="avatar" className="w-full h-full object-cover" />
      ) : (
        <span className="font-semibold text-[#0066cc] dark:text-[#2997ff] text-sm tracking-tight">{text}</span>
      )}
    </div>
  );
};

export default Avatar;

