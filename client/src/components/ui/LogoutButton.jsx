const LogoutButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full py-2 rounded-xl font-semibold text-red-500
      bg-[#f5f7fa]
      shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff]
      transition-all duration-200
      hover:scale-102
      hover:shadow-[3px_3px_8px_#d1d9e6,-3px_-3px_8px_#ffffff,0_0_6px_rgba(239,68,68,0.3)] cursor-pointer"
    >
      Logout
    </button>
  );
};

export default LogoutButton;