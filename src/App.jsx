import AppLayout from "./components/layout/AppLayout";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./page/Home";
import Login from "./page/Login";
import Register from "./page/Register";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Properties from "./page/Properties";
import RoomDetail from "./page/RoomDetail";

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
          <Route path="/searchresults" element={<Properties />} />
          <Route path="/roomdetail" element={<RoomDetail />} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
