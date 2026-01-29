import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { publicApi } from "../api/axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await publicApi.post("/login", { email, password });
      // LƯU TOKEN VÀO LOCALSTORAGE
      localStorage.setItem("token", res.data.token);
      // localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/"); // Về trang chủ quản lý thiệp
      window.location.reload(); // Reload để privateApi cập nhật token mới
    } catch (error) {
      alert("Sai tài khoản hoặc mật khẩu!", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h3 className="text-3xl font-bold text-[#c94b6a] text-center mb-6">
          Đăng nhập
        </h3>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            className="w-full p-3 border rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            disabled={loading}
            className="w-full mb-8 bg-[#c94b6a] text-white p-3 rounded-lg font-bold hover:bg-[#a83a55]"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
        <p className="mt-4 text-sm text-blue-500 text-center">
          <Link to="/register" className="">
            Chưa có tài khoản
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
