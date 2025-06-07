import { useEffect } from "react";
import Banner from "../components/layout/Banner";
import BodyLayout from "../components/layout/BodyLayout";
import { setPageTitle, PAGE_TITLES } from "../utils/pageTitle";

const Home = () => {
  useEffect(() => {
    setPageTitle(PAGE_TITLES.HOME);
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Banner />
      <BodyLayout />
    </>
  );
};

export default Home;
