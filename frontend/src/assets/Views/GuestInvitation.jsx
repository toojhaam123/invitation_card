import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { publicApi } from "../api/axios";
import Sparkles from "../components/InvitationView/Sparkles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoadingState from "../components/LoadingState";
import {
  faHeart,
  faMapMarkerAlt,
  faEnvelopeOpenText,
} from "@fortawesome/free-solid-svg-icons";

const GuestInvitation = () => {
  const { weddingSlug, guestNameSlug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isExiting, setIsExiting] = useState(false); // Xử lý hiệu ứng trượt bìa

  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        const res = await publicApi.get(
          `invitations/${weddingSlug}/${guestNameSlug}`
        );
        setData(res.data.data);
      } catch (error) {
        console.error("Lỗi tải thiệp", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvitation();
  }, [weddingSlug, guestNameSlug]);

  const handleOpenInvitation = () => {
    setIsExiting(true); // Kích hoạt hiệu ứng bay lên
    setTimeout(() => {
      setIsOpen(true); // Sau 800ms (khớp với thời gian transition) thì đổi sang trang nội dung
    }, 800);
  };

  if (loading) return <LoadingState />;
  if (!data || !data.wedding_event) return <ErrorState />;

  const wedding = data.wedding_event;

  return (
    <div className="min-h-screen bg-[#FFF5F7] font-serif overflow-x-hidden">
      {!isOpen ? (
        /* --- MÀN HÌNH BÌA (COVER PAGE) --- */
        <div
          className={`fixed inset-0 z-[100] flex items-center justify-center bg-white transition-all duration-[800ms] ease-in-out ${
            isExiting
              ? "-translate-y-full opacity-0"
              : "translate-y-0 opacity-100"
          }`}
        >
          <div className="relative w-full max-w-4xl h-[90vh] rounded-[2rem] overflow-hidden shadow-2xl border-8 border-pink-50 mx-4">
            <img
              src={
                wedding.cover_image
                  ? `http://localhost:8000/storage/weddingevents/covers/${wedding.cover_image}`
                  : "https://images.pexels.com/photos/2253879/pexels-photo-2253879.jpeg"
              }
              className="absolute inset-0 w-full h-full object-cover"
              alt="Cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col items-center justify-end text-white p-8 pb-12 text-center">
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 w-full max-w-[320px] animate-[fadeInUp_1s_ease-out]">
                <p className="uppercase tracking-[0.3em] text-[10px] mb-2 opacity-80">
                  Kính mời
                </p>
                <h2 className="text-2xl font-bold mb-6 text-white drop-shadow-lg">
                  {data.guest_name}
                </h2>
                <button
                  onClick={handleOpenInvitation}
                  className="bg-pink-500 hover:bg-pink-600 text-white w-full py-4 rounded-2xl font-bold shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  <FontAwesomeIcon icon={faEnvelopeOpenText} />
                  MỞ THIỆP
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* --- TRANG NỘI DUNG CHÍNH --- */
        <main className="relative z-10 max-w-4xl mx-auto bg-white shadow-2xl min-h-screen animate-[fadeIn_1.5s_ease-in]">
          <Sparkles />

          {/* Header: Tên Cô dâu & Chú rể */}
          <section className="py-16 px-6 text-center bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
            <div className="flex flex-col items-center justify-center space-y-2 mb-12">
              <h2 className="text-5xl md:text-7xl text-pink-600 font-extralight self-start ml-4 md:ml-20">
                {wedding.groom_name}
              </h2>
              <div className="text-4xl text-pink-300 my-2 animate-bounce">
                <FontAwesomeIcon icon={faHeart} />
              </div>
              <h2 className="text-5xl md:text-7xl text-pink-600 font-extralight self-end mr-4 md:mr-20">
                {wedding.bride_name}
              </h2>
            </div>

            <div className="relative inline-block mb-8">
              <img
                src={`http://localhost:8000/storage/invitations/${data.avatar}`}
                className="w-32 h-32 rounded-full border-4 border-pink-100 shadow-xl object-cover"
                alt="Guest"
              />
            </div>
            <h3 className="text-xl italic text-gray-500 mb-2">
              Trân trọng kính mời
            </h3>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {data.guest_name}
            </h1>
            <p className="text-lg text-gray-600 italic px-4">
              Tới dự bữa cơm thân mật chung vui cùng hai gia đình chúng tôi
            </p>
          </section>

          {/* Thông tin thời gian & Địa điểm */}
          <section className="grid md:grid-cols-2 gap-0 border-y-8 border-pink-50 text-center">
            <div className="p-12 bg-white border-b md:border-b-0 md:border-r border-pink-50">
              <h3 className="text-pink-500 font-bold tracking-widest uppercase mb-6">
                Lễ Thành Hôn
              </h3>
              <div className="space-y-4 text-gray-700">
                <p className="text-3xl font-medium">
                  {new Date(wedding.event_date).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="text-xl">
                  {new Date(wedding.event_date).toLocaleDateString("vi-VN", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p className="text-pink-400 italic">
                  (Tức ngày {wedding.lunar_date} Âm lịch)
                </p>
              </div>
            </div>
            <div className="p-12 bg-pink-50/30">
              <h3 className="text-pink-500 font-bold tracking-widest uppercase mb-6">
                Địa Điểm
              </h3>
              <p className="text-2xl font-bold text-gray-800 mb-4">
                {wedding.location_type}
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {wedding.address}
              </p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  wedding.address
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-pink-600 border-b border-pink-600 pb-1 hover:text-pink-800 transition-all"
              >
                <FontAwesomeIcon icon={faMapMarkerAlt} /> Chỉ đường trên Google
                Maps
              </a>
            </div>
          </section>

          {/* Đại diện hai gia đình */}
          <section className="py-16 px-8 text-center bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-2xl mx-auto">
              <div>
                <h4 className="text-pink-500 font-bold mb-4 border-b-2 border-pink-100 pb-2">
                  NHÀ TRAI
                </h4>
                <p className="text-lg text-gray-700 font-medium italic">
                  Ông: {wedding.groom_father}
                </p>
                <p className="text-lg text-gray-700 font-medium italic">
                  Bà: {wedding.groom_mother}
                </p>
              </div>
              <div>
                <h4 className="text-pink-500 font-bold mb-4 border-b-2 border-pink-100 pb-2">
                  NHÀ GÁI
                </h4>
                <p className="text-lg text-gray-700 font-medium italic">
                  Ông: {wedding.bride_father}
                </p>
                <p className="text-lg text-gray-700 font-medium italic">
                  Bà: {wedding.bride_mother}
                </p>
              </div>
            </div>
            <p className="mt-16 italic text-gray-400 text-sm">
              "Sự hiện diện của quý khách là niềm vinh dự của gia đình chúng
              tôi!"
            </p>
          </section>

          <footer className="py-12 text-center bg-gray-50 text-gray-400 text-[10px] tracking-[0.5em] uppercase border-t border-pink-50">
            Happy Wedding • {wedding.groom_name} & {wedding.bride_name}
          </footer>
        </main>
      )}

      {/* Tùng thêm các keyframes này vào index.css để animation chạy mượt nhé */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

const ErrorState = () => (
  <div className="h-screen flex items-center justify-center text-pink-400 font-serif italic">
    Thiệp mời không còn hiệu lực.
  </div>
);

export default GuestInvitation;
