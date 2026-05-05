const SidebarHeader = ({ RoomModalOpen }) => {
  return (
    <div className="mb-5 flex justify-between items-center">
      <h2 className="text-lg font-semibold text-gray-900">
        Cogni
        <span className="text-blue-600 drop-shadow-[0_0_4px_rgba(37,99,235,0.4)]">
          Flow
        </span>
      </h2>

      <button
        onClick={RoomModalOpen}
        className="w-8 h-8 rounded-full flex items-center justify-center text-blue-600 font-bold
        hover:scale-105 transition-all
        shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff] cursor-pointer outline-0"
      >
        +
      </button>
    </div>
  );
};

export default SidebarHeader;
