const LogoutButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full py-2.5 px-4 rounded-[8px] font-normal text-[14px] text-white
      bg-[#1d1d1f] hover:bg-[#333336] dark:bg-[#272729] dark:hover:bg-[#333336]
      border border-transparent dark:border-[#333336]
      transition-all duration-150 ease-out
      active:scale-[0.95]
      focus:outline-none focus:ring-2 focus:ring-[#0071e3]
      cursor-pointer flex items-center justify-center gap-2"
    >
      Sign Out
    </button>
  );
};

export default LogoutButton;