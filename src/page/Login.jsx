import { useContext, useState } from "react";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router";
import AuthContext from "../utils/AuthProvider";

const Login = () => {
  const navigate = useNavigate(); // Hook để điều hướng trang
  const { authState, setAuthState } = useContext(AuthContext);
  const api = authState.api; // Lấy instance axios từ AuthContext

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      // Check if the response contains an error message
      const responseBody = response.data;

      if (responseBody.code === "M0404") {
        navigate("/verify-email", {
          state: {
            email: formData.email,
            password: formData.password,
          },
        });
        return;
      }

      if (responseBody.code !== "M000") {
        alert(`Login failed: ${responseBody.message}`);
        return;
      }

      // Store access token in localStorage
      const accessToken = responseBody.data.access_token;
      localStorage.setItem("accessToken", accessToken);

      // Update authState with the new access token
      setAuthState((prevState) => ({
        ...prevState,
        accessToken,
      }));

      // Navigate to the home page
      navigate("/");
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 200 range
        alert(`Login failed: ${error.response.data.message}`);
      } else {
        // Network error or other issues
        console.error("Error during login:", error);
        alert("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center pt-20">
      <div className="w-96 rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-700">
          Sign In
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="mr-2 w-1/2 cursor-pointer rounded-lg bg-blue-500 py-2 text-white transition duration-300 hover:bg-blue-600"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="w-1/2 cursor-pointer rounded-lg bg-gray-300 py-2 text-gray-700 transition duration-300 hover:bg-gray-400"
            >
              Register
            </button>
          </div>
        </form>
        <p className="mt-2 text-center">Or</p>
        <div className="mt-2 flex items-center justify-center gap-4">
          <button className="cursor-pointer rounded-md border-1 border-gray-300 p-[23px] duration-200 hover:border-blue-500">
            <FcGoogle className="inline-block text-3xl" />
          </button>
          <button className="cursor-pointer rounded-md border-1 border-gray-300 p-[23px] duration-200 hover:border-blue-500">
            <FaFacebook className="inline-block text-3xl text-[#1877F2]" />
          </button>
        </div>
        {/* Forgot password */}
        <div className="mt-4 text-center">
          <a href="/forgot-password" className="text-blue-500 hover:underline">
            Forgot Password?
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
