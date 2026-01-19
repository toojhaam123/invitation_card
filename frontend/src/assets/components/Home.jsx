import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { privateApi } from "../api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelopeOpenText } from "@fortawesome/free-solid-svg-icons";
import LoadingState from "./LoadingState";
import useAuth from "../hooks/me";
import {
  faPlus,
  faUsers,
  faEllipsisV,
  faCalendarDays,
  faEdit,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";

const EventDashboard = () => {
  const { me } = useAuth();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [showMenu, setShowMenu] = useState(null); // Lưu ID của sự kiện đang mở menu

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

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login"; // Đẩy về trang login và xóa sạch trạng thái
  };

  // Delete
  const handleDelete = () => {
    alert("Sẽ thêm tính năng xóa sau!");
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
            className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100 group hover:shadow-xl transition-all duration-300"
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
            </div>

            {/* Nội dung tóm tắt */}
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 uppercase font-bold tracking-tighter">
                    Ngày đại hỷ
                  </span>
                  <div className="flex items-center text-gray-700 font-semibold gap-2">
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
                <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase rounded-lg border border-green-100">
                  Active
                </span>
              </div>

              {/* Nút hành động chính */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100 mt-auto">
                {/* Link Quản lý - Thêm whitespace-nowrap để chữ không bị xuống dòng */}
                <Link
                  to={`/${event.slug}/`}
                  className="flex-1 bg-gray-900 text-white p-3 rounded-2xl text-center text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-md whitespace-nowrap"
                >
                  <FontAwesomeIcon icon={faUsers} className="text-xs" />
                  <span>Quản lý khách</span>
                </Link>

                {/* Cụm Dropdown Menu */}
                <div className="relative shrink-0">
                  <button
                    onClick={() =>
                      setShowMenu(showMenu === event.id ? null : event.id)
                    }
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all border ${
                      showMenu === event.id
                        ? "bg-pink-50 text-[#c94b6a] border-pink-200"
                        : "bg-gray-50 text-gray-400 border-gray-100 hover:bg-pink-50 hover:text-[#c94b6a]"
                    }`}
                  >
                    <FontAwesomeIcon icon={faEllipsisV} />
                  </button>

                  {showMenu === event.id && (
                    <>
                      {/* Lớp phủ full màn hình để đóng menu khi bấm ra ngoài */}
                      <div
                        className="fixed inset-0 z-[60]"
                        onClick={() => setShowMenu(null)}
                      ></div>

                      {/* Menu nội dung - Chỉnh lại tọa độ và z-index */}
                      <div className="absolute right-0 bottom-full mb-2 w-44 bg-white rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.1)] border border-gray-100 z-[70] overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                "Bạn có chắc chắn muốn xóa sự kiện này?",
                              )
                            )
                              handleDelete(event.id);
                            setShowMenu(null);
                          }}
                          className="w-full px-4 py-3 text-left text-sm text-red-500 hover:text-red-400 
                          hover:bg-gray-900 flex items-center gap-3 transition-colors border-t border-gray-50"
                        >
                          <FontAwesomeIcon icon={faTrashAlt} className="" />
                          <span className="font-semibold">Xóa sự kiện</span>
                        </button>

                        <button
                          onClick={() => {
                            navigate(`/edit-event/${event.id}`);
                            setShowMenu(null);
                          }}
                          className="w-full px-4 py-3 group text-left text-sm text-gray-100 hover:bg-gray-900 hover:text-gray-400 flex items-center gap-3 transition-colors"
                        >
                          <FontAwesomeIcon
                            icon={faEdit}
                            className="text-gray-100"
                          />
                          <span className="font-semibold">Chỉnh sửa</span>
                        </button>
                      </div>
                    </>
                  )}
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
