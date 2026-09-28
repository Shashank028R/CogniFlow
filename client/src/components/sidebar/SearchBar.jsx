import Input from "../ui/Input";

const SearchBar = ({ search, setSearch, setSearchResult, handleSearch }) => {
  return (
    <div className="mb-3 px-1 flex items-center w-full relative">
      {search ? (
        <button
          onClick={() => {
            setSearch("");
            setSearchResult([]);
          }}
          className="absolute left-3.5 text-blue-500 hover:text-blue-700 font-bold transition-colors z-10 text-sm"
        >
          ←
        </button>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3.5 w-4 h-4 text-slate-400 z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )}

      <Input
        type="text"
        placeholder="Search chats & users..."
        value={search}
        onChange={handleSearch}
        className="pl-9 py-2 rounded-xl w-full text-xs font-normal"
      />
    </div>
  );
};

export default SearchBar;
