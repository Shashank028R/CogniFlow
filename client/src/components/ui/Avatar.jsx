const Avatar = ({ text, src }) => {
  return (
    <div
      className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center
      bg-[#f5f7fa]
      shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff]"
    >
      {src ? (
        <img src={src} alt="avatar" className="w-full h-full object-cover" />
      ) : (
        <span className="font-bold text-blue-600">{text}</span>
      )}
    </div>
  );
};

export default Avatar;
