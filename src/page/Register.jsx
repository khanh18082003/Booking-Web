import React from "react";
import { useNavigate } from "react-router";
import { GoogleLogin } from "@react-oauth/google";
import logo from "../assets/logo.svg"; // Đảm bảo đường dẫn đến logo đúng
import { Link, Links } from "react-router";

const Register = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="fixed top-0 left-0 w-full bg-[#003580] text-white py-2 z-10">
        <Link
            to="/"
            aria-label="Booking.com"
            className="box-border inline-flex w-40 text-start ml-10"
            >
          <img src={logo} alt="Booking" className="w-30 mb-2" />
        </Link>
      </div>

      {/* Form đăng ký (dịch xuống dưới header) */}
      <div className="flex items-center justify-center pt-20 min-h-screen">
        <div className="w-96 rounded-2xl bg-white p-8 shadow-lg">
          <h1 className="mb-6 text-center text-2xl font-bold text-gray-700">
            Register
          </h1>
          <form className="space-y-4" >
            <div>
              <label className="mb-1 block text-gray-600">First name</label>
              <input
                type="text"
                name="firstName"
                placeholder="Enter your first name"
                className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-gray-600">Last name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Enter your last name"
                className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-gray-600">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-gray-600">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-gray-600">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Enter your password again"
                className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="mr-2 w-1/2 rounded-lg bg-blue-500 py-2 text-white transition duration-300 hover:bg-blue-600"
              >
                Login
              </button>
              <button
                type="submit"
                className="w-1/2 rounded-lg bg-gray-300 py-2 text-gray-700 transition duration-300 hover:bg-gray-400"
              >
                Register
              </button>
            </div>
          </form>
          <p className="mt-2 text-center">Or</p>
          <div className="mt-2 flex items-center justify-center gap-4">
          <button className="rounded-lg bg-red-700 px-4 py-2 text-white transition duration-300 hover:bg-blue-800">
              Đăng ký bằng Google
            </button>
            <button className="rounded-lg bg-blue-700 px-4 py-2 text-white transition duration-300 hover:bg-blue-800">
              Đăng ký bằng Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;