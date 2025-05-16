import AppLayout from "./components/layout/AppLayout";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./page/Home";
import Login from "./page/Login";
import Register from "./page/Register";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Properties from "./page/Properties";
import RoomDetail from "./page/RoomDetail";
import AuthenticationLayout from "./components/layout/AuthenticationLayout";
import VerifyEmail from "./page/VerifyEmail";
import NotFound from "./page/NotFound";
import Profile from "./page/Profile";
import Personal from "./page/Personal";
import ForgotPassword from "./page/ForgotPassword";
import ResetPassword from "./page/ResetPassword";

/**
 * The main application component that initializes AOS (Animate On Scroll) library
 * and sets up the routing for the application.
 *
 * @component
 * @example
 * return (
 *   <App />
 * )
 *
 * @returns {JSX.Element} The rendered component.
 */
function App() {
  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
      disable: "mobile",
    });
    AOS.refresh();
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />

          {/* Hotel detail routes with nested tab routes */}
          <Route path="properties/:id/:propertiesName" element={<RoomDetail />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={null} />
            <Route path="info" element={null} />
            <Route path="amenities" element={null} />
            <Route path="rules" element={null} />
            <Route path="notes" element={null} />
            <Route path="reviews" element={null} />
          </Route>

          <Route path="myaccount" element={<Profile />} />
          <Route path="myaccount/personal" element={<Personal />} />
          <Route path="searchresults" element={<Properties />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route element={<AuthenticationLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="verify-email" element={<VerifyEmail />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
