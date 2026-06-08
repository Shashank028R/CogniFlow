import Avatar from "../ui/Avatar";

const SearchResults = ({ loadingSearch, searchResult, accessChat }) => {
  if (loadingSearch) {
    return (
      <p className="text-center text-sm text-gray-500 mt-4 animate-pulse">
        Searching users...
      </p>
    );
  }

  if (searchResult.length === 0) {
    return (
      <p className="text-center text-sm text-gray-500 mt-4">No users found.</p>
    );
  }

  return searchResult.map((user) => (
    <div
      key={user._id}
      onClick={() => accessChat(user._id)}
      className="flex items-center gap-3 p-3 rounded-xl cursor-pointer bg-[var(--card)]
      transition-all duration-300 hover:translate-y-[1px] active:scale-[0.97]
      shadow-[4px_4px_10px_var(--shadow-dark),-4px_-4px_10px_var(--shadow-light)] w-[calc(100%-4px)]"
    >
      <Avatar
        src={user.profilePic}
        text={user.username.charAt(0).toUpperCase()}
      />

      <div className="flex flex-col overflow-hidden">
        <p className="font-medium text-sm text-[var(--text)] truncate">
          {user.username}
        </p>
        <p className="text-xs text-gray-500 truncate">{user.bio}</p>
      </div>
    </div>
  ));
};

export default SearchResults;
