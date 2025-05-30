import { useEffect } from "react";
import { Link } from "react-router-dom";
import { setPageTitle, PAGE_TITLES } from "../utils/pageTitle";
import { useStore } from "../utils/AuthProvider";

const NotFound = () => {
  const { store } = useStore();
  useEffect(() => {
    setPageTitle(PAGE_TITLES.NOT_FOUND);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 text-center">
      <h1 className="text-9xl font-bold text-blue-500">404</h1>
      <h2 className="mt-4 text-3xl font-semibold text-gray-700">
        Oops! Page Not Found
      </h2>
      <p className="mt-2 text-gray-500">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to={store.hostProfile != null ? "/host/dashboard" : "/"}
        className="mt-6 inline-block rounded-lg bg-blue-500 px-6 py-3 text-white transition duration-300 hover:bg-blue-600"
      >
        Go Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
