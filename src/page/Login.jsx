import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router";
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

  // Modified handleSubmit with a 10-second delay and explicit loading state management
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Then make the actual API call
      startApiCall(); // Start loading state
      console.log("Loading started.");
      // Simulate a delay of 10 seconds
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await axios.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

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
        setError(responseBody.message); // Set error message
        setHasError(true); // Apply red border styling
        return;
      }

      const accessToken = responseBody.data.access_token;
      localStorage.setItem("accessToken", accessToken);

      navigate("/");
    } catch (error) {
      if (
        error.response?.status === 401 ||
        error.response?.data?.code === "M0401"
      ) {
        setError("Email or password is incorrect."); // Set error message
        setHasError(true); // Apply red border styling
      } else {
        console.error("Error during login:", error);
        setError("An error occurred. Please try again later.");
      }
    } finally {
      // Explicitly finish the loading state if it hasn't been finished by the axios interceptors
      finishApiCall();
      console.log("Loading finished.");
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
              className={`w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                hasError ? "border-red-500" : ""
              }`}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="relative">
            <label className="mb-1 block text-gray-600">Password</label>
            <input
              type={isPasswordVisible ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              className={`w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                hasError ? "border-red-500" : ""
              }`}
              value={formData.password}
              onChange={handleChange}
              required
            />
            {formData.password && ( // Conditionally render the toggle only if password is not empty
              <span className="absolute top-10 right-3 cursor-pointer">
                {isPasswordVisible ? (
                  <IoEyeSharp
                    className="text-gray-500"
                    onClick={togglePasswordVisibility}
                  />
                ) : (
                  <BsEyeSlashFill
                    className="text-gray-500"
                    onClick={togglePasswordVisibility}
                  />
                )}
              </span>
            )}
          </div>
          {error && (
            <p className="mt-1 text-sm text-red-500">{error}</p> // Display error message
          )}
          <div className="flex justify-between">
            <button
              type="submit"
              className="mr-2 w-1/2 cursor-pointer rounded-lg bg-blue-500 py-2 text-white transition duration-300 hover:bg-blue-600"
              disabled={store.apiLoading} // Use apiLoading state
            >
              {store.apiLoading ? "Processing..." : "Login"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="w-1/2 cursor-pointer rounded-lg bg-gray-300 py-2 text-gray-700 transition duration-300 hover:bg-gray-400"
              disabled={store.apiLoading} // Use apiLoading state
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
