import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router";

const AppLayout = () => {
  return (
    <div className="bg-fourth">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
