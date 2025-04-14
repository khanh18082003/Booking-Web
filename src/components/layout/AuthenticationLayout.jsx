import React from "react";
import Header from "./Header";
import NavigationSmallDevice from "../Header/NavigationSmallDevice";
import Navigation from "../Header/Navigation";
import Language from "../Header/Language";
import { Outlet } from "react-router";

const AuthenticationLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
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
