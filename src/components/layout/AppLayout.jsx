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
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../utils/AuthProvider";

const AppLayout = () => {
  const { authState, setAuthState } = useContext(AuthContext); // Access authState from AuthContext
  const isAuthenticated = !!authState.accessToken; // Check if accessToken exists
  const [isAccountOptionalVisible, setAccountOptionalVisible] = useState(false);
  const api = authState.api;
  useEffect(() => {
    if (!authState.api || !authState.accessToken) return;

    const fetchUserProfile = async () => {
      try {
        // Fetch user profile using the API
        const res = await api.get("/users/my-profile", {
          headers: {
            Authorization: `Bearer ${authState.accessToken}`,
          },
        });
        const user = res.data.data; // tùy theo response
        setAuthState((prev) => ({
          ...prev,
          userProfile: user,
        }));
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };

    fetchUserProfile();
  }, [authState.api, authState.accessToken]);

  const toggleAccountOptional = () => {
    setAccountOptionalVisible((prev) => !prev);
  };

  const closeAccountOptional = () => {
    setAccountOptionalVisible(false);
  };

  return (
    <div className="relative bg-white">
      <Header>
        {/* navigate detail section */}
        <NavigationSmallDevice
          isAuthenticated={isAuthenticated}
          toggleAccountOptional={toggleAccountOptional}
          avatar={authState.userProfile?.avatar}
          name={authState.userProfile?.name || "Your account"}
        />
        {/* navigate device of width >= 1024 */}
        <Navigation>
          <Currency />
          <Language />
          <PostProperty />
          {isAuthenticated ? (
            <Account
              name={authState.userProfile?.name || "Your account"}
              avatar={authState.userProfile?.avatar}
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
            avatar={authState.userProfile?.avatar}
            name={authState.userProfile?.name || "Your account"}
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
