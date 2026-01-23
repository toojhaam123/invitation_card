import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
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
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import GuestInvitation from "./GuestInvitation";

const AddOrUpdateWeddingEvent = () => {
  const { eventId } = useParams();
  const [isPreview, setIsPreview] = useState(false);
  const isEditMode = Boolean(eventId);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    groom_name: "",
    bride_name: "",
    phone_contacts: "",
    groom_father: "",
    groom_mother: "",
    bride_father: "",
    bride_mother: "",
    event_date: "",
    lunar_date: "",
    location_type: "nhà trai",
    address: "",
    map_iframe: "",
    is_published: true,
  });

  const [coverImage, setCoverImage] = useState(null);
  const [albumImages, setAlbumImages] = useState([]);
  const [qrCodeBank, setQrCodeBank] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      const fetchDataEvent = async () => {
        try {
          const res = await privateApi.get(`events/${eventId}`);
          const data = res.data.data;
          setFormData({
            id: data.id,
            groom_name: data.groom_name || "",
            bride_name: data.bride_name || "",
            phone_contacts: data.phone_contacts || "",
            groom_father: data.groom_father || "",
            groom_mother: data.groom_mother || "",
            bride_father: data.bride_father || "",
            bride_mother: data.bride_mother || "",
            event_date: data.event_date ? data.event_date.slice(0, 16) : "", // Định dạng cho datetime-local
            lunar_date: data.lunar_date || "",
            location_type: data.location_type || "nhà trai",
            address: data.address || "",
            map_iframe: data.map_iframe || "",
            is_published: data.is_published,
          });
        } catch (error) {
          console.log("Lỗi khi lấy chi tiết sự kiện: ", error?.response?.data);
          alert("Không tìm thấy sự kiện cần sửa!");
          // navigate("/");
        }
      };
      fetchDataEvent();
    }
  }, [eventId, isEditMode]);

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
        data.append("album_image[]", file),
      );
    }
    if (qrCodeBank) data.append("qr_code_bank", qrCodeBank);

    try {
      await privateApi.post("/events", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(isEditMode ? "Cập nhập thành công!" : "Tạo sự kiện thành công!");
      navigate("/");
    } catch (error) {
      console.error("Lỗi thêm hoặc cập nhập!", error?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!isPreview ? (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-red-50 py-4 px-4 lg:px-8 font-serif">
          <div className="relative max-w-4xl mx-auto mb-6">
            {/* Nút xem tước khi tạo thông tin */}
            <button
              type="button"
              onClick={() => setIsPreview(true)}
              className="fixed right-4 top-4 z-50 flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-[#c94b6a] border border-pink-100 rounded-full shadow-sm hover:bg-[#c94b6a] hover:text-white transition-all active:scale-95 font-bold text-xs uppercase tracking-tight"
            >
              <FontAwesomeIcon icon={faEye} className="text-[10px]" />
              Xem trước
            </button>
            {/* Nút quay lại */}
            <button
              onClick={() => navigate(-1)}
              className="bg-gradient-to-r from-[#c94b6a] to-[#e65c7b] hover:to-[#a83a55] text-white px-3 py-1.5 md:px-6 rounded-full 
                    flex items-center gap-2 transition-all duration-300 shadow-[0_4px_15px_rgba(201,75,106,0.3)] 
                    active:scale-95 whitespace-nowrap shrink-0"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              <span className="hidden md:inline">Quay lại</span>
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
              <h1 className="text-2xl md:text-4xl font-bold uppercase tracking-[0.1em] md:tracking-[0.2em]">
                {isEditMode && <p>[Chỉnh sửa]</p>}
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
                  <h3 className="text-xl font-bold text-gray-800 uppercase tracking-wider">
                    Cặp Đôi Chính
                  </h3>
                </div>

                {/* Bọc cả hai vào một Card chung */}
                <div className="bg-[#fff5f7] p-8 rounded-[2.5rem] border border-pink-100 shadow-sm relative overflow-hidden">
                  {/* Icon trái tim trang trí ẩn dưới nền */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
                    <FontAwesomeIcon
                      icon={faHeart}
                      className="text-9xl text-[#c94b6a]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                    {/* Cột Chú Rể */}
                    <div className="space-y-1">
                      <label className="block text-sm font-bold text-blue-600 uppercase tracking-widest ml-1">
                        Chú Rể
                      </label>
                      <input
                        type="text"
                        name="groom_name"
                        placeholder="Nhập tên chú rể..."
                        onChange={handleChange}
                        value={formData.groom_name ? formData.groom_name : ""}
                        className="w-full px-5 py-4 rounded-2xl border-2 border-blue-100 focus:border-blue-500 focus:bg-white outline-none transition-all text-gray-900 bg-white/90 shadow-sm text-lg placeholder:text-gray-400"
                        required
                      />
                    </div>

                    {/* Icon kết nối giữa 2 input */}
                    <div className=" md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center mt-3 z-20">
                      <div className="relative">
                        {/* Vòng tròn trắng bọc ngoài */}
                        <div className="w-14 h-14 bg-white rounded-full shadow-lg border-2 border-pink-100 flex items-center justify-center">
                          {/* Icon Trái tim với hiệu ứng nhịp đập */}
                          <FontAwesomeIcon
                            icon={faHeart}
                            className="text-[#c94b6a] text-2xl animate-pulse"
                          />
                        </div>

                        {/* Hiệu ứng lan tỏa (Optional) */}
                        <div className="absolute inset-0 bg-pink-400 rounded-full animate-ping opacity-20"></div>
                      </div>
                    </div>

                    {/* Cột Cô Dâu */}
                    <div className="space-y-1">
                      <label className="block text-sm font-bold text-pink-600 uppercase tracking-widest ml-1">
                        Cô Dâu
                      </label>
                      <input
                        type="text"
                        name="bride_name"
                        placeholder="Nhập tên cô dâu..."
                        value={formData.bride_name ? formData.bride_name : ""}
                        onChange={handleChange}
                        className="w-full px-5 py-4 rounded-2xl border-2 border-pink-100 focus:border-pink-500 focus:bg-white outline-none transition-all text-gray-900 bg-white/90 shadow-sm text-lg placeholder:text-gray-400"
                        required
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 2: GIA ĐÌNH HAI BÊN */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Nhà Trai */}
                <div className="p-6 rounded-[2rem] bg-gradient-to-b from-blue-50 to-white border border-blue-100 shadow-sm">
                  <h3 className="text-blue-700 font-bold mb-6 flex items-center justify-center">
                    <span className="h-px w-8 bg-blue-200 mr-3"></span>
                    NHÀ TRAI
                    <span className="h-px w-8 bg-blue-200 ml-3"></span>
                  </h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      name="groom_father"
                      placeholder="Thân phụ: Ông ..."
                      value={formData.groom_father ? formData.groom_father : ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-blue-100 outline-none focus:ring-2 focus:ring-blue-300 transition-all font-sans"
                    />
                    <input
                      type="text"
                      name="groom_mother"
                      placeholder="Thân mẫu: Bà ..."
                      value={formData.groom_mother ? formData.groom_mother : ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-blue-100 outline-none focus:ring-2 focus:ring-blue-300 transition-all font-sans"
                    />
                  </div>
                </div>

                {/* Nhà Gái */}
                <div className="p-6 rounded-[2rem] bg-gradient-to-b from-pink-50 to-white border border-pink-100 shadow-sm">
                  <h3 className="text-pink-700 font-bold mb-6 flex items-center justify-center">
                    <span className="h-px w-8 bg-pink-200 mr-3"></span>
                    NHÀ GÁI
                    <span className="h-px w-8 bg-pink-200 ml-3"></span>
                  </h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      name="bride_father"
                      placeholder="Thân phụ: Ông ..."
                      value={formData.bride_father ? formData.bride_father : ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-pink-100 outline-none focus:ring-2 focus:ring-pink-300 transition-all font-sans"
                    />
                    <input
                      type="text"
                      name="bride_mother"
                      placeholder="Thân mẫu: Bà ..."
                      value={formData.bride_mother ? formData.bride_mother : ""}
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
                  <h3 className="text-xl font-bold text-gray-800 uppercase tracking-wider">
                    Thời Gian & Địa Điểm
                  </h3>
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
                      value={formData.event_date ? formData.event_date : ""}
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
                      value={formData.lunar_date ? formData.lunar_date : ""}
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
                      value={formData.location_type}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#c94b6a] outline-none font-sans"
                    >
                      <option value="">---Chọn địa điểm---</option>
                      <option value="nhà trai">Nhà Trai</option>
                      <option value="nhà gái">Nhà Gái</option>
                      <option value="nhà hàng">Nhà Hàng</option>
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
                      value={formData.address ? formData.address : ""}
                      onChange={handleChange}
                      className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-[#c94b6a] outline-none font-sans"
                      required
                    />
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl space-y-3">
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
                    value={formData.map_iframe ? formData.map_iframe : ""}
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
                  <h3 className="text-xl font-bold text-gray-800 uppercase tracking-wider">
                    Hình Ảnh Kỷ Niệm
                  </h3>
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
                        Bạn có thể chọn nhiều ảnh cùng lúc
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

              {/* SECTION: QR CODE BANK */}
              <section className="space-y-6">
                <div className="flex items-center space-x-3 border-b border-pink-100 pb-2">
                  <div className="text-[#c94b6a] text-xl">💳</div>
                  <h3 className="text-xl font-bold text-gray-800 uppercase tracking-wider">
                    Mừng Cưới Qua Ngân Hàng
                  </h3>
                </div>

                <div className="group relative border-2 border-dashed border-gray-200 p-8 rounded-[2rem] hover:border-[#c94b6a] transition-all text-center bg-gray-50/50">
                  <input
                    type="file"
                    onChange={(e) => setQrCodeBank(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept="image/*"
                  />
                  <div className="flex flex-col items-center space-y-3">
                    <div className="text-[#c94b6a] text-4xl mb-2">🏦</div>
                    <div>
                      <p className="font-bold text-gray-700">Mã QR Ngân Hàng</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {qrCodeBank
                          ? "Đã chọn mã QR mới"
                          : "Tải ảnh mã QR để nhận mừng cưới online"}
                      </p>
                    </div>

                    {qrCodeBank && (
                      <p className="text-xs text-[#c94b6a] font-bold underline italic">
                        {qrCodeBank.name}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              {/* SECTION: THÔNG TIN LIÊN HỆ */}
              <section className="space-y-6">
                <div className="flex items-center space-x-3 border-b border-pink-100 pb-2">
                  <div className="text-[#c94b6a] text-xl">📞</div>
                  <h3 className="text-xl font-bold text-gray-800 uppercase tracking-wider">
                    Thông Tin Liên Hệ
                  </h3>
                </div>

                <div className="bg-white/50 p-6 rounded-[2rem] border border-pink-50 shadow-sm">
                  <div className="relative group">
                    <label className="block text-sm font-semibold text-gray-600 mb-2 ml-1">
                      Số điện thoại liên lạc chính
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="phone_contacts"
                        placeholder="Ví dụ: 0912.xxx.xxx - 0988.xxx.xxx"
                        onChange={handleChange}
                        value={
                          formData.phone_contacts ? formData.phone_contacts : ""
                        }
                        className="w-full px-5 py-4 pl-12 rounded-2xl border-2 border-gray-100 focus:border-pink-400 focus:bg-white outline-none transition-all text-gray-900 bg-white/80 shadow-sm text-lg placeholder:text-gray-300"
                        required
                      />
                      {/* Icon điện thoại nằm bên trong input */}
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors">
                        <FontAwesomeIcon
                          icon={faMapMarkerAlt}
                          className="hidden"
                        />{" "}
                        {/* Đây là chỗ để icon nếu muốn */}
                        <span className="text-xl">📱</span>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-gray-400 italic ml-2">
                      * Số điện thoại này sẽ hiển thị trên thiệp để khách mời
                      tiện liên lạc khi cần hỏi đường hoặc xác nhận tham dự.
                    </p>
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
              <div className="flex items-center gap-3 w-full md:w-auto mt-">
                {/* Nút Hủy bỏ - Dùng Border mỏng thay vì bóng đổ để tạo sự tương phản */}
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="flex-1 md:flex-none md:px-8 py-3 rounded-full font-bold text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-gray-700 transition-all duration-300 text-sm md:text-base whitespace-nowrap"
                >
                  Hủy bỏ
                </button>
                {/* Nút Khởi tạo sự kiện - Nổi bật và chống bóp méo */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-[2] md:flex-none` shrink-0 md:px-12 py-3 bg-gradient-to-r from-[#c94b6a] to-[#e65c7b] text-white rounded-full font-bold shadow-[0_10px_20px_rgba(201,75,106,0.3)] 
              hover:shadow-[0_12px_25px_rgba(201,75,106,0.4)] hover:-translate-y-0.5 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:bg-gray-400 disabled:translate-y-0 
              disabled:scale-100 tracking-wide text-sm md:text-base whitespace-nowrap flex items-center justify-center gap-2"
                >
                  {loading && (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  )}
                  {loading
                    ? "Đang xử lý..."
                    : isEditMode
                      ? "Cập nhật sự kiện"
                      : "Khởi tạo sự kiện"}
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <GuestInvitation
          isPreview={isPreview}
          setIsPreview={setIsPreview}
          formData={{
            ...formData,
            cover_image: coverImage,
            album_image: albumImages,
            qr_code_bank: qrCodeBank,
          }}
        />
      )}
    </>
  );
};

export default AddOrUpdateWeddingEvent;
