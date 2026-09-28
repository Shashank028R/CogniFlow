import Input from "../ui/Input";

const SearchBar = ({ search, setSearch, setSearchResult, handleSearch }) => {
  return (
    <div className="mb-4 px-1 flex items-center w-full relative">
      {search ? (
        <button
          onClick={() => {
            setSearch("");
            setSearchResult([]);
          }}
          className="absolute left-4 text-[#0066cc] dark:text-[#2997ff] font-medium text-sm hover:opacity-80 transition-all z-10 cursor-pointer"
        >
          ←
        </button>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-4 w-4 h-4 text-[#86868b] z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )}

      <Input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={handleSearch}
        className="pl-10 pr-4 py-2 w-full text-[14px]"
      />
    </div>
  );
};

export default SearchBar;
