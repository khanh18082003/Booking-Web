import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { setPageTitle, PAGE_TITLES } from "../utils/pageTitle";

const Register = () => {
  const navigate = useNavigate();

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
    <div className="flex min-h-screen items-center justify-center pt-20">
      <div className="w-96 rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-700">
          Register
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
          <div>
            <label className="mb-1 block text-gray-600">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Enter your password again"
              className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="mr-2 w-1/2 cursor-pointer rounded-lg bg-blue-500 py-2 text-white transition duration-300 hover:bg-blue-600"
            >
              Login
            </button>
            <button
              type="submit"
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
      </div>
    </div>
  );
};

export default Register;
