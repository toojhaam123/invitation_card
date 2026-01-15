import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { privateApi } from "../api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faCalendarAlt,
  faMapMarkerAlt,
  faImages,
  faCrown,
  faArrowLeft,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

const AddWeddingEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    groom_name: "",
    bride_name: "",
    groom_father: "",
    groom_mother: "",
    bride_father: "",
    bride_mother: "",
    event_date: "",
    lunar_date: "",
    location_type: "nhà trai",
    address: "",
    map_iframe: "",
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

    Object.keys(formData).forEach((key) => {
      const value =
        typeof formData[key] === "boolean"
          ? formData[key]
            ? 1
            : 0
          : formData[key];
      if (value !== "" && value !== null) data.append(key, value);
    });

    if (coverImage) data.append("cover_image", coverImage);
    if (albumImages.length > 0) {
      Array.from(albumImages).forEach((file) =>
        data.append("album_image[]", file)
      );
    }

    try {
      await privateApi.post("/events", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✨ Chúc mừng! Sự kiện đại hỷ đã được tạo thành công.");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra, Tùng kiểm tra lại Network nhé!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-red-50 py-12 px-4 sm:px-6 lg:px-8 font-serif">
      {/* Nút quay lại */}
      <div className="max-w-4xl mx-auto mb-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center hover:text-white bg-[#c94b6a] transition-colors font-sans"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> Quay lại
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto bg-white/80 backdrop-blur-md shadow-2xl rounded-[2rem] overflow-hidden border border-white"
      >
        {/* HERO HEADER */}
        <div className="relative bg-[#c94b6a] py-12 px-6 text-white text-center">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <FontAwesomeIcon
            icon={faCrown}
            className="text-4xl mb-4 text-yellow-300"
          />
          <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-[0.2em]">
            Thông Tin Đại Hỷ
          </h1>
          <div className="w-24 h-1 bg-white/30 mx-auto mt-4 rounded-full"></div>
          <p className="mt-4 text-pink-100 italic font-sans">
            "Nơi khởi đầu cho một hành trình hạnh phúc trăm năm"
          </p>
        </div>

        <div className="p-6 md:p-10 space-y-12">
          {/* SECTION 1: NHÂN VẬT CHÍNH */}
          <section className="space-y-6">
            <div className="flex items-center space-x-3 border-b border-pink-100 pb-2">
              <FontAwesomeIcon
                icon={faHeart}
                className="text-[#c94b6a] text-xl"
              />
              <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wider">
                Cặp Đôi Chính
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative group">
                <label className="block text-sm font-semibold text-gray-600 mb-2 ml-1">
                  Chú Rể
                </label>
                <input
                  type="text"
                  name="groom_name"
                  placeholder="Hạng A Tùng"
                  onChange={handleChange}
                  className="w-full px-5 py-3 rounded-2xl border-2 border-blue-50 focus:border-blue-400 focus:ring-0 outline-none transition-all bg-blue-50/30 text-lg"
                  required
                />
              </div>
              <div className="relative group">
                <label className="block text-sm font-semibold text-gray-600 mb-2 ml-1">
                  Cô Dâu
                </label>
                <input
                  type="text"
                  name="bride_name"
                  placeholder="Sùng Thị Đới"
                  onChange={handleChange}
                  className="w-full px-5 py-3 rounded-2xl border-2 border-pink-50 focus:border-pink-400 focus:ring-0 outline-none transition-all bg-pink-50/30 text-lg"
                  required
                />
              </div>
            </div>
          </section>

          {/* SECTION 2: GIA ĐÌNH HAI BÊN */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Nhà Trai */}
            <div className="p-6 rounded-[2rem] bg-gradient-to-b from-blue-50 to-white border border-blue-100 shadow-sm">
              <h3 className="text-blue-700 font-bold mb-6 flex items-center justify-center">
                <span className="h-px w-8 bg-blue-200 mr-3"></span>
                ĐẠI DIỆN NHÀ TRAI
                <span className="h-px w-8 bg-blue-200 ml-3"></span>
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  name="groom_father"
                  placeholder="Thân phụ: Ông ..."
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-blue-100 outline-none focus:ring-2 focus:ring-blue-300 transition-all font-sans"
                />
                <input
                  type="text"
                  name="groom_mother"
                  placeholder="Thân mẫu: Bà ..."
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-blue-100 outline-none focus:ring-2 focus:ring-blue-300 transition-all font-sans"
                />
              </div>
            </div>

            {/* Nhà Gái */}
            <div className="p-6 rounded-[2rem] bg-gradient-to-b from-pink-50 to-white border border-pink-100 shadow-sm">
              <h3 className="text-pink-700 font-bold mb-6 flex items-center justify-center">
                <span className="h-px w-8 bg-pink-200 mr-3"></span>
                ĐẠI DIỆN NHÀ GÁI
                <span className="h-px w-8 bg-pink-200 ml-3"></span>
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  name="bride_father"
                  placeholder="Thân phụ: Ông ..."
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-100 outline-none focus:ring-2 focus:ring-pink-300 transition-all font-sans"
                />
                <input
                  type="text"
                  name="bride_mother"
                  placeholder="Thân mẫu: Bà ..."
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-100 outline-none focus:ring-2 focus:ring-pink-300 transition-all font-sans"
                />
              </div>
            </div>
          </section>

          {/* SECTION 3: THỜI GIAN & ĐỊA ĐIỂM */}
          <section className="space-y-6">
            <div className="flex items-center space-x-3 border-b border-pink-100 pb-2">
              <FontAwesomeIcon
                icon={faCalendarAlt}
                className="text-[#c94b6a] text-xl"
              />
              <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wider">
                Thời Gian & Địa Điểm
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">
                  Ngày Dương Lịch
                </label>
                <input
                  type="datetime-local"
                  name="event_date"
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#c94b6a] outline-none font-sans"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">
                  Ngày Âm Lịch (Hiển thị trên thiệp)
                </label>
                <input
                  type="text"
                  name="lunar_date"
                  placeholder="Ví dụ: Ngày 12 tháng 10 năm Ất Tỵ"
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#c94b6a] outline-none font-sans"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="text-sm font-medium text-gray-500">
                  Tổ chức tại
                </label>
                <select
                  name="location_type"
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#c94b6a] bg-gray-50 font-sans"
                >
                  <option value="nhà trai">Nhà Trai</option>
                  <option value="nhà gái">Nhà Gái</option>
                  <option value="nhà hàng">Nhà Hàng</option>
                  <option value="tư gia">Tư Gia</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-500">
                  Địa chỉ chi tiết
                </label>
                <input
                  type="text"
                  name="address"
                  placeholder="Số nhà, đường, xã/phường..."
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-[#c94b6a] outline-none font-sans"
                  required
                />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl space-y-3">
              <label className="text-sm font-semibold text-gray-600 flex items-center">
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  className="mr-2 text-red-500"
                />{" "}
                Bản đồ (Mã nhúng Iframe)
              </label>
              <textarea
                name="map_iframe"
                placeholder="Dán thẻ <iframe> từ Google Maps vào đây để khách dễ tìm đường..."
                onChange={handleChange}
                className="w-full h-24 p-4 rounded-xl border border-gray-200 focus:border-[#c94b6a] outline-none font-sans text-sm"
              ></textarea>
            </div>
          </section>

          {/* SECTION 4: HÌNH ẢNH & MEDIA */}
          <section className="space-y-6">
            <div className="flex items-center space-x-3 border-b border-pink-100 pb-2">
              <FontAwesomeIcon
                icon={faImages}
                className="text-[#c94b6a] text-xl"
              />
              <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wider">
                Hình Ảnh Kỷ Niệm
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group relative border-2 border-dashed border-gray-200 p-8 rounded-[2rem] hover:border-[#c94b6a] transition-all text-center bg-gray-50/50">
                <input
                  type="file"
                  onChange={(e) => setCoverImage(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="space-y-2">
                  <div className="text-[#c94b6a] text-3xl">📸</div>
                  <p className="font-bold text-gray-700">Ảnh Bìa Thiệp</p>
                  <p className="text-xs text-gray-400">
                    Định dạng JPG, PNG (Tối đa 5MB)
                  </p>
                  {coverImage && (
                    <p className="text-xs text-green-600 font-bold underline italic">
                      {coverImage.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="group relative border-2 border-dashed border-gray-200 p-8 rounded-[2rem] hover:border-[#c94b6a] transition-all text-center bg-gray-50/50">
                <input
                  type="file"
                  multiple
                  onChange={(e) => setAlbumImages(e.target.files)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="space-y-2">
                  <div className="text-blue-500 text-3xl">🖼️</div>
                  <p className="font-bold text-gray-700">Album Ảnh Cưới</p>
                  <p className="text-xs text-gray-400">
                    Tùng có thể chọn nhiều ảnh cùng lúc
                  </p>
                  {albumImages.length > 0 && (
                    <p className="text-xs text-green-600 font-bold underline italic">
                      Đã chọn {albumImages.length} ảnh
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="bg-gradient-to-r from-gray-50 to-pink-50 p-8 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-white">
          <div className="flex items-center text-sm text-gray-500 italic font-sans">
            <FontAwesomeIcon
              icon={faCheckCircle}
              className="mr-2 text-green-500"
            />
            Thông tin sẽ được mã hóa bảo mật
          </div>
          <div className="flex space-x-4 w-full md:w-auto">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex-1 md:flex-none px-8 py-3 rounded-full font-bold text-gray-500 hover:bg-white transition-all shadow-sm"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 md:flex-none px-12 py-3 bg-[#c94b6a] text-white rounded-full font-bold shadow-[0_10px_20px_rgba(201,75,106,0.3)] hover:scale-105 active:scale-95 transition-all disabled:bg-gray-400 disabled:scale-100 uppercase tracking-widest"
            >
              {loading ? "Đang lưu..." : "Khởi tạo sự kiện"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddWeddingEvent;
