import { useNavigate, useLocation } from "react-router";
import { useState, useEffect } from "react";
import axios from "../utils/axiosCustomize"; // Import axios
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { setPageTitle, PAGE_TITLES } from "../utils/pageTitle";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setPageTitle(PAGE_TITLES.REGISTER);
  }, []);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const response = await axios.post("/users/register", {
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirmPassword,
      });

      console.log("Form data:", formData);
      // Check if the response contains an error message
      const responseBody = response.data;
      if (responseBody.code !== "M000") {
        alert(`Registration failed: ${responseBody.message}`);
        return;
      }

      // If no error, proceed with success handling
      navigate("/verify-email", {
        state: {
          email: responseBody.data.email,
          password: formData.password,
          from: location.state?.from, // Preserve the redirect URL if it exists
        },
      });
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 200 range
        alert(`Registration failed: ${error.response.data.message}`);
      } else {
        // Network error or other issues
        console.error("Error during registration:", error);
        alert("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 pt-10">
      <div className="w-full max-w-md rounded-3xl bg-white/90 p-8 shadow-2xl backdrop-blur-md">
        <h1 className="mb-8 text-center text-3xl font-extrabold tracking-wide text-blue-700">
          Đăng ký
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
                className="w-full rounded-xl border border-gray-300 px-4 py-3 pl-11 text-gray-700 shadow-sm transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200 focus:outline-none"
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
                type="password"
                name="password"
                placeholder="Nhập mật khẩu"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 pl-11 text-gray-700 shadow-sm transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span className="absolute top-1/2 left-3 -translate-y-1/2 text-xl text-blue-400">
                <svg width="20" height="20" fill="currentColor">
                  <path d="M10 2a6 6 0 00-6 6v2a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2V8a6 6 0 00-6-6zm0 2a4 4 0 014 4v2H6V8a4 4 0 014-4zm-6 8h12v6H4v-6z" />
                </svg>
              </span>
            </div>
          </div>
          <div>
            <label className="mb-1 block font-medium text-gray-600">
              Nhập lại mật khẩu
            </label>
            <div className="relative">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Nhập lại mật khẩu"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 pl-11 text-gray-700 shadow-sm transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <span className="absolute top-1/2 left-3 -translate-y-1/2 text-xl text-blue-400">
                <svg width="20" height="20" fill="currentColor">
                  <path d="M10 2a6 6 0 00-6 6v2a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2V8a6 6 0 00-6-6zm0 2a4 4 0 014 4v2H6V8a4 4 0 014-4zm-6 8h12v6H4v-6z" />
                </svg>
              </span>
            </div>
          </div>
          <div className="flex">
            <button
              type="submit"
              className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white shadow-lg transition duration-150 hover:bg-blue-700 active:scale-95"
            >
              Đăng ký
            </button>
          </div>
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
          <span className="text-sm text-gray-500">
            Đã có tài khoản?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-semibold text-blue-600 hover:underline"
            >
              Đăng nhập
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Register;
