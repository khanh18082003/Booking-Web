import { useEffect, useState, useRef } from "react";
import { useStore } from "../../utils/AuthProvider";
import { registerLoadingHandlers } from "../../utils/axiosCustomize";
import ApiLoading from "../common/ApiLoading";
import Header from "./Header";
import { Outlet } from "react-router";
import Language from "../Header/Language";
import Navigation from "../Header/Navigation";
import Account from "../Header/Account";

const HostLayout = () => {
  const { store, startApiCall, finishApiCall } = useStore();
  const [showAccountBox, setShowAccountBox] = useState(false);
  const accountRef = useRef(null);

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

  const handleAccountClick = () => {
    setShowAccountBox((prev) => !prev);
  };

  const handleLogout = () => {
    // TODO: Thêm logic đăng xuất ở đây
    alert("Đăng xuất!");
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
            <div ref={accountRef} className="relative">
              <Account
                name={store.userProfile?.name || "Your account"}
                avatar={store.userProfile?.avatar}
                toggleAccountOptional={handleAccountClick}
              />
              {showAccountBox && (
                <div className="absolute right-0 z-50 mt-2 w-40 rounded bg-white shadow-lg">
                  <button
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </Navigation>
        </Header>
        <Outlet />
      </div>
    </div>
  );
};

export default HostLayout;
