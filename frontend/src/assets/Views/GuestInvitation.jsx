import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { publicApi } from "../api/axios";
import Sparkles from "../components/InvitationView/Sparkles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoadingState from "../components/LoadingState";
import { faHeart, faEnvelopeOpenText } from "@fortawesome/free-solid-svg-icons";

const GuestInvitation = () => {
  const { weddingSlug, guestNameSlug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);

  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        const res = await publicApi.get(
          `invitations/${weddingSlug}/${guestNameSlug}`
        );
        setData(res.data.data);
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

  if (loading) return <LoadingState />;
  if (!data || !data.wedding_event) return <ErrorState />;

  const wedding = data.wedding_event;

  return (
    <div className="min-h-screen bg-[#FFF5F7] overflow-x-hidden font-content">
      {!isOpen ? (
        /* --- MÀN HÌNH BÌA (COVER PAGE) --- */
        <div
          className={`fixed inset-0 z-[100] flex items-center justify-center bg-white transition-all duration-[800ms] ease-in-out ${
            isExiting
              ? "-translate-y-full opacity-0"
              : "translate-y-0 opacity-100"
          }`}
        >
          <div className="relative w-full max-w-md h-[85vh] rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-pink-50 md:mx-4">
            <img
              src={
                wedding.cover_image
                  ? `http://localhost:8000/storage/weddingevents/covers/${wedding.cover_image}`
                  : "https://images.pexels.com/photos/2253879/pexels-photo-2253879.jpeg"
              }
              className="absolute inset-0 w-full h-full object-cover"
              alt="Cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col items-center justify-end text-white p-8 pb-8 text-center">
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-[2.5rem] border border-white/20 w-full animate-[fadeInUp_1s_ease-out]">
                <p className="uppercase tracking-[0.4em] text-[10px] mb-2 opacity-90 font-sans">
                  Trân trọng kính mời
                </p>
                <h1 className="text-2xl font-bold mb-4 drop-shadow-lg">
                  {data.guest_name}
                </h1>
                <button
                  onClick={handleOpenInvitation}
                  className="bg-pink-500 hover:bg-pink-600 text-white w-full py-4 rounded-2xl font-bold shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 tracking-widest"
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
        <main className="relative z-10 max-w-2xl mx-auto bg-white shadow-2xl min-h-screen animate-[fadeIn_1.5s_ease-in] rounded-t-[3rem] mt-4">
          {/* <Sparkles /> */}

          {/* Header & Avatar */}
          <section className="py-10 px-3 text-center relative">
            <h3 className="text-xl italic text-gray-400 mb-2">
              Trân trọng kính mời quý khách
            </h3>
            <h1 className="text-4xl font-bold text-gray-800 mb-3">
              {data.guest_name}
            </h1>
            <p className="text-lg text-gray-600 italic px-6 mb-8 leading-relaxed">
              Tới dự bữa cơm thân mật mừng lễ thành hôn của hai vợ chồng tại
              chúng tôi
            </p>
            <div>
              <h2 className="font-title text-6xl md:text-8xl text-pink-600">
                {wedding.groom_name}
              </h2>
              <div className="relative my-8 flex items-center justify-center">
                {/* Lớp hào quang tỏa sáng phía sau */}
                <div className="absolute w-16 h-16 bg-pink-400 rounded-full blur-2xl opacity-40 animate-pulse"></div>

                {/* Trái tim chính với hiệu ứng đổ bóng tầng tầng lớp lớp */}
                <div className="relative text-5xl md:text-6xl text-pink-500 drop-shadow-[0_0_15px_rgba(236,72,153,0.8)] animate-wedding-heart">
                  <FontAwesomeIcon icon={faHeart} />

                  {/* Điểm sáng lung linh (Sparkle) */}
                  <div className="absolute -top-1 -right-1 text-yellow-200 text-xs animate-ping">
                    <FontAwesomeIcon icon={faHeart} className="text-[10px]" />
                  </div>
                </div>
              </div>
              <h2 className="font-title text-6xl md:text-8xl text-pink-600">
                {wedding.bride_name}
              </h2>
            </div>
          </section>

          {/* Thời gian & Địa điểm */}
          <section className="bg-pink-50/50 py-4 md:px-6 text-center rounded-[3rem] md:mx-2 border border-pink-100">
            <div className="mb-5">
              <h3 className="text-pink-500 font-bold tracking-[0.2em] uppercase">
                Thời gian lễ cưới
              </h3>
              <div className="space-y-3">
                <p className="text-4xl mx-auto font-bold text-gray-800 border border-3 mt-3 border-red-500 rounded-[50%] w-[100px] h-[100px] flex justify-center items-center pb-3">
                  {new Date(wedding.event_date).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="text-2xl text-gray-700 uppercase font-bold capitalize ">
                  {new Date(wedding.event_date).toLocaleDateString("vi-VN", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p className="text-pink-400 font-medium italic fonlt-bold">
                  (Tức ngày {wedding.lunar_date})
                </p>
              </div>
            </div>

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
                  className="w-full h-64 rounded-[2rem] overflow-hidden shadow-lg border-4 border-white mb-4"
                  dangerouslySetInnerHTML={{ __html: wedding.map_iframe }}
                />
              )}
            </div>
          </section>

          {/* Đại diện gia đình */}
          <section className="py-5 px-8 text-center bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-4 rounded-3xl bg-gray-100 border border-gray-100">
                <h4 className="text-pink-500 font-bold tracking-widest">
                  NHÀ TRAI
                </h4>
                <p className="text-lg text-gray-700 font-bold capitalize">
                  {wedding.groom_father || "Hạng A Lềnh"}
                </p>
                <p className="text-lg text-gray-700 font-bold capitalize">
                  {wedding.groom_mother || "Giàng Thị Lỳ"}
                </p>
                <p className="text-start text-lg font-bold text-gray-700">
                  Chú rể:{" "}
                  <span className="font-title text-pink-600 text-center italic">
                    {wedding.groom_name}
                  </span>
                </p>
              </div>
              <div className="p-4 rounded-3xl bg-gray-100 border border-gray-100">
                <h4 className="text-pink-500 font-bold tracking-widest uppercase">
                  NHÀ GÁI
                </h4>
                <p className="text-lg text-gray-700 font-bold capitalize">
                  {wedding.bride_father || "Ly A Phong"}
                </p>
                <p className="text-lg text-gray-700 font-bold capitalize">
                  {wedding.bride_mother || "Giàng Thị Vá"}
                </p>
                <p className="text-start text-lg font-bold text-gray-700">
                  Cô dâu:{" "}
                  <span className="font-title text-pink-600 text-center italic">
                    {" "}
                    {wedding.bride_name}
                  </span>
                </p>
              </div>
            </div>
            <p className="text-lg text-gray-600 italic px-6 leading-relaxed mt-5">
              Rất hân hạnh được đón tiếp!
            </p>
          </section>

          {/* Album Ảnh */}
          {wedding.album_image && wedding.album_image.length > 0 && (
            <section className="px-4 bg-white">
              <h3 className="font-title text-4xl text-start text-pink-600 text-center mb-3 italic">
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
                        `http://localhost:8000/storage/weddingevents/albums/${img}`
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
                  <button className="absolute top-6 right-6 text-white text-4xl">
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

          <footer className="py-16 text-center bg-gray-50 text-gray-400 text-[10px] tracking-[0.5em] uppercase rounded-b-[3rem]">
            Happy Wedding • {wedding.groom_name} & {wedding.bride_name}
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
`}</style>
    </div>
  );
};

const ErrorState = () => (
  <div className="h-screen flex items-center justify-center text-pink-400 font-content italic">
    Thiệp mời không còn hiệu lực hoặc đã bị gỡ.
  </div>
);

export default GuestInvitation;
