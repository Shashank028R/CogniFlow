import Avatar from "../ui/Avatar";

const SearchResults = ({ loadingSearch, searchResult, accessChat }) => {
  if (loadingSearch) {
    return (
      <p className="text-center text-sm text-[#86868b] mt-4">
        Searching users...
      </p>
    );
  }

  if (searchResult.length === 0) {
    return (
      <p className="text-center text-sm text-[#86868b] mt-4">No users found.</p>
    );
  }

  return searchResult.map((user) => (
    <div
      key={user._id}
      onClick={() => accessChat(user._id)}
      className="flex items-center gap-3 p-3 rounded-[14px] cursor-pointer bg-white dark:bg-[#272729]
      border border-[#e0e0e0] dark:border-[#333336]
      transition-all duration-150 hover:border-[#0066cc] dark:hover:border-[#2997ff] active:scale-[0.98] w-full"
    >
      <Avatar
        src={user.profilePic}
        text={user.username.charAt(0).toUpperCase()}
      />

      <div className="flex flex-col overflow-hidden">
        <p className="font-semibold text-sm text-[#1d1d1f] dark:text-[#f5f5f7] truncate">
          {user.username}
        </p>
        <p className="text-xs text-[#86868b] truncate">{user.bio}</p>
      </div>
    </div>
  ));
};

export default SearchResults;
