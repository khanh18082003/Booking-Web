import AppLayout from "./components/layout/AppLayout";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./page/Home";
import Login from "./page/Login";
import Register from "./page/Register";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Properties from "./page/Properties";
import AuthenticationLayout from "./components/layout/AuthenticationLayout";
import VerifyEmail from "./page/VerifyEmail";
import NotFound from "./page/NotFound";
import Profile from "./page/Profile";
import Personal from "./page/Personal";

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
          <Route path="myaccount" element={<Profile />} />
          <Route path="myaccount/personal" element={<Personal />} />
          <Route path="searchresults" element={<Properties />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route element={<AuthenticationLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="verify-email" element={<VerifyEmail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
