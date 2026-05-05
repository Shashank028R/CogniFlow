import Input from "../ui/Input";

const SearchBar = ({ search, setSearch, setSearchResult, handleSearch }) => {
  return (
    <div className="mb-4 flex items-center w-full relative">
      {search && (
        <button
          onClick={() => {
            setSearch("");
            setSearchResult([]);
          }}
          className="absolute left-3 text-blue-500 font-bold hover:scale-110 transition-transform z-10"
        >
          ←
        </button>
      )}

      <Input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={handleSearch}
        className={search ? "pl-8" : "pl-4"}
      />
    </div>
  );
};

export default SearchBar;
