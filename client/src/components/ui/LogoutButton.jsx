const LogoutButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full py-2 rounded-xl font-semibold text-red-500
      bg-[var(--bg)]
      shadow-[5px_5px_10px_var(--shadow-dark),-5px_-5px_10px_var(--shadow-light)]
      transition-all duration-300 ease-in-out
      hover:shadow-[7px_7px_14px_var(--shadow-dark),-7px_-7px_14px_var(--shadow-light)]
      hover:-translate-y-0.5
      active:translate-y-0
      active:scale-95
      active:shadow-[inset_3px_3px_6px_var(--shadow-dark),inset_-3px_-3px_6px_var(--shadow-light)]
      focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-[#eef2f7]
      cursor-pointer"
    >
      Logout
    </button>
  );
};

export default LogoutButton;