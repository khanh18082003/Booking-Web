import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import axios from "../utils/axiosCustomize";
import { useStore } from "../utils/AuthProvider";
import { setPageTitle, PAGE_TITLES } from "../utils/pageTitle";

const VerifyEmail = () => {
  const location = useLocation();
  const { email, password } = location.state || {};
  const [verificationCode, setVerificationCode] = useState(Array(6).fill(""));
  const inputRefs = useRef(Array(6).fill(null));
  const [canResend, setCanResend] = useState(false);
  const [resendTimeout, setResendTimeout] = useState(59);
  const [successMessage, setSuccessMessage] = useState(""); // Success message
  const navigate = useNavigate();
  const { store, startApiCall, finishApiCall } = useStore();

  // Set page title
  useEffect(() => {
    setPageTitle(PAGE_TITLES.VERIFY_EMAIL);
  }, []);

  // Focus first input on component mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Handle countdown for resend functionality
  useEffect(() => {
    let interval;
    if (resendTimeout > 0) {
      interval = setInterval(() => {
        setResendTimeout((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [resendTimeout]);

  // Handle input change
  const handleChange = (index, e) => {
    // Allow only uppercase letters (A-Z) and digits (0-9)
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");

    if (value.length <= 1) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);

      // Auto-focus next input when a digit is entered
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  // Handle key navigation between inputs
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      // Move to previous input on left arrow
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      // Move to next input on right arrow
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle verification
  const handleVerify = async (e) => {
    e.preventDefault();

    const verificationCodeString = verificationCode.join("");
    startApiCall();
    setSuccessMessage("");

    try {
      const response = await axios.post("/auth/verify-email", {
        code: verificationCodeString,
        email: email,
      });

      if (response.data.code === "M000") {
        setSuccessMessage("Email verified successfully!");

        // Nếu đến từ forgot-password, chuyển hướng đến reset-password
        if (!password) {
          navigate("/reset-password", { state: { email } });
          return;
        }

        // Nếu có mật khẩu (tức là từ đăng ký), thực hiện đăng nhập
        try {
          const loginResponse = await axios.post("/auth/login", {
            email: email,
            password: password,
          });

          if (loginResponse.data.code === "M000") {
            localStorage.setItem(
              "accessToken",
              loginResponse.data.data.access_token,
            );
            navigate("/");
          } else {
            alert(`Login failed: ${loginResponse.data.message}`);
          }
        } catch (loginError) {
          if (loginError.response) {
            alert(`Login failed: ${loginError.response.data.message}`);
          } else {
            console.error("Error during login:", loginError);
            alert("An error occurred. Please try again later.");
          }
        }
      } else {
        alert(`Verification failed: ${response.data.message}`);
      }
    } catch (error) {
      if (error.response) {
        alert(`Verification failed: ${error.response.data.message}`);
      } else {
        console.error("Error during verification:", error);
        alert("An error occurred. Please try again later.");
      }
    } finally {
      finishApiCall();
    }
  };

  // Handle resend code
  const handleResend = async () => {
    if (!canResend) return;

    try {
      startApiCall(); // Start global loading state

      // Use the axios instance from AuthContext
      const response = await axios.post("/re-send-mail", {
        email: email, // Pass the email to the API
      });

      if (response.data.code === "M000") {
        alert("Verification email resent successfully!");
      } else {
        alert(`Failed to resend email: ${response.data.message}`);
      }

      // Start countdown and disable resend button
      setCanResend(false);
      setResendTimeout(58); // 58 seconds
    } catch (error) {
      if (error.response) {
        alert(`Failed to resend email: ${error.response.data.message}`);
      } else {
        console.error("Error during resend:", error);
        alert("An error occurred. Please try again later.");
      }
    } finally {
      finishApiCall(); // End global loading state
    }
  };

  return (
    <div className="relative">
      <div className="mx-auto mt-22 max-w-md">
        <h2 className="mb-4 text-center text-2xl font-medium">
          Verify Your Email Address
        </h2>

        <div className="mb-6">
          <p className="mb-1 text-center">
            We have sent a verification code to:
          </p>
          <p className="text-center font-medium">{email}</p>
          <p className="text-center text-sm">
            Please enter the code to continue.
          </p>
        </div>

        <form onSubmit={handleVerify}>
          <div className="mb-4 flex justify-center gap-1">
            {verificationCode.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                className="h-12 w-10 rounded border border-gray-300 text-center text-lg font-medium outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={digit}
                onChange={(e) => handleChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                inputMode="text" // Allow both letters and numbers
                autoComplete="off"
                pattern="[A-Za-z0-9]" // Ensure only valid characters are entered
              />
            ))}
          </div>
          {successMessage && (
            <p className="text-center text-green-500">{successMessage}</p>
          )}
          <button
            type="submit"
            className={`w-full rounded py-3 font-medium ${
              verificationCode.every((digit) => /^[A-Z0-9]$/.test(digit)) &&
              !store.apiLoading
                ? "cursor-pointer bg-blue-500 text-white hover:bg-blue-600"
                : "cursor-not-allowed bg-gray-200 text-gray-500"
            }`}
            disabled={
              !verificationCode.every((digit) => /^[A-Z0-9]$/.test(digit)) ||
              store.apiLoading
            }
          >
            {store.apiLoading ? "Processing..." : "Verify Email"}
          </button>
        </form>

        <div className="mt-4 flex flex-col items-center text-center">
          {!canResend ? (
            <p className="mb-1 text-sm">
              Didn&apos;t receive the email? Please check your spam folder or
              request a new code in {resendTimeout} seconds.
            </p>
          ) : (
            <button
              onClick={handleResend}
              disabled={store.apiLoading}
              className={`block text-sm font-medium ${
                store.apiLoading
                  ? "cursor-not-allowed text-gray-400"
                  : "text-blue-600 hover:underline"
              }`}
            >
              Resend Verification Code
            </button>
          )}
          <button
            onClick={() => navigate("/login")}
            disabled={store.apiLoading}
            className={`block text-sm font-medium ${
              store.apiLoading
                ? "cursor-not-allowed text-gray-400"
                : "text-blue-600 hover:underline"
            }`}
          >
            Back to Login
          </button>
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-gray-500">
        <p>Qua việc đăng nhập hoặc tạo tài khoản, bạn đồng ý với các</p>
        <p className="mt-1">
          <a href="#" className="text-blue-600 hover:underline">
            Điều khoản
          </a>{" "}
          và{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Điều kiện
          </a>{" "}
          cũng như{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Chính sách An toàn và Bảo mật
          </a>{" "}
          của chúng tôi
        </p>
        <p className="mt-2">Bảo lưu mọi quyền.</p>
        <p className="mt-1">Bản quyền (2006 - 2025) - Booking.com™</p>
      </div>
    </div>
  );
};

export default VerifyEmail;
