import Avatar from "../ui/Avatar";

const SearchResults = ({ loadingSearch, searchResult, accessChat }) => {
  if (loadingSearch) {
    return (
      <p className="text-center text-xs text-slate-500 mt-4 animate-pulse">
        Searching users...
      </p>
    );
  }

  if (searchResult.length === 0) {
    return (
      <p className="text-center text-xs text-slate-500 mt-4">No users found.</p>
    );
  }

  return searchResult.map((user) => (
    <div
      key={user._id}
      onClick={() => accessChat(user._id)}
      className="flex items-center gap-2.5 p-2 rounded-xl cursor-pointer
      transition-colors duration-150 ease-out hover:bg-slate-100/70 dark:hover:bg-slate-800/50
      w-full border border-transparent hover:border-slate-200/60 dark:hover:border-slate-700/50"
    >
      <Avatar
        size="w-9 h-9"
        src={user.profilePic}
        text={user.username.charAt(0).toUpperCase()}
      />

      <div className="flex flex-col overflow-hidden">
        <p className="font-medium text-sm text-[var(--text)] truncate">
          {user.username}
        </p>
        <p className="text-xs text-slate-500 truncate">{user.bio || "Available"}</p>
      </div>
    </div>
  ));
};

export default SearchResults;
