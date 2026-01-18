import { useEffect, useState } from "react";
import { privateApi } from "../api/axios";

export default function useAuth() {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMe = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setMe(null);
        setLoading(false);
        return;
      }

      try {
        const res = await privateApi.get("/me");
        // Nếu dùng cách trả về resolve ở trên, res có thể là {data: null}
        if (res.data) {
          setMe(res.data);
        } else {
          setMe(null);
        }
      } catch (e) {
        setMe(null);
        setError("Lỗi kết nối", e);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  return {
    me,
    loading,
    error,
  };
}
