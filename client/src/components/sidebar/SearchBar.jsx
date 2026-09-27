import Input from "../ui/Input";

const SearchBar = ({ search, setSearch, setSearchResult, handleSearch }) => {
  return (
    <div className="mb-6 px-2 flex items-center w-full relative">
      {search ? (
        <button
          onClick={() => {
            setSearch("");
            setSearchResult([]);
          }}
          className="absolute left-5 text-blue-500 hover:text-blue-700 font-bold hover:scale-110 transition-all z-10"
        >
          ←
        </button>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-5 w-4 h-4 text-gray-400 z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )}

      <Input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={handleSearch}
        className="pl-10 py-3.5 rounded-2xl w-full text-sm font-medium shadow-[inset_5px_5px_10px_var(--shadow-dark),inset_-5px_-5px_10px_var(--shadow-light)] focus:shadow-[inset_3px_3px_6px_var(--shadow-dark),inset_-3px_-3px_6px_var(--shadow-light)]"
      />
    </div>
  );
};

export default SearchBar;
