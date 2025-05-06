import { useState } from "react";
import axios from "../utils/axiosCustomize"; // Import axios
import { useNavigate, useLocation } from "react-router";

const ResetPassword = () => {
  const { email } = useLocation().state || {};
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
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
    setHasError(false);
    setErrorMessage("");

    if (formData.newPassword.length < 6) {
      setHasError(true);
      setErrorMessage("Password must be at least 6 characters.");
      setApiLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setHasError(true);
      setErrorMessage("Passwords do not match.");
      setApiLoading(false);
      return;
    }

    try {
      const response = await axios.post("/users/reset-password", {
        email,
        new_password: formData.newPassword,
      });

      alert("Password has been reset successfully!");
      navigate("/login"); // ✅ Redirect on success
    } catch (error) {
      console.error("Reset error:", error);
      setHasError(true);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setApiLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center pt-20">
      <div className="w-96 rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-700">
          Reset Password
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="relative">
            <label className="mb-1 block text-gray-600">New Password</label>
            <input
              type="password"
              name="newPassword"
              placeholder="Enter your new password"
              className={`w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                hasError ? "border-red-500" : ""
              }`}
              value={formData.newPassword}
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
          <div className="relative">
            <label className="mb-1 block text-gray-600">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Re-enter your password"
              className={`w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                hasError ? "border-red-500" : ""
              }`}
              value={formData.confirmPassword}
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
          {hasError && (
            <p className="text-center text-sm text-red-500">{errorMessage}</p>
          )}
          <div className="flex justify-center">
            <button
              type="submit"
              className="mr-2 w-1/2 cursor-pointer rounded-lg bg-blue-500 py-2 text-white transition duration-300 hover:bg-blue-600"
              disabled={apiLoading}
            >
              {apiLoading ? "Processing..." : "Reset Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
