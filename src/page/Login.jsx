import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useLocation, useNavigate } from "react-router";
import axios from "../utils/axiosCustomize";
import { useState, useEffect } from "react";
import { BsEyeSlashFill } from "react-icons/bs";
import { IoEyeSharp } from "react-icons/io5";
import { useStore } from "../utils/AuthProvider";
import { setPageTitle, PAGE_TITLES } from "../utils/pageTitle";

const Login = () => {
  const navigate = useNavigate();
  const { store, startApiCall, finishApiCall } = useStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(""); // State to track error message
  const [hasError, setHasError] = useState(false); // State to track input error styling
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const location = useLocation();

  // Debug: log location state
  useEffect(() => {
    console.log("Login page received location state:", location.state);
    console.log(
      "Local storage returnToPath:",
      localStorage.getItem("returnToPath"),
    );
  }, [location]);

  useEffect(() => {
    setPageTitle(PAGE_TITLES.LOGIN);
  }, []);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(""); // Clear error message when user starts typing
    setHasError(false); // Reset input styling
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      startApiCall(); // Start loading state

      const response = await axios.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      const responseBody = response.data;

      if (responseBody.code !== "M000") {
        setError(responseBody.message); // Set error message
        setHasError(true); // Apply red border styling
        return;
      }

      const accessToken = responseBody.data.access_token;
      localStorage.setItem("accessToken", accessToken);

      // Determine where to navigate after successful login
      // First try to get from location.state, then from localStorage as fallback
      const returnPath =
        location.state?.from || localStorage.getItem("returnToPath") || "/";

      // Clear the localStorage returnToPath since we're using it now
      localStorage.removeItem("returnToPath");

      // Navigate to the return path
      navigate(returnPath, { replace: true });
    } catch (error) {
      if (
        error.response?.status === 401 &&
        error.response?.data.code === "M0404"
      ) {
        // For email verification, pass along the return path
        const returnPath =
          location.state?.from || localStorage.getItem("returnToPath");
        navigate("/verify-email", {
          state: {
            email: formData.email,
            password: formData.password,
            from: returnPath,
          },
        });
        return;
      } else if (
        error.response?.status === 401 &&
        error.response?.data?.code === "M0401"
      ) {
        setError("Email or password is incorrect."); // Set error message
        setHasError(true); // Apply red border styling
      } else {
        console.error("Error during login:", error);
        setError("An error occurred. Please try again later.");
      }
    } finally {
      finishApiCall();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <div className="w-full max-w-md rounded-3xl bg-white/90 p-8 shadow-2xl backdrop-blur-md">
        <h1 className="mb-8 text-center text-3xl font-extrabold tracking-wide text-blue-700">
          Đăng nhập
        </h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block font-medium text-gray-600">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="Nhập email của bạn"
                className={`w-full rounded-xl border px-4 py-3 pl-11 text-gray-700 shadow-sm transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200 focus:outline-none ${
                  hasError ? "border-red-500" : "border-gray-300"
                }`}
                value={formData.email}
                onChange={handleChange}
                required
              />
              <span className="absolute top-1/2 left-3 -translate-y-1/2 text-xl text-blue-400">
                <svg width="20" height="20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V16a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </span>
            </div>
          </div>
          <div>
            <label className="mb-1 block font-medium text-gray-600">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type={isPasswordVisible ? "text" : "password"}
                name="password"
                placeholder="Nhập mật khẩu"
                className={`w-full rounded-xl border px-4 py-3 pl-11 text-gray-700 shadow-sm transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200 focus:outline-none ${
                  hasError ? "border-red-500" : "border-gray-300"
                }`}
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span className="absolute top-1/2 left-3 -translate-y-1/2 text-xl text-blue-400">
                <svg width="20" height="20" fill="currentColor">
                  <path d="M10 2a6 6 0 00-6 6v2a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2V8a6 6 0 00-6-6zm0 2a4 4 0 014 4v2H6V8a4 4 0 014-4zm-6 8h12v6H4v-6z" />
                </svg>
              </span>
              {formData.password && (
                <span className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-xl text-gray-400">
                  {isPasswordVisible ? (
                    <IoEyeSharp onClick={togglePasswordVisibility} />
                  ) : (
                    <BsEyeSlashFill onClick={togglePasswordVisibility} />
                  )}
                </span>
              )}
            </div>
          </div>
          {error && (
            <p className="mt-1 text-center text-sm text-red-500">{error}</p>
          )}
          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white shadow-lg transition hover:bg-blue-700 active:scale-95"
            disabled={store.apiLoading}
          >
            {store.apiLoading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>
        <div className="my-4 flex items-center justify-between">
          <hr className="flex-1 border-gray-300" />
          <span className="mx-2 text-sm text-gray-400">Hoặc</span>
          <hr className="flex-1 border-gray-300" />
        </div>
        <div className="flex items-center justify-center gap-4">
          <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2 shadow-sm transition hover:border-blue-500">
            <FcGoogle className="text-2xl" />
            <span className="font-medium text-gray-700">Google</span>
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2 shadow-sm transition hover:border-blue-500">
            <FaFacebook className="text-2xl text-[#1877F2]" />
            <span className="font-medium text-gray-700">Facebook</span>
          </button>
        </div>
        <div className="mt-6 flex flex-col items-center gap-2">
          <Link
            to="/forgot-password"
            className="text-sm text-blue-500 hover:underline"
          >
            Quên mật khẩu?
          </Link>
          <span className="text-sm text-gray-500">
            Chưa có tài khoản?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="font-semibold text-blue-600 hover:underline"
              disabled={store.apiLoading}
            >
              Đăng ký
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
