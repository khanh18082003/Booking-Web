import PropTypes from "prop-types";
import { Link } from "react-router";
import { IoMdClose } from "react-icons/io";
import { MdPerson2 } from "react-icons/md";
import { FaRegCommentDots, FaRegHeart } from "react-icons/fa";
import { BiLogOutCircle } from "react-icons/bi";
import { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import defaultAvatar from "../../assets/default-avatar.avif"; // Import a default avatar image
import AuthContext from "../../utils/AuthProvider";

const AccountOptional = ({ isVisible, closeAccountOptional, avatar, name }) => {
  const containerRef = useRef(null);
  const { authState, setAuthState } = useContext(AuthContext); // Access setAuthState
  const api = authState.api;
  const navigate = useNavigate(); // Initialize useNavigate

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
      className="fixed inset-0 z-[9999] overflow-hidden bg-white text-black lg:absolute lg:inset-auto lg:top-16 lg:right-30 lg:w-64 lg:rounded-lg lg:shadow-lg"
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
          to="/account"
          className="flex items-center gap-4 px-6 py-4 hover:bg-gray-100"
        >
          <MdPerson2 className="text-xl" />
          <span className="text-base">Tài khoản</span>
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
                const response = await api.post(
                  "/auth/logout",
                  {
                    access_token: authState.accessToken,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${authState.accessToken}`,
                    },
                  },
                );
                const data = response.data;
                if (data.code !== "M000") {
                  console.error("Logout failed:", data.message);
                  return;
                }
                console.log("Logout successful:", data.message);

                // Clear user data from local storage and context
                localStorage.removeItem("accessToken");
                setAuthState({
                  accessToken: null,
                  api: authState.api,
                  userProfile: null,
                });

                // Redirect to Home page
                navigate("/");
              } catch (error) {
                console.error(
                  "Logout failed:",
                  error.response?.data?.message || error.message,
                );
              }
            };
            logout();
          }}
          className="flex items-center gap-4 px-6 py-4 hover:bg-gray-100"
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
};

export default AccountOptional;
