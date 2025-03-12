import React from "react";
import { useNavigate } from "react-router";
import logo from "../assets/logo.svg"; // Đảm bảo đường dẫn đến logo đúng
import { Link, Links } from "react-router";

const Login = () => {
  const navigate = useNavigate(); // Hook để điều hướng trang

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 relative">
      {/* Phần logo và tiêu đề "Booking" nằm ngoài form */}
      {/* Thanh header với logo Booking.com */}
      <div className="fixed top-0 left-0 w-full bg-[#003580] text-white py-2 z-10">
        <Link
            to="/"
            aria-label="Booking.com"
            className="box-border inline-flex w-40 text-start ml-10"
            >
          <img src={logo} alt="Booking" className="w-30 mb-2" />
        </Link>
      </div>
      {/* Form login */}
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 text-center mt-20">
        <form className="space-y-4">
          <h1 className="text-2xl font-bold text-gray-700 mb-6">Login</h1>
          <div>
            <label className="block text-gray-600 mb-1 text-left">Email</label>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1 text-left">Password</label>
            <input 
              type="password" 
              placeholder="Enter your password" 
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-between">
            <button 
              type="submit" 
              className="w-1/2 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300 mr-2"
            >
              Login
            </button>
            <button 
              type="button" 
              onClick={() => navigate("/register")} 
              className="w-1/2 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition duration-300"
            >
              Register
            </button>
          </div>
          <div className="text-center mt-2">
            <button className="text-blue-500 hover:underline focus:outline-none">
              Forgot password?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;