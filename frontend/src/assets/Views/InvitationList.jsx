import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { privateApi } from "../api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAuth from "../hooks/me";
import {
  faPlus,
  faEye,
  faEdit,
  faLink,
  faTrashCan,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";

const InvitationList = () => {
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
  const handleDelete = (id) => {
    return alert("Tính năng xóa sẽ cập nhật sau nhé!", id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-red-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
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
        <Link
          to={`/${weddingSlug}/create-invitation`}
          className="bg-[#c94b6a] hover:bg-[#a83a55] items-end text-white text-center hover:text-white transition duration-500 px-2 py-3 shrink-0 rounded-lg flex items-center gap-2 transition-all shadow-md"
        >
          <FontAwesomeIcon icon={faPlus} />
          Tạo thiệp mới
        </Link>
      </div>

      {/* Danh sách thiệp */}
      <div className="max-w-4xl mx-auto">
        {loading ? (
          <div className="text-center py-20 text-gray-400">
            Đang tải danh sách...
          </div>
        ) : invitations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {invitations.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 transform"
              >
                {/* Phần ảnh bìa (Cover Image) */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={
                      item?.wedding_event?.cover_image
                        ? `http://localhost:8000/storage/weddingevents/covers/${item?.wedding_event?.cover_image}`
                        : "https://via.placeholder.com/400x200?text=Wedding+Invitation"
                    }
                    alt="Cover"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-[#c94b6a] text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-sm">
                    {item.location_type || "Wedding"}
                  </span>
                  <div className="absolute bottom-1 pl-1 text-white">
                    <p className="font-bold text-lg leading-tight">
                      Kính mời: {item.guest_name}
                    </p>
                  </div>
                </div>

                {/* Thông tin chi tiết */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400 uppercase font-bold tracking-tighter">
                        Ngày đại hỷ
                      </span>
                      <div className="flex items-center text-gray-700 font-semibold gap-2">
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

                    {/* Nút Copy Link nhanh (Ngầu là phải có cái này) */}
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${window.location.origin}/${item.wedding_event.slug}/${item.slug}`,
                        );
                        alert("Đã sao chép link thiệp!");
                      }}
                      className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#c94b6a] hover:text-white transition-all shadow-inner"
                      title="Copy link gửi Zalo"
                    >
                      <FontAwesomeIcon icon={faLink} />
                    </button>
                  </div>

                  {/* Nhóm nút bấm Action */}
                  <div className="flex gap-2 sm:gap-3 items-center mt-4">
                    {/* Nút Xem chi tiết thiệp */}
                    <Link
                      to={`/${weddingSlug}/${item.slug}`}
                      className="flex-1 min-w-0 flex items-center justify-center gap-0 p-2.5 bg-[#c94b6a] text-white rounded-xl text-sm font-bold shadow-md shadow-pink-100 hover:bg-[#a83a55] transition-all active:scale-95"
                    >
                      <FontAwesomeIcon icon={faEye} className="shrink-0" />
                      <span className="truncate">Xem thiệp</span>
                    </Link>

                    {/* Nút Sửa - Cố định kích thước vuông, không co lại */}
                    <Link
                      to={`/edit/${item.id}`}
                      className="w-10 h-10 shrink-0 flex items-center justify-center bg-gray-50 text-gray-600 rounded-xl text-sm font-bold hover:bg-blue-50 hover:text-blue-600 transition-all border border-gray-100 active:scale-90"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Link>

                    {/* Nút Xóa - Cố định kích thước vuông, không co lại */}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="w-10 h-10 shrink-0 flex items-center justify-center bg-gray-50 text-gray-400 rounded-xl text-sm hover:bg-red-50 hover:text-red-500 transition-all border border-gray-100 active:scale-90"
                    >
                      <FontAwesomeIcon icon={faTrashCan} />
                    </button>
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
