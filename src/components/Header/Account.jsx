import PropTypes from "prop-types";
import { memo } from "react";
import { VscAccount } from "react-icons/vsc";

// Using React.memo to prevent unnecessary re-renders
const Account = memo(({ name, avatar, toggleAccountOptional }) => {
  return (
    <div
      onClick={toggleAccountOptional}
      className="account-button group relative flex cursor-pointer items-center gap-2 rounded-[4px] p-2 hover:bg-white/10"
    >
      <span className="min-h-[24px] min-w-[24px] rounded-full">
        {avatar ? (
          <img
            src={avatar}
            alt="Avatar"
            className="h-8 w-8 rounded-full border border-gray-300"
          />
        ) : (
          <VscAccount className="h-full w-full font-medium" />
        )}
      </span>
      <span className="text-sm text-white">{name}</span>
    </div>
  );
});

Account.propTypes = {
  name: PropTypes.string.isRequired,
  avatar: PropTypes.string,
  toggleAccountOptional: PropTypes.func.isRequired,
};

Account.displayName = "Account"; // Adding display name for better debugging

export default Account;
