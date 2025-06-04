import axios from "../configuration/axiosCustomize";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [formData, setFormData] = useState({ email: "" });
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [apiLoading, setApiLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setHasError(false);
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiLoading(true);
    try {
      const response = await axios.post("/users/forgot-password", {
        email: formData.email,
      });
      const responseBody = response.data;
      console.log("Response:", responseBody);
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        setErrorMessage("Please enter a valid email.");
        setHasError(true);
        setApiLoading(false);
        return;
      }

      if (responseBody.code !== "M000") {
        setErrorMessage(responseBody.message);
        setHasError(true);
        return;
      }
      navigate("/verify-email", {
        state: {
          email: formData.email,
          fromForgotPassword: true,
        },
      });
    } catch (error) {
      if (
        error.response?.status === 401 ||
        error.response?.data?.code === "M0401"
      ) {
        setErrorMessage("Email or password is incorrect.");
        setHasError(true);
      } else {
        console.error("Error during forgot-password:", error);
        setErrorMessage("An error occurred. Please try again later.");
      }
    } finally {
      setApiLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center pt-20">
      <div className="w-96 rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-700">
          Enter your email
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
          {hasError && (
            <p className="text-center text-sm text-red-500">{errorMessage}</p>
          )}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-1/2 cursor-pointer rounded-lg bg-blue-500 py-2 text-white transition duration-300 hover:bg-blue-600"
              disabled={apiLoading}
            >
              {apiLoading ? "Processing..." : "Send Email"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
