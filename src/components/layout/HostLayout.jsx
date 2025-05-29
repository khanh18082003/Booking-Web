import { useEffect, useState, useRef } from "react";
import { useStore } from "../../utils/AuthProvider";
import { registerLoadingHandlers } from "../../utils/axiosCustomize";
import ApiLoading from "../common/ApiLoading";
import Header from "./Header";
import { Outlet, useNavigate } from "react-router";
import Language from "../Header/Language";
import Navigation from "../Header/Navigation";
import Account from "../Header/Account";
import hostAxios from "../../utils/hostAxiosCustomize";
import Login from "../Header/Login";

const HostLayout = () => {
  const { store, setStore, startApiCall, finishApiCall } = useStore();
  const [showAccountBox, setShowAccountBox] = useState(false);
  const accountRef = useRef(null);
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("hostAccessToken") !== null;

  // Đóng box khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setShowAccountBox(false);
      }
    }
    if (showAccountBox) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAccountBox]);

  // Register the loading handlers with axios
  useEffect(() => {
    registerLoadingHandlers(startApiCall, finishApiCall);
  }, [startApiCall, finishApiCall]);

  useEffect(() => {
    if (!isAuthenticated || store.hostProfile) return;

    const fetchUserProfile = async () => {
      try {
        // Fetch user profile using the API
        const res = await hostAxios.get("/users/my-profile");
        const user = res.data.data; // tùy theo response
        setStore((prev) => ({
          ...prev,
          hostProfile: user,
        }));
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };

    fetchUserProfile();
  }, [isAuthenticated]);

  const handleAccountClick = () => {
    setShowAccountBox((prev) => !prev);
  };

  const handleLogout = () => {
    const logout = async () => {
      try {
        await hostAxios.post("/auth/host/logout", {
          access_token: localStorage.getItem("hostAccessToken"),
        });

        // Clear user data from local storage and context
        localStorage.removeItem("hostAccessToken");
        setStore((prev) => ({
          ...prev,
          hostProfile: null,
        }));

        navigate("/host/login");
      } catch (error) {
        console.error(
          "Logout failed:",
          error.response?.data?.message || error.message,
        );
      }
    };
    logout();
    setShowAccountBox(false);
  };

  return (
    <div>
      <div className="min-h-screen bg-gray-100">
        {/* Global API Loading Indicator */}
        <ApiLoading />

        <Header>
          {/* navigate device of width >= 1024 */}
          <Navigation>
            <Language />
            {isAuthenticated && (
              <div ref={accountRef} className="relative">
                <Account
                  name={store.hostProfile?.name || "Your account"}
                  avatar={store.hostProfile?.avatar}
                  toggleAccountOptional={handleAccountClick}
                />
                {showAccountBox && (
                  <div className="absolute right-0 z-50 mt-2 w-40 rounded bg-white shadow-lg">
                    <button
                      className="block w-full px-4 py-2 text-left text-black hover:bg-gray-100"
                      onClick={handleLogout}
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            )}
          </Navigation>
        </Header>
        <Outlet />
      </div>
    </div>
  );
};

export default HostLayout;
