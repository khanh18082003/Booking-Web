import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router";
import Currency from "../Header/Currency";
import Language from "../Header/Language";
import PostProperty from "../Header/PostProperty";
import Login from "../Header/Login";
import NavigationSmallDevice from "../Header/NavigationSmallDevice";
import Navigation from "../Header/Navigation";
import Account from "../Header/Account";
import AccountOptional from "../Header/AccountOptional";
import { useEffect, useState } from "react";
import { useStore } from "../../utils/AuthProvider";
import axios, { registerLoadingHandlers } from "../../utils/axiosCustomize";
import ApiLoading from "../common/ApiLoading";

const AppLayout = () => {
  const { store, setStore, startApiCall, finishApiCall } = useStore();
  const [isAccountOptionalVisible, setAccountOptionalVisible] = useState(false);
  const isAuthenticated = localStorage.getItem("accessToken") !== null;

  // Register the loading handlers with axios
  useEffect(() => {
    registerLoadingHandlers(startApiCall, finishApiCall);
  }, [startApiCall, finishApiCall]);

  // Add click outside handler for account dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Don't close if clicking on the account button itself (that's handled by the toggle function)
      if (
        isAccountOptionalVisible &&
        !event.target.closest(".account-button") &&
        !event.target.closest(".account-optional")
      ) {
        setAccountOptionalVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAccountOptionalVisible]);

  useEffect(() => {
    if (!isAuthenticated || store.userProfile) return;

    const fetchUserProfile = async () => {
      try {
        // Fetch user profile using the API
        const res = await axios.get("/users/my-profile");
        const user = res.data.data; // tùy theo response
        setStore((prev) => ({
          ...prev,
          userProfile: user,
        }));
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };

    fetchUserProfile();
  }, [isAuthenticated]);

  const toggleAccountOptional = (e) => {
    // Prevent event bubbling to avoid the document click handler from immediately closing the dropdown
    if (e) e.stopPropagation();
    setAccountOptionalVisible((prev) => !prev);
  };

  const closeAccountOptional = () => {
    setAccountOptionalVisible(false);
  };

  return (
    <div className="relative bg-white">
      {/* Global API Loading Indicator */}
      <ApiLoading />

      <Header>
        {/* navigate detail section */}
        <NavigationSmallDevice
          isAuthenticated={isAuthenticated}
          toggleAccountOptional={toggleAccountOptional}
          avatar={store.userProfile?.avatar}
          name={store.userProfile?.name || "Your account"}
        />
        {/* navigate device of width >= 1024 */}
        <Navigation>
          <Currency />
          <Language />
          <PostProperty />
          {isAuthenticated ? (
            <Account
              name={store.userProfile?.name || "Your account"}
              avatar={store.userProfile?.avatar}
              toggleAccountOptional={toggleAccountOptional}
            />
          ) : (
            <Login />
          )}
        </Navigation>
        {/* account optional section */}
        {isAuthenticated && (
          <AccountOptional
            isVisible={isAccountOptionalVisible}
            closeAccountOptional={closeAccountOptional}
            avatar={store.userProfile?.avatar}
            name={store.userProfile?.name || "Your account"}
          />
        )}
      </Header>
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
