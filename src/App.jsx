import UserLayout from "./components/layout/UserLayout";
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
import BookingConfirmation from "./page/BookingConfirmation";
import FinishedBooking from "./page/FinishedBooking";
import BookingSuccess from "./page/BookingSuccess";
import HostLogin from "./host/page/HostLogin";
import HostRegister from "./host/page/HostRegister";
import PropertiesType from "./host/page/PropertiesType";
import AddProperty from "./host/page/AddProperty";
import HostDashboard from "./host/page/HostDashboard";
import BookingHistory from "./page/BookingHistory";
import HostLayout from "./components/layout/HostLayout";
import Accommodation from "./host/page/Accommodation";

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
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="properties/:id/:propertiesName" element={<RoomDetail />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={null} />
            <Route path="info" element={null} />
            <Route path="amenities" element={null} />
            <Route path="rules" element={null} />
            <Route path="notes" element={null} />
            <Route path="reviews" element={null} />
          </Route>
          <Route
            path="properties/:id/:propertiesName/booking-confirmation"
            element={<BookingConfirmation />}
          />
          <Route path="mytrips" element={<BookingHistory />} />
          <Route path="booking/:id" element={<FinishedBooking />} />
          <Route path="booking/success" element={<BookingSuccess />} />
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
        <Route path="/host" element={<HostLayout />}>
          <Route path="dashboard" element={<HostDashboard />} />
          <Route path="login" element={<HostLogin />} />
          <Route path="register" element={<HostRegister />} />
          <Route path="properties-type" element={<PropertiesType />} />
          <Route path="add-property" element={<AddProperty />} />
          <Route path="/host/property/:id" element={<Accommodation />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
