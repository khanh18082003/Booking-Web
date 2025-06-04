import { useNavigate } from "react-router-dom";
import { useState } from "react";
import hostAxios from "../../configuration/hostAxiosCustomize";

const HostRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    existingPassword: "",
  });
  const [step, setStep] = useState(1); // 1: nhập email, 2: xác thực hoặc đăng ký
  const [checking, setChecking] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Bước 1: Chỉ nhập email và kiểm tra
  const handleCheckEmail = async (e) => {
    e.preventDefault();
    if (!formData.email) return;
    setChecking(true);
    try {
      const res = await hostAxios.post("/users/host/check-email", {
        email: formData.email,
      });

      // Nếu code 501: đã có tài khoản host, chuyển về login host
      if (res.data.code === "M0501") {
        alert("Tài khoản này đã là Host. Vui lòng đăng nhập!");
        navigate("/host/login");
        return;
      }
      // Nếu code 201: đã có user, đã cập nhật role host thành công
      if (res.data.code === "M000") {
        alert(
          "Tài khoản đã được nâng cấp lên Host thành công! Mật khẩu giữ nguyên.",
        );
        navigate("/host/login");
        return;
      }
    } catch (err) {
      setStep(2);
    } finally {
      setChecking(false);
    }
  };

  // Bước 2: Xác thực hoặc đăng ký mới
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu không khớp!");
      return;
    }
    try {
      const res = await hostAxios.post("/users/register", {
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirmPassword,
        roles: ["HOST"],
      });
      if (res.data.code === "M000") {
        navigate("/verify-email", {
          state: {
            email: formData.email,
            password: formData.password,
          },
        });
      } else {
        alert(res.data.message || "Đăng ký thất bại!");
      }
    } catch (err) {
      alert("Đăng ký thất bại!");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 pt-10">
      <div className="w-full max-w-md rounded-3xl bg-white/90 p-8 shadow-2xl backdrop-blur-md">
        <h1 className="mb-8 text-center text-3xl font-extrabold tracking-wide text-blue-700">
          Đăng ký Host
        </h1>
        {step === 1 && (
          <form className="space-y-6" onSubmit={handleCheckEmail}>
            <div>
              <label className="mb-1 block font-medium text-gray-600">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Nhập email của bạn"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-700 shadow-sm transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {checking && (
                <span className="text-sm text-blue-500">Đang kiểm tra...</span>
              )}
            </div>
            <div className="flex">
              <button
                type="submit"
                className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white shadow-lg transition duration-150 hover:bg-blue-700 active:scale-95"
              >
                Tiếp tục
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="mb-1 block font-medium text-gray-600">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-gray-700"
              />
            </div>
            <div>
              <label className="mb-1 block font-medium text-gray-600">
                Mật khẩu
              </label>
              <input
                type="password"
                name="password"
                placeholder="Nhập mật khẩu"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-700 shadow-sm transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="mb-1 block font-medium text-gray-600">
                Nhập lại mật khẩu
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Nhập lại mật khẩu"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-700 shadow-sm transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
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
        )}

        <div className="mt-6 flex flex-col items-center gap-2">
          <span className="text-sm text-gray-500">
            Đã có tài khoản?{" "}
            <button
              type="button"
              onClick={() => navigate("/host/login")}
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

export default HostRegister;
