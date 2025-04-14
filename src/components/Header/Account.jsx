import PropTypes from "prop-types";
import defaultAvatar from "../../assets/default-avatar.avif";

const Account = ({ name, avatar, toggleAccountOptional }) => {
  return (
    <div
      className="account-button flex min-h-[48px] min-w-[48px] cursor-pointer items-center justify-center rounded-[4px] px-3 py-2 duration-200 hover:bg-white/10"
      onClick={toggleAccountOptional} // Handle click event
    >
      {/* Avatar */}
      <img
        src={avatar || defaultAvatar} // Use default avatar if none is provided
        alt="User Avatar"
        className="h-8 w-8 rounded-full border border-gray-300"
      />
      {/* Name (only show on larger screens) */}
      <div className="ml-2 hidden text-white lg:block">
        <p className="text-sm font-medium">
          {name} {/* Default to "Your account" if name is not set */}
        </p>
      </div>
    </div>
  );
};

Account.propTypes = {
  name: PropTypes.string,
  avatar: PropTypes.string,
  toggleAccountOptional: PropTypes.func.isRequired, // Add prop type for toggle function
};

export default Account;
