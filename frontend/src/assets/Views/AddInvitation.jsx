import { useState } from "react";
import { useParams } from "react-router-dom"; // Để lấy wedding_event_id từ URL
import { privateApi } from "../api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faCamera,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";

const AddInvitation = ({ onInviteCreated }) => {
  const { weddingSlug } = useParams();
  const [guestName, setGuestName] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Xử lý chọn ảnh và tạo preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("guest_name", guestName);
    if (avatar) data.append("avatar", avatar);

    try {
      await privateApi.post(`event/invitations/${weddingSlug}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(`🎉 Đã tạo thiệp cho: ${guestName}`);

      // Reset form
      setGuestName("");
      setAvatar(null);
      setPreview(null);

      // Nếu Tùng có hàm load lại danh sách thì gọi ở đây
      if (onInviteCreated) onInviteCreated();
    } catch (error) {
      console.error("Lỗi tạo thiệp:", error?.response.data);
      alert("Không tạo được thiệp, Tùng kiểm tra lại nhé!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-3xl shadow-xl border border-pink-100">
      <h3 className="text-[#c94b6a] font-bold text-lg mb-4 flex items-center">
        <FontAwesomeIcon icon={faUserPlus} className="mr-2" /> Thêm Khách Mời
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* AVATAR UPLOAD MINI */}
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="relative w-20 h-20 bg-pink-50 rounded-full border-2 border-dashed border-pink-200 flex items-center justify-center overflow-hidden">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <FontAwesomeIcon
                icon={faCamera}
                className="text-pink-300 text-xl"
              />
            )}
            <input
              type="file"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
              accept="image/*"
            />
          </div>
          <span className="text-[10px] text-gray-400 uppercase tracking-tighter">
            Ảnh khách mời (nếu có)
          </span>
        </div>

        {/* GUEST NAME */}
        <div>
          <label className="text-xs font-semibold text-gray-500 ml-1">
            Tên khách mời
          </label>
          <input
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="Ví dụ: Anh Tùng & Người thương"
            className="w-full mt-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#c94b6a] outline-none transition-all font-sans"
            required
          />
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#c94b6a] text-white rounded-xl font-bold shadow-lg hover:bg-[#a83a55] transition-all disabled:bg-gray-300 flex items-center justify-center space-x-2"
        >
          {loading ? (
            <span>Đang tạo...</span>
          ) : (
            <>
              <FontAwesomeIcon icon={faPaperPlane} />
              <span>Thêm Thiệp Mời</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddInvitation;
