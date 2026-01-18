import axios from "axios";

const BASE_URL = "http://localhost:8000/api/v1";

// --- 1. INSTANCE PUBLIC (Dùng cho khách xem thiệp) ---
// Không cần gửi Token, tránh lỗi nếu Token hết hạn hoặc không có
export const publicApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// --- 2. INSTANCE PRIVATE (Dùng cho trang Home, Create, Edit) ---
// Tự động đính kèm Token từ localStorage vào Header
export const privateApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Interceptor: Trước khi gửi request đi, nó sẽ tự "nhét" Token vào
privateApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor: Xử lý nếu Token bị sai/hết hạn (Lỗi 401)
privateApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      // Thay vì Promise.reject(error), mình trả về một object lỗi êm đẹp
      return Promise.resolve({ data: null, error: "Unauthorized" });
    }
    return Promise.reject(error);
  },
);
