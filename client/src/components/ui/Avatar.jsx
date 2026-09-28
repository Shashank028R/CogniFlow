const Avatar = ({ text, src, size = "w-10 h-10" }) => {
  return (
    <div
      className={`${size} rounded-full overflow-hidden flex items-center justify-center
      bg-slate-100 dark:bg-slate-800
      border border-slate-200/80 dark:border-slate-700/60
      shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex-shrink-0`}
    >
      {src ? (
        <img src={src} alt="avatar" className="w-full h-full object-cover" />
      ) : (
        <span className="font-bold text-blue-600 text-sm">{text}</span>
      )}
    </div>
  );
};

export default Avatar;
