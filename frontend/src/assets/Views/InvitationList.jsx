import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { privateApi } from "../api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoadingState from "../components/LoadingState";
import useAuth from "../hooks/me";
import {
  faPlus,
  faEye,
  faEdit,
  faLink,
  faTrashCan,
  faCalendarDays,
  faArrowLeft,
  faCheckCircle,
  faTimesCircle,
  faClock,
  faCommentDots,
} from "@fortawesome/free-solid-svg-icons";

const InvitationList = () => {
  const navigate = useNavigate();
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { weddingSlug } = useParams();
  const { me } = useAuth();

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const res = await privateApi.get(`event/invitations/${weddingSlug}`); // API lấy danh sách thiệp của user
        setInvitations(res.data.data);
        // console.log("Danh sách Thiệp: ", res.data.data);
      } catch (error) {
        console.error("Lỗi lấy danh sách thiệp", error.response?.data);
      } finally {
        setLoading(false);
      }
    };
    fetchInvitations();
  }, []);

  // Delete
  const handleDelete = async (invitationId) => {
    setLoading(true);
    try {
      const res = await privateApi.delete(`delete/invitation/${invitationId}`);

      if (res.data.success) {
        setInvitations((prev) =>
          prev?.filter((invitations) => invitations?.id !== invitationId),
        );
        alert("Xóa thiệp mời thành công!");
      }
    } catch (e) {
      alert("Lỗi khi xóa thiệp mời!");
      console.log("Lỗi xóa thiệp mời: ", e?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState></LoadingState>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-red-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8 flex items-center justify-between gap-3 px-2">
        {/* Nút Quay lại - Thêm whitespace-nowrap để chữ không bị xuống dòng bên trong nút */}
        <button
          onClick={() => navigate(-1)}
          className="bg-gradient-to-r from-[#c94b6a] to-[#e65c7b] hover:to-[#a83a55] text-white px-4 md:px-6 py-2.5 rounded-full 
    flex items-center gap-2 transition-all duration-300 shadow-[0_4px_15px_rgba(201,75,106,0.3)] 
    active:scale-95 whitespace-nowrap shrink-0"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          <span className="hidden md:inline">Quay lại</span>
        </button>

        {/* Nút Tạo thiệp mới - shrink-0 để không bị ép co lại */}
        <Link
          to={`/${weddingSlug}/create-invitation`}
          className="bg-gradient-to-r from-[#c94b6a] to-[#e65c7b] group hover:to-[#a83a55] text-white hover:text-white px-4 md:px-6 py-2.5 rounded-full 
                    flex items-center gap-2 transition-all duration-300 shadow-[0_4px_15px_rgba(201,75,106,0.3)] 
                    active:scale-95 whitespace-nowrap shrink-0"
        >
          <FontAwesomeIcon icon={faPlus} />
          <span className="font-bold tracking-wide">Tạo thiệp mới</span>
        </Link>
      </div>
      <div className="max-w-4xl mx-auto flex justify-between items-end mb-5">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 text-start">
            Danh sách thiệp mời
          </h1>
          <div>
            <p className="text-gray-500 text-sm px-1">
              Chào {me?.name}, bạn đang có {invitations.length} thiệp mời.
            </p>
          </div>
        </div>
      </div>

      {/* Danh sách thiệp */}
      <div className="max-w-4xl mx-auto">
        {invitations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {invitations.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 transform"
              >
                {/* Phần ảnh bìa (Cover Image) */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={
                      item?.wedding_event?.cover_image
                        ? `http://localhost:8000/storage/weddingevents/covers/${item?.wedding_event?.cover_image}`
                        : "../../public/anh-nen-cuoi-hang-tung.jpg"
                    }
                    alt="Cover"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-[#c94b6a] text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-sm">
                    {item.event_type || "Wedding"}
                  </span>
                  <div className="absolute bottom-1 pl-1 text-white">
                    <p className="font-bold text-lg leading-tight">
                      Kính mời: {item.guest_name}
                    </p>
                  </div>
                </div>

                {/* Thông tin chi tiết */}
                <div className="p-3">
                  {/* Hàng 1: Ngày tháng và Nút Action phụ */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                        Ngày đại hỷ
                      </span>
                      <div className="flex items-center text-sm text-gray-700 font-bold gap-1.5 mt-0.5">
                        <FontAwesomeIcon
                          icon={faCalendarDays}
                          className="text-[#c94b6a]"
                        />
                        {new Date(
                          item.wedding_event.event_date,
                        ).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </div>
                    </div>

                    {/* Nút Copy Link - Cho nhỏ lại một chút để cân bằng */}
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${window.location.origin}/${item.wedding_event.slug}/${item.slug}`,
                        );
                        alert("Đã sao chép link thiệp!");
                      }}
                      className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#c94b6a] hover:text-white transition-all shadow-sm border border-gray-100"
                      title="Copy link gửi Zalo"
                    >
                      <FontAwesomeIcon icon={faLink} size="sm" />
                    </button>
                  </div>

                  {/* Hàng 2: Nhóm Badge Trạng thái - Dùng Flex-wrap để tự xuống hàng nếu quá chật */}
                  <div className="flex flex-wrap gap-2  mb-3">
                    {/* Badge Xem */}
                    <div
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase flex items-center gap-1.5 border ${
                        item.logs_exists
                          ? "bg-green-50 text-green-600 border-green-100"
                          : "bg-gray-50 text-gray-400 border-gray-100"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${item.logs_exists ? "bg-green-500 animate-pulse" : "bg-gray-300"}`}
                      ></span>
                      {item.logs_exists ? "Khách đã xem" : "Khách chưa xem"}
                    </div>

                    {/* Badge Tham dự */}
                    <div
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase flex items-center gap-1.5 border ${
                        item.is_attended === null
                          ? "bg-orange-50 text-orange-500 border-orange-100"
                          : item.is_attended
                            ? "bg-blue-50 text-blue-600 border-blue-100"
                            : "bg-red-50 text-red-500 border-red-100"
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={
                          item.is_attended === null
                            ? faClock
                            : item.is_attended
                              ? faCheckCircle
                              : faTimesCircle
                        }
                        className="text-[11px]"
                      />
                      {item.is_attended === null
                        ? "Đang chờ"
                        : item.is_attended
                          ? "Sẽ tham dự"
                          : "Vắng mặt"}
                    </div>
                    {/* Số lượng lời chúc */}
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold uppercase bg-purple-50 text-purple-600 border border-purple-100">
                      <FontAwesomeIcon
                        icon={faCommentDots}
                        className="text-[11px]"
                      />
                      {item.guestbooks_count}
                    </div>
                  </div>

                  {/* Hàng 3: Nhóm nút bấm Action chính (Giữ nguyên của Tùng) */}
                  <div className="flex gap-2 sm:gap-3 items-center">
                    <Link
                      to={`/${weddingSlug}/${item.slug}`}
                      className="flex-[2] flex items-center justify-center gap-2 p-3 bg-[#c94b6a] text-white rounded-xl text-sm font-bold shadow-lg shadow-pink-100 hover:scale-[1.02] transition-all active:scale-95"
                    >
                      <FontAwesomeIcon icon={faEye} />
                      <span>Xem thiệp</span>
                    </Link>

                    <div className="flex flex-1 gap-2">
                      <Link
                        to={`/${weddingSlug}/${item.slug}/edit-invitation/${item.id}`}
                        className="p-3 flex-1 bg-white border border-gray-200 text-gray-600 rounded-2xl hover:bg-gray-50 transition-all flex items-center justify-center shadow-sm"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </Link>

                      <button
                        onClick={() => {
                          if (window.confirm("Tùng có chắc chắn muốn xóa?"))
                            handleDelete(item.id);
                        }}
                        className="p-3 flex-1 bg-white border border-red-100 text-red-400 rounded-2xl hover:bg-red-50 hover:text-red-600 transition-all flex items-center justify-center shadow-sm"
                      >
                        <FontAwesomeIcon icon={faTrashCan} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
            <p className="text-gray-400 mb-4">Bạn chưa có thiệp mời nào.</p>
            <Link
              to={`/${weddingSlug}/create-invitation`}
              className="text-[#c94b6a] font-bold underline"
            >
              Bắt đầu tạo ngay!
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvitationList;
