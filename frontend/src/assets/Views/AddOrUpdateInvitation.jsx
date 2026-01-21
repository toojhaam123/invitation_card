import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Để lấy wedding_event_id từ URL
import { privateApi } from "../api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faPaperPlane,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import LoadingState from "../components/LoadingState";

const AddOrUpdateInvitation = () => {
  const navigate = useNavigate();
  const { weddingSlug, guestNameSlug, invitationId } = useParams();
  const [guestName, setGuestName] = useState("");
  const [loading, setLoading] = useState(false);
  const isEditMode = Boolean(invitationId);

  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      const fetchInvitation = async () => {
        try {
          const res = await privateApi.get(
            `${weddingSlug}/${guestNameSlug}/edit-invitation/${invitationId}`,
          );
          setGuestName(res.data.data.guest_name);
        } catch (error) {
          console.log(
            "Lỗi khi lấy thông tin thiệp để chỉnh sửa: ",
            error?.response?.data,
          );
        } finally {
          setLoading(false);
        }
      };
      fetchInvitation();
    }
  }, [invitationId, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await privateApi.post(`event/invitations/${weddingSlug}`, {
        id: invitationId,
        guest_name: guestName,
      });

      alert(res.data.message);

      if (isEditMode) {
        navigate(-1);
      } else {
        // Reset form
        setGuestName("");
      }
    } catch (error) {
      console.error("Lỗi tạo thiệp:", error?.response?.data);
      alert("Không tạo được thiệp, kiểm tra lại nhé!");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState></LoadingState>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-red-50 py-12 px-2 lg:px-8">
      <div className="max-w-4xl mx-auto px-1">
        {/* Nút quay lại */}
        <div className="max-w-4xl mx-auto mb-6">
          <button
            onClick={() => navigate(-1)}
            className="bg-gradient-to-r from-[#c94b6a] to-[#e65c7b] hover:to-[#a83a55] text-white px-4 md:px-6 py-2.5 rounded-full 
    flex items-center gap-2 transition-all duration-300 shadow-[0_4px_15px_rgba(201,75,106,0.3)] 
    active:scale-95 whitespace-nowrap shrink-0"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            <span className="hidden md:inline">Quay lại</span>
          </button>
        </div>
        <h3 className="text-[#c94b6a] font-bold text-3xl mb-4 flex items-center">
          <FontAwesomeIcon icon={faUserPlus} className="mr-2" />{" "}
          {isEditMode ? "Chỉnh sửa Khách Mời" : "Thêm Khách Mời"}
        </h3>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 max-w-4xl mx-auto bg-white/80 backdrop-blur-md shadow-2xl rounded-[2rem] overflow-hidden border border-white p-5"
      >
        {/* GUEST NAME */}
        <div>
          <label className="text-gray-500 ml-1">Tên khách mời</label>
          <input
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="Ví dụ: Anh Tùng & Người thương"
            className="w-full mt-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#c94b6a] outline-none transition-all"
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
              <span> {isEditMode ? "Chỉnh Thiệp Mời" : "Thêm Thiệp Mời"}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddOrUpdateInvitation;
