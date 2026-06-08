const LogoutButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full py-2 rounded-xl font-semibold text-red-500
      bg-[#eef2f7]
      shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff]
      transition-all duration-300 ease-in-out
      hover:shadow-[7px_7px_14px_#d1d9e6,-7px_-7px_14px_#ffffff]
      hover:-translate-y-0.5
      active:translate-y-0
      active:scale-95
      active:shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff]
      focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-[#eef2f7]
      cursor-pointer"
    >
      Logout
    </button>
  );
};

export default LogoutButton;