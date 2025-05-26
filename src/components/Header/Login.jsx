import { Link, useLocation } from "react-router";

const Login = () => {
  const location = useLocation();
  const currentPath = location.pathname + location.search;

  const handleLoginClick = () => {
    // Save the current path to localStorage as a fallback
    localStorage.setItem("returnToPath", currentPath);
  };

  return (
    <>
      <span className="min-h-[36px] rounded-[4px] bg-white hover:bg-[#f0f6fd]">
        <Link
          to="/register"
          state={{ from: currentPath }}
          className="flex h-full w-full items-center justify-center px-3 py-1 leading-7"
          onClick={handleLoginClick}
        >
          <span className="text-[14px] font-light text-third">Đăng ký</span>
        </Link>
      </span>
      <span className="min-h-[36px] rounded-[4px] bg-white leading-7 hover:bg-[#f0f6fd]">
        <Link
          to="/login"
          state={{ from: currentPath }}
          className="flex h-full w-full items-center justify-center px-3 py-1"
          onClick={handleLoginClick}
        >
          <span className="text-[14px] font-light text-third">Đăng nhập</span>
        </Link>
      </span>
    </>
  );
};

export default Login;
