import React from "react";
import { Search, ArrowLeft } from "lucide-react";

const SearchBar = ({ search, setSearch, setSearchResult, handleSearch }) => {
  return (
    <div className="mb-3 flex items-center w-full relative">
      {search ? (
        <button
          onClick={() => {
            setSearch("");
            setSearchResult([]);
          }}
          className="absolute left-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors z-10 cursor-pointer"
          title="Clear search"
        >
          <ArrowLeft size={16} />
        </button>
      ) : (
        <Search size={16} className="absolute left-3 text-slate-400 pointer-events-none z-10" />
      )}

      <input
        type="text"
        placeholder="Search users or rooms..."
        value={search}
        onChange={handleSearch}
        className="w-full pl-9 pr-4 py-2 rounded-lg text-sm
        bg-slate-100 dark:bg-slate-800
        text-slate-900 dark:text-slate-100
        border border-transparent focus:border-blue-500
        focus:bg-white dark:focus:bg-slate-900
        focus:outline-none focus:ring-2 focus:ring-blue-500/20
        placeholder:text-slate-400 dark:placeholder:text-slate-500
        transition-all duration-150"
      />
    </div>
  );
};

export default SearchBar;
