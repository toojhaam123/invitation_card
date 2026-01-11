import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { publicApi } from "../api/axios";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await publicApi.post("/register", formData);
      alert("Đăng ký thành công! Hãy đăng nhập.");
      navigate("/login");
    } catch (error) {
      alert(
        "Lỗi đăng ký: " + (error.response?.data?.message || "Vui lòng thử lại")
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-[#c94b6a] text-center mb-6">
          Đăng ký
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Họ tên"
            className="w-full p-3 border rounded-lg"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            className="w-full p-3 border rounded-lg"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
          <input
            type="password"
            placeholder="Xác nhận mật khẩu"
            className="w-full p-3 border rounded-lg"
            onChange={(e) =>
              setFormData({
                ...formData,
                password_confirmation: e.target.value,
              })
            }
            required
          />
          <button className="w-full bg-[#c94b6a] text-white p-3 rounded-lg font-bold hover:bg-[#a83a55]">
            Đăng ký
          </button>
        </form>
        <p className="mt-4 text-sm text-blue-500">
          Đã có tài khoản?{" "}
          <Link to="/login" className="text-blue-500">
            Đi đến đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
