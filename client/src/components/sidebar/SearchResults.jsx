import React from "react";
import Avatar from "../ui/Avatar";

const SearchResults = ({ loadingSearch, searchResult, accessChat }) => {
  if (loadingSearch) {
    return (
      <div className="flex flex-col gap-2 p-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse">
            <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 bg-slate-200 dark:bg-slate-700 rounded w-24" />
              <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded w-36" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (searchResult.length === 0) {
    return (
      <p className="text-center text-xs text-slate-500 py-6">No users found.</p>
    );
  }

  return (
    <div className="flex flex-col gap-1 p-1">
      {searchResult.map((user) => (
        <div
          key={user._id}
          onClick={() => accessChat(user._id)}
          className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer
          bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800
          border border-slate-200/60 dark:border-slate-800
          transition-colors duration-150"
        >
          <Avatar
            src={user.profilePic}
            text={user.username.charAt(0).toUpperCase()}
            size="w-9 h-9"
          />

          <div className="flex flex-col overflow-hidden">
            <p className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100 truncate">
              {user.username}
            </p>
            <p className="text-xs text-slate-500 truncate">{user.bio || "Available"}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;
