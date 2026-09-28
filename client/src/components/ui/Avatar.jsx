const Avatar = ({ text, src, size = "w-10 h-10" }) => {
  return (
    <div
      className={`${size} rounded-full overflow-hidden flex items-center justify-center
      bg-[var(--card)]
      shadow-[inset_3px_3px_6px_var(--shadow-dark),inset_-3px_-3px_6px_var(--shadow-light)]`}
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
