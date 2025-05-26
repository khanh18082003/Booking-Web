import PropTypes from "prop-types";
import { Link } from "react-router";
import { IoMdClose } from "react-icons/io";
import { MdPerson2 } from "react-icons/md";
import { FaRegCommentDots, FaRegHeart } from "react-icons/fa";
import { BiLogOutCircle } from "react-icons/bi";
import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import defaultAvatar from "../../assets/default-avatar.avif"; // Import a default avatar image
import axios from "../../utils/axiosCustomize";
import { useStore } from "../../utils/AuthProvider";
import { RiLuggageDepositLine } from "react-icons/ri";

const AccountOptional = ({ isVisible, closeAccountOptional, avatar, name }) => {
  const containerRef = useRef(null);
  const { store, setStore } = useStore(); // Assuming you have a context or state management for auth
  const navigate = useNavigate();
  const location = useLocation(); // Get current location

  // Check if the current path requires authentication
  const isProtectedRoute = (path) => {
    const protectedPaths = [
      "/myaccount",
      "/mytrips",

      "/favorites",

      "/myaccount/personal",
    ];

    // Check if the current path starts with any of the protected paths
    return protectedPaths.some((protectedPath) =>
      path.startsWith(protectedPath),
    );
  };

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target) &&
        !event.target.closest(".account-button") // Prevent closing when clicking the Account button
      ) {
        closeAccountOptional();
      }
    };

    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible, closeAccountOptional]);

  if (!isVisible) return null; // Don't render if not visible

  return (
    <div
      ref={containerRef}
      className="account-optional fixed inset-0 z-[9999] overflow-hidden bg-white text-black lg:absolute lg:inset-auto lg:top-16 lg:right-30 lg:w-64 lg:rounded-lg lg:shadow-lg"
    >
      {/* Close button (only visible on small screens) */}
      <button
        className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-200 lg:hidden"
        onClick={closeAccountOptional}
      >
        <IoMdClose className="text-2xl" />
      </button>

      {/* Avatar and user info (only visible on small screens) */}
      <div className="flex items-center gap-4 border-b border-gray-200 p-6 lg:hidden">
        <img
          src={avatar || defaultAvatar}
          alt="User Avatar"
          className="h-12 w-12 rounded-full border border-gray-300"
        />
        <div>
          <p className="text-lg font-medium">{name}</p>
        </div>
      </div>

      {/* Menu options */}
      <div className="mt-4 flex flex-col lg:mt-0">
        <Link
          to="/myaccount"
          className="flex items-center gap-4 px-6 py-4 hover:bg-gray-100"
        >
          <MdPerson2 className="text-xl" />
          <span className="text-base">Tài khoản</span>
        </Link>
        <Link
          to="/mytrips"
          className="flex items-center gap-4 px-6 py-4 hover:bg-gray-100"
        >
          <RiLuggageDepositLine className="text-xl" />
          <span className="text-base">Đặt chỗ & chuyến đi</span>
        </Link>
        <Link
          to="/reviews"
          className="flex items-center gap-4 px-6 py-4 hover:bg-gray-100"
        >
          <FaRegCommentDots className="text-xl" />
          <span className="text-base">Đánh giá</span>
        </Link>
        <Link
          to="/favorites"
          className="flex items-center gap-4 px-6 py-4 hover:bg-gray-100"
        >
          <FaRegHeart className="text-xl" />
          <span className="text-base">Yêu thích</span>
        </Link>
        <button
          type="button"
          onClick={() => {
            // Call API /auth/logout
            const logout = async () => {
              try {
                await axios.post("/auth/logout", {
                  access_token: localStorage.getItem("accessToken"),
                });

                // Clear user data from local storage and context
                localStorage.removeItem("accessToken");
                setStore((prev) => ({
                  ...prev,
                  userProfile: null,
                }));

                // Check if current page requires authentication
                const currentPath = location.pathname;
                console.log("Current path:", currentPath);
                if (isProtectedRoute(currentPath)) {
                  // Only navigate to home if we're on a protected route
                  navigate("/");
                }
                // If we're on a public page, do nothing (stay on the same page)

                // Close the dropdown in any case
                closeAccountOptional();
              } catch (error) {
                console.error(
                  "Logout failed:",
                  error.response?.data?.message || error.message,
                );
              }
            };
            logout();
          }}
          className="flex cursor-pointer items-center gap-4 px-6 py-4 hover:bg-gray-100"
        >
          <BiLogOutCircle className="text-xl" />
          <span className="text-base">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

AccountOptional.propTypes = {
  isVisible: PropTypes.bool.isRequired, // Controls visibility
  closeAccountOptional: PropTypes.func.isRequired, // Function to close the component
  avatar: PropTypes.string, // Optional avatar URL
  name: PropTypes.string, // Optional user name
};

export default AccountOptional;
