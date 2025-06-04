import React, { useEffect } from "react";
import Header from "./Header";
import NavigationSmallDevice from "../Header/NavigationSmallDevice";
import Navigation from "../Header/Navigation";
import Language from "../Header/Language";
import { Outlet } from "react-router";
import { useStore } from "../../utils/AuthProvider";
import { registerLoadingHandlers } from "../../configuration/axiosCustomize";
import ApiLoading from "../common/ApiLoading";

const AuthenticationLayout = () => {
  const { startApiCall, finishApiCall } = useStore();

  // Register the loading handlers with axios
  useEffect(() => {
    registerLoadingHandlers(startApiCall, finishApiCall);
  }, [startApiCall, finishApiCall]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Global API Loading Indicator */}
      <ApiLoading />

      <Header>
        {/* navigate detail section */}
        <NavigationSmallDevice />
        {/* navigate device of width >= 1024 */}
        <Navigation>
          <Language />
        </Navigation>
      </Header>
      <Outlet />
    </div>
  );
};

export default AuthenticationLayout;
