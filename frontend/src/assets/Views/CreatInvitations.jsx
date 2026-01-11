import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { privateApi } from "../api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faCalendarAlt,
  faUserTag,
  faMapMarkedAlt,
  faImages,
} from "@fortawesome/free-solid-svg-icons";

const CreateInvitation = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    guest_name: "", // Trường quan trọng để tạo Slug ở Backend
    groom_name: "",
    bride_name: "",
    slug: "",
    groom_father: "",
    groom_mother: "",
    bride_father: "",
    bride_mother: "",
    event_date: "",
    lunar_date: "",
    location_type: "nhà trai",
    address: "",
    map_iframe: "",
    music_url: "",
    qr_code_bank: "",
    is_published: true,
  });

  const [coverImage, setCoverImage] = useState(null);
  const [albumImages, setAlbumImages] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();

    // 1. Duyệt qua formData để append các trường text
    Object.keys(formData).forEach((key) => {
      // Chỉ gửi id nếu đang ở chế độ chỉnh sửa
      if (key === "id") {
        if (formData[key]) data.append(key, formData[key]);
        return;
      }

      // Xử lý boolean cho Laravel (1/0)
      if (typeof formData[key] === "boolean") {
        data.append(key, formData[key] ? 1 : 0);
        return;
      }

      // Đảm bảo không gửi các giá trị rỗng/null làm phiền Backend
      if (
        formData[key] !== "" &&
        formData[key] !== null &&
        formData[key] !== undefined
      ) {
        data.append(key, formData[key]);
      }
    });

    // 2. Append Ảnh bìa
    if (coverImage) {
      data.append("cover_image", coverImage);
    }

    // 3. Append Album ảnh
    if (albumImages && albumImages.length > 0) {
      Array.from(albumImages).forEach((file) =>
        data.append("album_image[]", file)
      );
    }

    try {
      const res = await privateApi.post("/invitations", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(res.data.message);
      navigate("/");
    } catch (error) {
      const serverErrors = error?.response?.data?.errors;
      if (serverErrors) {
        const msg = Object.values(serverErrors).flat().join("\n");
        alert("Dữ liệu nhập vào chưa đúng:\n" + msg);
      } else {
        alert(
          "Lỗi: " +
            (error?.response?.data?.message || "Không thể kết nối server")
        );
        console.error("Error Detail:", error?.response?.data);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 py-10 px-4 font-sans">
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden"
      >
        {/* HEADER */}
        <div className="bg-[#c94b6a] p-6 text-white text-center">
          <h1 className="text-2xl font-bold uppercase tracking-widest">
            Tạo thiệp mời mới
          </h1>
          <p className="text-pink-100 text-sm">
            Gửi gắm hạnh phúc đến tận tay khách mời
          </p>
        </div>

        <div className="p-8 space-y-8">
          {/* SECTION: TÊN NGƯỜI ĐƯỢC MỜI (DÙNG ĐỂ TẠO SLUG) */}
          <section className="bg-orange-50 p-6 rounded-2xl border-2 border-dashed border-orange-200">
            <h2 className="text-[#c94b6a] font-bold mb-4 flex items-center">
              <FontAwesomeIcon icon={faUserTag} className="mr-2" /> Tên khách
              mời
            </h2>
            <input
              type="text"
              name="guest_name"
              placeholder="Ví dụ: Anh Tú & Gia đình (Bắt buộc)"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#c94b6a] outline-none text-lg font-semibold"
              required
            />
            <p className="text-xs text-gray-500 mt-2 italic">
              * Tên này sẽ xuất hiện trên thiệp và dùng để tạo link (slug).
            </p>
          </section>

          {/* SECTION 1: THÔNG TIN CẶP ĐÔI */}
          <section>
            <h2 className="text-[#c94b6a] font-bold border-b pb-2 mb-4">
              <FontAwesomeIcon icon={faHeart} className="mr-2" /> Thông tin cặp
              đôi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-medium">
              <div>
                <label>Tên chú rể</label>
                <input
                  type="text"
                  name="groom_name"
                  placeholder="Ví dụ: Hạng A Tùng"
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300 outline-none focus:border-[#c94b6a]"
                  required
                />
              </div>
              <div>
                <label>Tên cô dâu</label>
                <input
                  type="text"
                  name="bride_name"
                  placeholder="Ví dụ: Sùng Thị Đới"
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-300 outline-none focus:border-[#c94b6a]"
                  required
                />
              </div>
            </div>
          </section>

          {/* SECTION 2: GIA ĐÌNH HAI BÊN */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-xl">
              <h3 className="font-semibold mb-3 text-blue-700 border-b border-blue-200">
                Nhà trai
              </h3>
              <input
                type="text"
                name="groom_father"
                placeholder="Họ tên bố"
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 mb-2 outline-none focus:border-blue-400"
              />
              <input
                type="text"
                name="groom_mother"
                placeholder="Họ tên mẹ"
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:border-blue-400"
              />
            </div>
            <div className="bg-pink-50 p-4 rounded-xl">
              <h3 className="font-semibold mb-3 text-pink-700 border-b border-pink-200">
                Nhà gái
              </h3>
              <input
                type="text"
                name="bride_father"
                placeholder="Họ tên bố"
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 mb-2 outline-none focus:border-pink-400"
              />
              <input
                type="text"
                name="bride_mother"
                placeholder="Họ tên mẹ"
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:border-pink-400"
              />
            </div>
          </section>

          {/* SECTION 3: THỜI GIAN & ĐỊA ĐIỂM */}
          <section>
            <h2 className="text-[#c94b6a] font-bold border-b pb-2 mb-4">
              <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" /> Thời
              gian & Địa điểm
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs text-gray-500 ml-1">
                  Ngày dương lịch
                </label>
                <input
                  type="datetime-local"
                  name="event_date"
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 ml-1">
                  Ngày âm lịch (text)
                </label>
                <input
                  type="text"
                  name="lunar_date"
                  placeholder="Ví dụ: 18 tháng Chạp"
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                Địa điểm tổ chức tại:
              </label>
              <select
                name="location_type"
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none"
              >
                <option value="nhà trai">Nhà Trai</option>
                <option value="nhà gái">Nhà Gái</option>
                <option value="nhà hàng">Nhà Hàng</option>
                <option value="tư gia">Tư Gia</option>
              </select>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                name="address"
                placeholder="Địa chỉ chi tiết (Thôn, Xã, Huyện...)"
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none"
                required
              />
              <div className="flex items-center text-sm text-gray-600">
                <FontAwesomeIcon icon={faMapMarkedAlt} className="mr-2" />
                <textarea
                  name="map_iframe"
                  placeholder="Dán mã nhúng Iframe Google Maps vào đây"
                  onChange={handleChange}
                  className="w-full h-20 p-2 border border-gray-300 rounded-lg outline-none"
                ></textarea>
              </div>
            </div>
          </section>

          {/* SECTION 4: HÌNH ẢNH & NHẠC */}
          <section>
            <h2 className="text-[#c94b6a] font-bold border-b pb-2 mb-4">
              <FontAwesomeIcon icon={faImages} className="mr-2" /> Hình ảnh &
              Nhạc nền
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Ảnh bìa thiệp (Cover)
                </label>
                <input
                  type="file"
                  onChange={(e) => setCoverImage(e.target.files[0])}
                  className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-pink-50 file:text-[#c94b6a] hover:file:bg-pink-100"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-medium text-gray-700 mb-2">
                  Album ảnh cưới (Chọn nhiều ảnh)
                </label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setAlbumImages(e.target.files)}
                  className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-pink-50 file:text-[#c94b6a] hover:file:bg-pink-100 w-full"
                />
              </div>
            </div>
          </section>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="bg-gray-50 p-6 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-6 py-2 text-gray-600 font-medium hover:text-gray-800 transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-10 py-2 bg-[#c94b6a] text-white rounded-full font-bold shadow-lg hover:bg-[#a83a55] transition-all disabled:bg-gray-400"
          >
            {loading ? "Đang xử lý..." : "Lưu thiệp mời"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateInvitation;
