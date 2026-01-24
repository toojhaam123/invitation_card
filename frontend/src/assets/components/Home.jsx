import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { privateApi } from "../api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoadingState from "./LoadingState";
import useAuth from "../hooks/me";
import {
  faPlus,
  faUsers,
  faCalendarDays,
  faEdit,
  faTrashAlt,
  faEnvelopeOpenText,
} from "@fortawesome/free-solid-svg-icons";

const EventDashboard = () => {
  const { me } = useAuth();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    setLoading(true);
    const fetchEvents = async () => {
      try {
        const res = await privateApi.get("/events");
        setEvents(res.data.data);
        // console.log("Danh sách sự kiện: ", res.data.data);
      } catch (error) {
        console.error("Lỗi lấy danh sách sự kiện: ", error?.response?.data);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Logout
  const handleLogout = async () => {
    setLoading(true);

    try {
      await privateApi.post("/logout");
      localStorage.removeItem("token");
      alert("Đã đăng xuất thành công");
      window.location.href = "/login"; // Đẩy về trang login và xóa sạch trạng thái
    } catch (error) {
      console.log("Có lỗi khi đăng xuất: ", error?.response?.data);
    } finally {
      setLoading(true);
      localStorage.removeItem("user");
    }
  };

  // Delete
  const handleDelete = async (eventId) => {
    setLoading(true);
    try {
      const res = await privateApi.delete(`delete/wedding-event/${eventId}`);
      if (res.data.success) {
        alert("Xóa sự kiện thành công!");
      }
      setEvents((prev) => prev.filter((events) => events.id !== eventId));
    } catch (e) {
      console.log("Lỗi khi xóa sự kiện!", e?.response?.data);
      alert("Không thể xóa sự kiện, thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState></LoadingState>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-red-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Dashboard */}
      <div className="max-w-4xl mx-auto mb-4 flex items-center justify-between gap-2 md:gap-4 px-2">
        {/* Cụm Đăng nhập / Đăng xuất */}
        <div className="shrink-0">
          {!token ? (
            <Link
              to="/login"
              className="px-4 md:px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold rounded-full shadow-lg transition-all duration-300 flex items-center gap-2 active:scale-95 whitespace-nowrap text-sm md:text-base"
            >
              <FontAwesomeIcon
                icon={faEnvelopeOpenText}
                className="text-[10px] md:text-xs"
              />
              Đăng nhập
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="px-4 md:px-6 py-2 bg-white text-gray-700 font-semibold border-2 border-pink-100 rounded-full hover:bg-pink-50 transition-all duration-300 shadow-sm flex items-center gap-2 active:scale-95 whitespace-nowrap text-sm md:text-base"
            >
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shrink-0"></div>
              Đăng xuất
            </button>
          )}
        </div>

        {/* Nút Thêm Sự Kiện */}
        <button
          onClick={() => navigate("/create-event")}
          className="bg-gradient-to-r from-[#c94b6a] to-[#e65c7b] hover:to-[#a83a55] text-white px-4 md:px-6 py-2.5 rounded-full 
                    flex items-center gap-2 transition-all duration-300 shadow-[0_4px_15px_rgba(201,75,106,0.3)] 
                    active:scale-95 shrink-0 whitespace-nowrap text-sm md:text-base"
        >
          <FontAwesomeIcon icon={faPlus} className="text-xs md:text-base" />
          <span className="font-bold tracking-wide">Thêm Sự Kiện</span>
        </button>
      </div>
      <div className="max-w-4xl mx-auto mb-5 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Quản lý Sự kiện</h1>
          <p className="text-gray-500 mt-1">
            Chào {me?.name}, hôm nay bạn có bao nhiêu thiệp hồng?
          </p>
        </div>
      </div>
      <div className="border-1 border max-w-4xl mx-auto mb-5"></div>
      {/* Grid Danh sách Sự kiện */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-xl transition-all duration-300"
          >
            {/* Ảnh cover sự kiện */}
            <div className="relative h-44 overflow-hidden">
              <img
                src={
                  event.cover_image
                    ? `http://localhost:8000/storage/weddingevents/covers/${event.cover_image}`
                    : "public/anh-nen-cuoi-hang-tung.jpg"
                }
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                alt="Wedding"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-1 mx-1 text-white">
                <h3 className="text-xl font-bold shrink-0 text-center whitespace-nowrap">
                  {event.groom_name} & {event.bride_name}
                </h3>
              </div>
              <span className="absolute top-1 right-1 bg-white/90 backdrop-blur-sm text-[#c94b6a] text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-sm">
                {event.event_type || "WeddingEvent"}
              </span>
            </div>

            {/* Nội dung tóm tắt */}
            <div className="p-6">
              <div className="flex justify-between items-center mb-3">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                    Ngày đại hỷ
                  </span>
                  <div className="flex items-center text-sm text-gray-700 font-bold gap-1.5 mt-0.5">
                    <FontAwesomeIcon
                      icon={faCalendarDays}
                      className="text-[#c94b6a]"
                    />
                    {new Date(event.event_date).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </div>
                </div>

                {/* Badge trạng thái */}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase rounded-lg border border-green-100 shadow-sm">
                  <FontAwesomeIcon
                    icon={faEnvelopeOpenText}
                    className="text-[9px]"
                  />
                  <span>Có {event.invitations_count} thiệp</span>
                </span>
              </div>

              {/* Nút hành động chính */}
              <div className="flex items-center gap-2 mt-auto">
                {/* Nút Quản lý khách - Chiếm phần lớn diện tích */}
                <Link
                  to={`/${event.slug}`}
                  className="flex-[3] bg-[#c94b6a] text-white p-3 rounded-xl text-center text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#a83a55] transition-all shadow-sm active:scale-95 whitespace-nowrap"
                >
                  <FontAwesomeIcon icon={faUsers} />
                  <span>Quản lý khách</span>
                </Link>

                {/* Nhóm nút Sửa & Xóa - Nhỏ gọn bên phải */}
                <div className="flex flex-[1] gap-2">
                  {/* Nút Sửa */}
                  <button
                    onClick={() => {
                      navigate(`/${event.slug}/edit-event`);
                    }}
                    className="p-3 flex-1 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 hover:text-blue-600 transition-all active:scale-90 flex items-center justify-center"
                    title="Chỉnh sửa"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>

                  {/* Nút Xóa */}
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          "Tùng có chắc chắn muốn xóa sự kiện này?",
                        )
                      ) {
                        handleDelete(event.id);
                      }
                    }}
                    className="p-3 flex-1 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all active:scale-90 flex items-center justify-center"
                    title="Xóa sự kiện"
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </div>
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
