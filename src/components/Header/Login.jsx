import { Link } from "react-router";

const Login = () => {
  return (
    <>
      <span className="min-h-[36px] rounded-[4px] bg-white hover:bg-[#f0f6fd]">
        <Link
          to="/register" //điều hướng đến trang register
          className="flex h-full w-full items-center justify-center px-3 py-1 leading-7"
        >
          <span className="text-[14px] font-light text-third">Đăng ký</span>
        </Link>
      </span>
      <span className="min-h-[36px] rounded-[4px] bg-white leading-7 hover:bg-[#f0f6fd]">
        <Link
          to="/login"
          className="flex h-full w-full items-center justify-center px-3 py-1"
        >
          <span className="text-[14px] font-light text-third">Đăng nhập</span>
        </Link>
      </span>
    </>
  );
};

export default Login;
