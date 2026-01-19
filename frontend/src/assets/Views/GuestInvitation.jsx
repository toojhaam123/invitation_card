import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { publicApi } from "../api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoadingState from "../components/LoadingState";
import {
  faHeart,
  faPhone,
  faQrcode,
  faEnvelopeOpenText,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import useAuth from "../hooks/me";

const GuestInvitation = () => {
  const { me } = useAuth();
  const token = localStorage.getItem("token");
  const location = useLocation();
  const previewEventData = location.state?.previewEventData;
  const isPreview = Boolean(previewEventData);
  const navigate = useNavigate();
  console.log("form preview: ", previewEventData);

  const { weddingSlug, guestNameSlug } = useParams();
  const [data, setData] = useState(isPreview ? previewEventData : null);
  const [loading, setLoading] = useState(!isPreview);
  const [isOpen, setIsOpen] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  let [name, setName] = useState(isPreview ? "Khách mời mẫu" : null);
  const [content, setContent] = useState();
  const [guestbooks, setGuestBooks] = useState([]);
  const [error, setError] = useState();
  const [attendanceStatus, setAttendanceStatus] = useState(null);

  useEffect(() => {
    if (isPreview) return; // nếu chỉ là xem trước thì ko cần gọi API

    const fetchInvitation = async () => {
      try {
        const res = await publicApi.get(
          `invitations/${weddingSlug}/${guestNameSlug}`,
        );
        setData(res.data.data);
        setGuestBooks(res.data.data.guestbooks);
        setName(res.data.data.guest_name);
        setAttendanceStatus(
          res.data.data.is_attended === 1
            ? "attended"
            : res.data.data.is_attended === 0
              ? "adsent"
              : null,
        );
      } catch (error) {
        console.error("Lỗi tải thiệp", error?.response.data);
      } finally {
        setLoading(false);
      }
    };
    fetchInvitation();
  }, [weddingSlug, guestNameSlug]);

  const handleOpenInvitation = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsOpen(true);
    }, 800);
  };

  // Hàm này gọi API respond
  const handleAttendance = async (statusValue) => {
    if (isPreview) return alert("Đây chỉ là bản xem trước!");

    try {
      // statusValue sẽ truyền vào là 1 hoặc 0
      const res = await publicApi.post(
        `${weddingSlug}/${guestNameSlug}/respond`,
        {
          is_attended: statusValue,
        },
      );
      console.log("Trạng thai: ", res.data.data.is_attended);
      setAttendanceStatus(
        res.data.data.is_attended === 1
          ? "attended"
          : res.data.data.is_attended === 0
            ? "adsent"
            : null,
      );
    } catch (error) {
      console.error("Lỗi cập nhật tham gia!", error?.response.data);
    }
  };

  // Hàm gửi lời chúc
  const handleSendWish = async (e) => {
    if (isPreview) return alert("Đây chỉ là bản xem trước!");
    e.preventDefault();

    if (!content || content.trim() === "") {
      setError("Quý khách đừng quên nhập lời chúc trước khi gửi!");
      return;
    }

    if (token) {
      name = me?.name;
    }

    try {
      const res = await publicApi.post(
        `wedding/${weddingSlug}/${guestNameSlug}/guestbook`,
        {
          name: name,
          content: content,
        },
      );

      if (res.data.success) {
        alert(`Cảm ơn những lời chúc tốt đẹp của ${name}!`);
        setGuestBooks([res.data.data, ...guestbooks]);
        setContent("");
      } else {
        setError(res.data.message);
      }
    } catch (e) {
      setError(e?.response?.data?.message);
      console.log("Lỗi khi gửi lời chúc: ", e?.response?.data);
    }
  };

  if (loading) return <LoadingState />;
  console.log("Data: ", data);
  if (!isPreview) {
    if (!data || !data.wedding_event) return <ErrorState />;
  }
  const wedding = isPreview ? data : data.wedding_event;
  const logsCount = data.logs_count;

  return (
    <div className="min-h-screen bg-[#FFF5F7] overflow-x-hidden font-content">
      {!isOpen ? (
        /* --- MÀN HÌNH BÌA (COVER PAGE) --- */
        <div
          className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#FFF5F7] transition-all duration-[1200ms] ease-in-out ${
            isExiting
              ? "[transform:rotateY(-120deg)] [transform-origin:left] opacity-0 pointer-events-none"
              : "[transform:rotateY(0deg)] opacity-100"
          }`}
          style={{ perspective: "2000px" }} // Tạo độ sâu không gian 3D
        >
          <div className="relative w-full max-w-2xl h-[100vh] rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-pink-50 md:mx-4">
            <img
              src={
                wedding.cover_image
                  ? `http://localhost:8000/storage/weddingevents/covers/${wedding.cover_image}`
                  : "../../public/anh-nen-cuoi-hang-tung.jpg"
              }
              className="absolute inset-0 w-full h-full object-cover"
              alt="Cover"
            />
            <div className="w-full absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col items-center justify-end text-white md:px-32 p-1 pb-8 text-center">
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-[2.5rem] border border-white/20 w-full animate-[fadeInUp_1s_ease-out]">
                <p className="uppercase tracking-[0.4em] text-[10px] mb-2 opacity-90 font-sans">
                  Trân trọng kính mời
                </p>
                <h1 className="text-2xl font-bold mb-4 drop-shadow-lg">
                  {isPreview ? "Khách mời mẫu" : data.guest_name}
                </h1>
                <button
                  onClick={handleOpenInvitation}
                  className="bg-pink-500 hover:bg-pink-600 text-white w-full py-4 rounded-2xl font-bold shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 tracking-widest"
                >
                  <FontAwesomeIcon icon={faEnvelopeOpenText} />
                  MỞ THIỆP
                </button>
                {token && me?.id == wedding?.user_id && (
                  <p className="z-100">Đã xem {logsCount} lần</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* --- TRANG NỘI DUNG CHÍNH --- */
        <main className="relative z-10 max-w-2xl mx-auto bg-white rounded-[3rem] shadow-2xl min-h-screen animate-[fadeIn_1.5s_ease-in] rounded-t-[3rem] my-4">
          {/* Nút quay lại */}
          <div className="max-w-4xl mx-auto mb-6">
            <button
              onClick={() => navigate(-1)}
              className="mt-6 bg-gradient-to-r from-[#c94b6a] to-[#e65c7b] hover:to-[#a83a55] text-white px-4 md:px-6 py-2.5 rounded-full 
                              flex items-center gap-2 transition-all duration-300 shadow-[0_4px_15px_rgba(201,75,106,0.3)] 
                              active:scale-95 whitespace-nowrap shrink-0"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              <span className="hidden md:inline">Quay lại</span>
            </button>
          </div>
          {attendanceStatus && (
            <div className="fixed top-8 md:top-11 right-0 md:right-[29%] z-50 pointer-events-none animate-[stamp_0.5s_ease-out_forwards]">
              <div
                className={`md:px-4 px-2 py-1 border-2 rounded-xl font-black text-sm md:text-xl tracking-tighter opacity-80 md:rotate-[65deg] rotate-[70deg] 
        ${
          attendanceStatus === "attended"
            ? "border-green-600 text-green-600 shadow-[0_0_15px_rgba(22,163,74,0.2)]"
            : "border-red-600 text-red-600 shadow-[0_0_15px_rgba(220,38,38,0.2)]"
        }`}
              >
                <div className="flex flex-col md:text-xs text-[10px] items-center">
                  <span>
                    {attendanceStatus === "attended"
                      ? "Sẽ tham dự"
                      : "Vắng mặt"}
                  </span>
                </div>
                <div className="h-[2px] w-full bg-current opacity-30 md:my-0.5"></div>
              </div>
            </div>
          )}

          {/* Header  */}
          <section className="py-5 px-1 text-center relative">
            <h3 className="text-xl italic text-gray-700 mb-2">
              Trân trọng kính mời
            </h3>
            <h1 className="text-3xl font-bold text-gray-800 mb-3">
              {isPreview ? "Khách mời mẫu" : data.guest_name}
            </h1>
            <p className="text-lg text-gray-700 italic px-6 mb-3 leading-relaxed">
              Tới dự bữa cơm thân mật mừng lễ thành hôn của hai vợ chồng
            </p>

            {/* KHUNG ẢNH BAO QUANH TÊN CÔ DÂU CHÚ RỂ */}
            <div className="relative md:py-12 py-6 md:mx-2 rounded-[2rem] overflow-hidden shadow-inner border-4 border-white">
              {/* Ảnh nền cô dâu chú rẻ */}
              <div className="absolute inset-0 z-0">
                <img
                  src={
                    wedding.cover_image
                      ? `http://localhost:8000/storage/weddingevents/covers/${wedding.cover_image}`
                      : "../../public/anh-nen-cuoi-hang-tung.jpg"
                  }
                  className="w-full h-full object-cover opacity-40"
                  alt="Background"
                />
              </div>

              {/* Nội dung tên nằm trên cùng */}
              <div className="relative z-10 space-y-2">
                <h2 className="font-title text-6xl md:text-8xl text-pink-600 drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)]">
                  {wedding.groom_name}
                </h2>

                {/* Trái tim giữa */}
                <div className="relative flex items-center justify-center py-2">
                  <div className="absolute w-14 h-14 bg-pink-400 rounded-full blur-2xl opacity-40 animate-pulse"></div>
                  <div className="relative text-5xl text-pink-500 drop-shadow-[0_0_15px_rgba(236,72,153,0.8)] animate-wedding-heart">
                    <FontAwesomeIcon icon={faHeart} />
                  </div>
                </div>

                <h2 className="font-title text-6xl md:text-8xl text-pink-600 drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)]">
                  {wedding.bride_name}
                </h2>
              </div>
            </div>
          </section>

          {/* Thời gian & Địa điểm */}
          <section className="bg-pink-100/50 py-4 md:px-6 px-4 text-center rounded-[3rem] md:mx-2 border border-pink-100">
            <div className="mb-5">
              <h3 className="text-pink-500 font-bold tracking-[0.2em] uppercase">
                Thời gian lễ cưới
              </h3>
              <div className="space-y-3">
                <div className="flex flex-col items-center">
                  {/* Chữ "Hồi" nhỏ phía trên */}

                  <p className="text-2xl mx-auto font-bold text-gray-800 border-2 border-red-500 rounded-full w-28 h-28 flex flex-col justify-center items-center shadow-inner bg-white leading-tight">
                    {(() => {
                      const date = new Date(wedding.event_date);
                      let hours = date.getHours();
                      const minutes = date
                        .getMinutes()
                        .toString()
                        .padStart(2, "0");
                      const period = hours >= 12 ? "Chiều" : "Sáng";
                      const hourStr = hours.toString().padStart(2, "0");

                      return (
                        <>
                          <span className="text-sm uppercase font-bold text-gray-500 z-10">
                            Hồi
                          </span>
                          <span className="text-3xl font-black text-red-500 tracking-tighter tabular-nums">
                            {hourStr}:{minutes}
                          </span>
                          <span className="text-sm uppercase text-gray-500 mt-2">
                            {period}
                          </span>
                        </>
                      );
                    })()}
                  </p>
                </div>
                {/* Thứ ngày, tháng, năm */}
                <p className="text-xl font-bold text-gray-800 mb-5 capitalize px-2 leading-tight">
                  {(() => {
                    const date = new Date(wedding.event_date);
                    const weekday = date.toLocaleDateString("vi-VN", {
                      weekday: "long",
                    });
                    const day = date.getDate();
                    const month = date.getMonth() + 1; // Tháng trong JS bắt đầu từ 0
                    const year = date.getFullYear();

                    return `${weekday}, ngày ${day}, tháng ${month}, năm ${year}`;
                  })()}
                </p>
                <p className="text-pink-400 font-medium italic fonlt-bold">
                  (Tức ngày {wedding.lunar_date})
                </p>
              </div>
            </div>
            {/* Đường viền ngang cách */}
            <div className="h-[1px] bg-pink-200 w-1/2 mx-auto mb-5"></div>

            <div>
              <h3 className="text-pink-500 font-bold tracking-[0.2em] uppercase mb-2">
                Địa điểm tổ chức
              </h3>
              <p className="text-2xl font-bold text-gray-800 mb-3 capitalize">
                Tại: {wedding.location_type}
              </p>
              <p className="text-2xl font-bold text-gray-800 mb-5 capitalize uppercase">
                {wedding.address}
              </p>

              {/* Map Iframe */}
              {wedding.map_iframe && (
                <div
                  className="w-full h-64 rounded-[2rem] overflow-hidden shadow-lg border-4 border-white mb-3"
                  dangerouslySetInnerHTML={{ __html: wedding.map_iframe }}
                />
              )}
            </div>
          </section>

          {/* Đại diện gia đình */}
          <section className="pt-5 pb-2 px-4 text-center bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-4 rounded-3xl bg-gray-100 border border-gray-100">
                <h4 className="text-pink-500 font-bold tracking-widest">
                  NHÀ TRAI
                </h4>
                <p className="text-lg text-gray-700 font-bold capitalize">
                  {wedding.groom_father || "..."}
                </p>
                <p className="text-lg text-gray-700 font-bold capitalize">
                  {wedding.groom_mother || "..."}
                </p>
                <p className="text-start text-lg font-bold text-gray-700">
                  Chú rể:{" "}
                  <span className="font-title text-pink-600 text-lg text-center italic">
                    {wedding.groom_name}
                  </span>
                </p>
              </div>
              <div className="p-4 rounded-3xl bg-gray-100 border border-gray-100">
                <h4 className="text-pink-500 font-bold tracking-widest uppercase">
                  NHÀ GÁI
                </h4>
                <p className="text-lg text-gray-700 font-bold capitalize">
                  {wedding.bride_father || "..."}
                </p>
                <p className="text-lg text-gray-700 font-bold capitalize">
                  {wedding.bride_mother || "..."}
                </p>
                <p className="text-start text-lg font-bold text-gray-700">
                  Cô dâu:{" "}
                  <span className="font-title text-pink-600 text-lg text-center italic">
                    {" "}
                    {wedding.bride_name}
                  </span>
                </p>
              </div>
            </div>
            <p className="text-2xl font-title text-pink-600 italic px-6 leading-relaxed mt-6 animate-bounce">
              Sự hiện diện của quý khách là niềm hạnh phúc đối với chúng tôi!
            </p>
          </section>

          {/* Đường viền ngang cách */}
          <div className="h-[1px] bg-pink-200 w-1/2 mx-auto mb-5"></div>

          {/* --- PHẦN XÁC NHẬN THAM DỰ (RSVP) --- */}
          <section className="mb-6 bg-gradient-to-b from-transparent via-pink-50/50 to-transparent text-center">
            <h3 className="font-title text-4xl text-pink-600 mb-2 italic">
              Xác nhận tham dự
            </h3>
            <p className="text-gray-600 text-lg mb-6 italic px-4">
              Để việc đón tiếp được chu đáo, rất mong nhận được sự phản hồi từ
              quý khách!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
              {/* Nút Sẽ tham gia */}
              <button
                disabled={isPreview}
                onClick={() => {
                  handleAttendance(1);
                  alert("Cảm ơn quý khác đã xác nhận tham dự! ❤️");
                }} // Tùng có thể thay bằng logic gọi API sau này
                className="group relative w-full sm:w-48 py-4 bg-pink-500 text-white rounded-2xl font-bold shadow-[0_10px_20px_rgba(236,72,153,0.3)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <FontAwesomeIcon
                  icon={faHeart}
                  className="text-white animate-pulse"
                />
                SẼ THAM GIA
              </button>

              {/* Nút Không tham gia */}
              <button
                disabled={isPreview}
                onClick={() => {
                  handleAttendance(0);
                  alert(
                    "Tiếc quá nhỉ, hẹn gặp quý khách vào dịp gần nhất nhé! ❤️",
                  );
                }}
                className="w-full sm:w-48 py-4 bg-white text-pink-400 border-2 border-pink-200 rounded-2xl font-bold shadow-sm transition-all hover:bg-pink-50 active:scale-95 flex items-center justify-center gap-2"
              >
                KHÔNG THAM GIA
              </button>
            </div>
          </section>

          {/* Đường viền ngang cách */}
          <div className="h-[1px] bg-pink-200 w-1/2 mx-auto mb-5"></div>

          {/* Album Ảnh */}
          {wedding.album_image && wedding.album_image.length > 0 && (
            <section className="px-4 bg-white">
              <h3 className="text-pink-500 font-bold tracking-[0.2em] uppercase mb-4">
                Album Ảnh Cưới
              </h3>
              <div
                className="flex overflow-x-auto gap-1 pb-6 snap-x scrollbar-hide"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {wedding.album_image.map((img, index) => (
                  <div
                    key={index}
                    onClick={() =>
                      setSelectedImg(
                        `http://localhost:8000/storage/weddingevents/albums/${img}`,
                      )
                    }
                    className="flex-shrink-0 w-64 aspect-[3/4] overflow-hidden rounded-[2rem] shadow-lg border-4 border-pink-50 snap-center cursor-pointer"
                  >
                    <img
                      src={`http://localhost:8000/storage/weddingevents/albums/${img}`}
                      className="w-full h-full object-cover"
                      alt={`Wedding ${index}`}
                    />
                  </div>
                ))}
              </div>
              {/* --- MODAL PHÓNG TO ẢNH --- */}
              {selectedImg && (
                <div
                  className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4 animate-[fadeIn_0.3s_ease-out]"
                  onClick={() => setSelectedImg(null)} // Bấm ra ngoài để đóng
                >
                  <button className="absolute top-4 right-5 text-white/80 hover:text-white text-4xl px-3 py-1 rounded-full bg-transparent hover:bg-white/10 transition-all duration-300">
                    &times;
                  </button>

                  <img
                    src={selectedImg}
                    className="max-w-full max-h-[90vh] rounded-lg shadow-2xl transition-transform duration-300 md:max-w-4xl"
                    alt="Full size"
                    onClick={(e) => e.stopPropagation()} // Ngăn đóng khi bấm vào ảnh
                  />
                </div>
              )}
            </section>
          )}

          {/* Đường viền ngang cách */}
          <div className="h-[1px] bg-pink-200 w-1/2 mx-auto mb-5"></div>

          {/* --- PHẦN GỬI LỜI CHÚC --- */}
          <section className=" px-4 bg-white relative overflow-hidden mb-4">
            {/* Hoa văn trang trí nhẹ */}
            <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
              <FontAwesomeIcon
                icon={faHeart}
                className="text-8xl text-pink-200"
              />
            </div>

            <div className="mx-auto text-center relative z-10">
              <h3 className="font-title text-4xl text-pink-600 mb-2 italic">
                Gửi lời chúc
              </h3>
              <p className="text-gray-500 text-lg mb-4 italic">
                Những lời chúc tốt đẹp từ quý khác là món quà vô giá đối với
                chúng mình
              </p>

              <form
                onSubmit={handleSendWish}
                className="space-y-4 max-w-md mx-auto"
              >
                {error && (
                  <span className="text-red-500 font-content text-sm italic">
                    {error}
                  </span>
                )}
                <textarea
                  disabled={isPreview}
                  placeholder={`Mời ${name} nhập lời chúc tại đây...`}
                  name="content"
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    if (e.target.value) setError("");
                  }}
                  className="w-full p-4 rounded-2xl border-2 border-pink-50 focus:border-pink-300 focus:ring-0 outline-none transition-all h-32 text-gray-700 bg-pink-50/20 shadow-inner italic"
                ></textarea>

                <button
                  disabled={isPreview}
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-2xl font-bold shadow-lg hover:shadow-pink-200 transition-all active:scale-95"
                >
                  GỬI LỜI CHÚC
                </button>
              </form>
            </div>
          </section>

          {/* --- DANH SÁCH LỜI CHÚC (WISHES WALL) --- */}
          <section className="pb-8 px-4 bg-white">
            <div className="max-w-md mx-auto">
              {/* Đường kẻ ngăn cách nhẹ nhàng */}
              <div className="flex items-center gap-4 mb-4">
                <div className="h-[1px] flex-1 bg-pink-200"></div>
                <span className="text-pink-500 text-lg italic font-content">
                  Lời chúc từ người thân thương
                </span>
                <div className="h-[1px] flex-1 bg-pink-200"></div>
              </div>

              {/* Danh sách lời chúc - Cuộn dọc mượt mà */}
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-hide">
                {guestbooks?.map((wish) => (
                  <div
                    key={wish.id}
                    className="bg-pink-50/30 p-5 rounded-3xl border border-pink-100/50 relative group transition-all hover:bg-white hover:shadow-md"
                  >
                    {/* Dấu nháy trang trí */}
                    <span className="absolute -top-3 left-4 text-4xl text-pink-200 opacity-50 font-serif">
                      “
                    </span>

                    <p className="text-gray-700 italic leading-relaxed mb-3 relative z-10 text-lg">
                      {wish.content}
                    </p>

                    <div className="flex items-center justify-end gap-2">
                      <div className="h-[1px] w-4 bg-pink-300"></div>
                      <p className="font-bold text-pink-500 text-xs uppercase tracking-wider">
                        {wish.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Thông báo nếu chưa có lời chúc nào */}
              {guestbooks?.length === 0 && (
                <p className="text-center border-bottom-1 text-gray-400 italic text-sm">
                  Chưa có lời chúc nào
                </p>
              )}
            </div>
          </section>

          <footer className="pt-2 text-center bg-gray-50 rounded-b-[3rem] px-4 pb-10">
            {/* QR và liên hệ */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto md:mx-4">
              {/* Thẻ QR Code Ngân hàng */}
              {wedding.qr_code_bank && (
                <div className="bg-white w-full p-6 rounded-3xl shadow-sm border border-pink-50 flex flex-col items-center text-center transition-all hover:shadow-md">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                    <FontAwesomeIcon
                      icon={faQrcode}
                      className="text-pink-500 text-xl"
                    />
                  </div>
                  <div className="text-center mb-6">
                    <p className="text-pink-600 font-medium italic text-sm md:text-base leading-relaxed">
                      "Mọi sự thương yêu xin vui lòng ghi rõ nội dung{" "}
                      <br className="hidden sm:block" />
                      để chúng mình lưu giữ kỷ niệm ạ!"
                    </p>
                    <div className="w-10 h-[1px] bg-pink-200 mx-auto mt-3"></div>
                  </div>

                  <div className="relative group">
                    <img
                      src={`http://localhost:8000/storage/weddingevents/qrcode/${wedding.qr_code_bank}`}
                      alt="QR Code"
                      className="w-40 h-40 object-cover rounded-xl border-4 border-gray-50 shadow-inner group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 rounded-xl bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                  </div>
                  <p className="mt-3 text-xs text-gray-400 italic">
                    Quét mã để gửi lời chúc và quà cưới
                  </p>
                </div>
              )}

              {/* Thẻ Liên hệ */}
              {wedding?.phone_contacts && (
                <section className="bg-white p-6 rounded-3xl shadow-sm border border-pink-50 flex flex-col items-center text-center justify-center transition-all hover:shadow-md">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                    <FontAwesomeIcon
                      icon={faPhone}
                      className="text-blue-400 text-xl"
                    />
                  </div>
                  <h3 className="text-gray-800 font-bold mb-3 uppercase tracking-wider text-sm">
                    Hỗ trợ & Liên hệ
                  </h3>
                  <div className="space-y-2">
                    <p className="text-gray-600 font-medium">
                      {wedding.phone_contacts}
                    </p>
                    <a
                      href={`tel:${wedding.phone_contacts}`}
                      className="inline-block mt-2 px-6 py-2 bg-blue-50 text-blue-500 rounded-full text-sm font-semibold hover:bg-blue-100 transition-colors"
                    >
                      Gọi ngay
                    </a>
                  </div>
                  <p className="mt-4 text-xs text-gray-400 italic">
                    Liên hệ nếu bạn cần chỉ đường hoặc hỗ trợ
                  </p>
                </section>
              )}
            </div>

            {/* Biểu tượng nhỏ xinh ở trên */}
            <div className="text-pink-200 text-xs mb-4 mt-8 tracking-[0.3em] flex items-center justify-center gap-2">
              <div className="h-[1px] w-8 bg-pink-100"></div>
              <FontAwesomeIcon icon={faHeart} />
              <div className="h-[1px] w-8 bg-pink-100"></div>
            </div>
            <p className="text-gray-400 text-[10px] tracking-[0.4em] uppercase font-sans">
              {wedding.groom_name} <span className="text-pink-300 mx-1">❤</span>{" "}
              {wedding.bride_name}
            </p>
          </footer>
        </main>
      )}

      <style>{`
        /* Hiệu ứng trái tim lung linh */
        @keyframes wedding-heart {
          0%, 100% { 
          transform: scale(1); 
          filter: brightness(1); 
          }
          50% { 
            transform: scale(1.15); 
            filter: brightness(1.2) drop-shadow(0 0 20px rgba(236,72,153,1)); 
          }
        }
        .fixed {
          backface-visibility: hidden; /* Giúp không bị giật hình khi xoay 3D */
          -webkit-backface-visibility: hidden;
        }
        .animate-wedding-heart {
          animation: wedding-heart 2s ease-in-out infinite;
        }

        /* Hiệu ứng xuất hiện từ dưới lên */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Hiệu ứng hiện dần */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Ẩn thanh cuộn cho album ảnh ngang */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @keyframes stamp {
          0% {
            opacity: 0;
            transform: scale(3) rotate(0deg);
          }
          100% {
            opacity: 0.8;
            transform: scale(1) rotate(-20deg);
          }
        }
    `}</style>
    </div>
  );
};

const ErrorState = () => (
  <div className="h-screen flex items-center justify-center text-pink-400 bg-pink-100 font-content italic">
    Thiệp mời không còn hiệu lực hoặc đã bị gỡ.
  </div>
);

export default GuestInvitation;
