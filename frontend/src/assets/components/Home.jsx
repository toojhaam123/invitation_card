import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { privateApi } from "../api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faUsers,
  faCalendarAlt,
  faEllipsisV,
} from "@fortawesome/free-solid-svg-icons";

const EventDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await privateApi.get("/events");
        setEvents(res.data.data);
      } catch (error) {
        console.error("Lỗi lấy danh sách sự kiện: ", error?.response.data);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login"; // Đẩy về trang login và xóa sạch trạng thái
  };

  if (loading)
    return (
      <div className="p-10 text-center font-serif">
        Đang tải danh sách sự kiện...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-4 md:p-10 font-sans">
      {/* Header Dashboard */}
      <div className="flex items-start">
        {!token ? (
          <button>
            <Link to="/login">Đăng nhập</Link>
          </button>
        ) : (
          <button className="" onClick={handleLogout}>
            Đăng xuất
          </button>
        )}
      </div>
      <div className="max-w-7xl mx-auto mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Quản lý Sự kiện</h1>
          <p className="text-gray-500 mt-1">
            Chào Tùng, hôm nay bạn có bao nhiêu thiệp hồng?
          </p>
        </div>
        <button
          onClick={() => navigate("/create-event")}
          className="bg-[#c94b6a] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-pink-100 hover:bg-[#a83a55] transition-all"
        >
          <FontAwesomeIcon icon={faPlus} /> Thêm Sự Kiện
        </button>
      </div>

      {/* Grid Danh sách Sự kiện */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100 group hover:shadow-xl transition-all duration-300"
          >
            {/* Ảnh cover sự kiện */}
            <div className="relative h-44">
              <img
                src={
                  event.cover_image
                    ? `http://localhost:8000/storage/weddingevents/covers/${event.cover_image}`
                    : "https://via.placeholder.com/400x200"
                }
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                alt="Wedding"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-4 left-6 text-white">
                <h3 className="text-xl font-bold">
                  {event.groom_name} & {event.bride_name}
                </h3>
              </div>
            </div>

            {/* Nội dung tóm tắt */}
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3 text-gray-500 text-sm">
                  <div className="w-10 h-10 bg-pink-50 rounded-full flex items-center justify-center text-[#c94b6a]">
                    <FontAwesomeIcon icon={faCalendarAlt} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-700">
                      {new Date(event.event_date).toLocaleDateString("vi-VN")}
                    </p>
                    <p className="text-xs italic">Ngày đại hỷ</p>
                  </div>
                </div>

                {/* Badge trạng thái */}
                <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase rounded-lg border border-green-100">
                  Active
                </span>
              </div>

              {/* Nút hành động chính theo đúng ý Tùng */}
              <div className="flex gap-3 pt-4 border-t border-gray-50">
                <Link
                  to={`/${event.slug}/`}
                  className="flex-1 bg-gray-900 text-white p-3 rounded-2xl text-center text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-md"
                >
                  <FontAwesomeIcon icon={faUsers} /> Quản lý khách mời
                </Link>

                <button
                  onClick={() => navigate(`/events/edit/${event.id}`)}
                  className="w-12 h-12 shrink-0 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center hover:bg-pink-50 hover:text-[#c94b6a] transition-all border border-gray-100"
                >
                  <FontAwesomeIcon icon={faEllipsisV} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Card trống để thêm mới nếu chưa có sự kiện */}
        {events.length === 0 && (
          <div
            onClick={() => navigate("/create-event")}
            className="border-4 border-dashed border-gray-100 rounded-[32px] flex flex-col items-center justify-center p-10 cursor-pointer hover:border-pink-200 hover:bg-pink-50/30 transition-all group"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-[#c94b6a] group-hover:text-white transition-all mb-4">
              <FontAwesomeIcon icon={faPlus} className="text-xl" />
            </div>
            <p className="font-bold text-gray-400 group-hover:text-[#c94b6a]">
              Tạo sự kiện đầu tiên
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDashboard;
