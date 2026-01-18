import { useState } from "react";
import { useParams } from "react-router-dom"; // Để lấy wedding_event_id từ URL
import { privateApi } from "../api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import LoadingState from "../components/LoadingState";

const AddInvitation = () => {
  const { weddingSlug } = useParams();
  const [guestName, setGuestName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await privateApi.post(`event/invitations/${weddingSlug}`, {
        guest_name: guestName,
      });

      alert(`🎉 Đã tạo thiệp cho: ${guestName}`);

      // Reset form
      setGuestName("");
    } catch (error) {
      console.error("Lỗi tạo thiệp:", error?.response?.data);
      alert("Không tạo được thiệp, Tùng kiểm tra lại nhé!");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState></LoadingState>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-red-50 py-12 px-0 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h3 className="text-[#c94b6a] font-bold text-3xl mb-4 flex items-center">
          <FontAwesomeIcon icon={faUserPlus} className="mr-2" /> Thêm Khách Mời
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
              <span>Thêm Thiệp Mời</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddInvitation;
