import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { publicApi } from "../api/axios";
import Sparkles from "../components/InvitationView/Sparkles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faMapMarkerAlt,
  faClock,
  faCalendarAlt,
  faRing,
} from "@fortawesome/free-solid-svg-icons";

const GuestInvitation = () => {
  const { weddingSlug, guestNameSlug } = useParams();
  const [data, setData] = useState(null);
  const [daysLeft, setDaysLeft] = useState(0);
  const [loading, setLoading] = useState(true);

  const calculateCountdown = (date) => {
    const diff = new Date(date) - new Date();
    setDaysLeft(Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24))));
  };

  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        const res = await publicApi.get(
          `invitations/${weddingSlug}/${guestNameSlug}`
        );
        const invitationData = res.data.data;
        setData(invitationData);
        if (invitationData?.wedding_event?.event_date) {
          calculateCountdown(invitationData.wedding_event.event_date);
        }
      } catch (error) {
        console.error("Không tìm thấy thiệp", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvitation();
  }, [weddingSlug, guestNameSlug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF5F7]">
        <div className="relative">
          <div className="w-24 h-24 border-2 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
          <FontAwesomeIcon
            icon={faHeart}
            className="absolute inset-0 m-auto text-pink-400 animate-pulse text-2xl"
          />
        </div>
        <p className="mt-6 text-[#D67B8C] font-serif italic tracking-widest animate-pulse">
          Đang chuẩn bị thiệp hồng...
        </p>
      </div>
    );
  }

  if (!data || !data.wedding_event) {
    return (
      <div className="h-screen flex items-center justify-center font-serif text-gray-500">
        Thiệp mời không còn hiệu lực.
      </div>
    );
  }

  const wedding = data.wedding_event;

  return (
    <div className="relative min-h-screen bg-[#FFF0F3] text-[#555] overflow-x-hidden font-sans">
      {/* Background Texture & Sparkles */}
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')] opacity-30 z-0" />
      <Sparkles />

      <main className="relative z-10 max-w-lg mx-auto bg-white shadow-[0_0_60px_rgba(214,123,140,0.2)] min-h-screen border-x border-pink-50">
        {/* 1. HEADER - LUXURY BORDER */}
        <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-pink-200 via-pink-400 to-pink-200 z-50"></div>

        {/* 2. HERO SECTION */}
        <section className="relative h-[80vh] flex items-center justify-center overflow-hidden group">
          <div className="absolute inset-0 border-[20px] border-white z-20 m-6 shadow-[inset_0_0_15px_rgba(0,0,0,0.1)]"></div>
          <img
            src={
              wedding.cover_image
                ? `http://localhost:8000/storage/weddingevents/covers/${wedding.cover_image}`
                : "https://images.pexels.com/photos/2253879/pexels-photo-2253879.jpeg"
            }
            className="absolute inset-0 w-full h-full object-cover animate-slowZoom transition-transform duration-[10s]"
            alt="Wedding Cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 z-10"></div>

          <div className="relative z-30 text-center text-white px-6 mt-20">
            <FontAwesomeIcon
              icon={faRing}
              className="text-pink-300 text-3xl mb-4 drop-shadow-md"
            />
            <h3 className="text-xs tracking-[0.6em] uppercase mb-4 font-bold opacity-90 drop-shadow-md">
              Save The Date
            </h3>
            <h1 className="font-serif text-5xl md:text-6xl mb-6 leading-tight drop-shadow-lg">
              {wedding.groom_name} <br />
              <span className="text-3xl font-light italic text-pink-200">
                &
              </span>{" "}
              <br />
              {wedding.bride_name}
            </h1>
            <div className="w-24 h-[1px] bg-white/60 mx-auto my-6 shadow-sm"></div>
            <p className="text-xl tracking-[0.3em] font-light drop-shadow-md">
              {new Date(wedding.event_date).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
          </div>
        </section>

        {/* 3. INVITATION MESSAGE - LUNG LINH */}
        <section className="py-24 px-10 text-center relative bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
          <div className="mb-12 animate-fadeInUp">
            <div className="relative inline-block">
              <img
                src={`http://localhost:8000/storage/invitations/${data.avatar}`}
                className="w-28 h-28 rounded-full mx-auto mb-6 object-cover border-[6px] border-[#FFF5F7] shadow-[0_10px_25px_rgba(214,123,140,0.3)]"
                alt="Guest"
              />
              <div className="absolute -bottom-2 -right-2 bg-pink-500 text-white w-10 h-10 rounded-full flex items-center justify-center border-4 border-white">
                <FontAwesomeIcon icon={faHeart} size="sm" />
              </div>
            </div>
            <p className="font-serif italic text-[#D67B8C] text-xl mb-2">
              Thân mời bạn,
            </p>
            <h2 className="text-4xl font-serif text-[#333] mb-8">
              {data.guest_name}
            </h2>
            <div className="max-w-[150px] h-[2px] bg-gradient-to-r from-transparent via-pink-200 to-transparent mx-auto"></div>
          </div>

          <p className="text-[#777] leading-[2] font-light italic text-lg px-4">
            "Hạnh phúc không phải là điểm đến, <br />
            mà là hành trình chúng ta cùng đi bên nhau. <br />
            Trân trọng kính mời bạn đến chung vui cùng gia đình chúng tôi!"
          </p>
        </section>

        {/* 4. DATE & TIME SECTION - BOX SANG TRỌNG */}
        <section className="px-8 py-16 bg-gradient-to-b from-white to-[#FFF5F7]">
          <div className="bg-white border-2 border-pink-100 rounded-[40px] p-10 text-center shadow-[0_15px_40px_rgba(214,123,140,0.1)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-pink-100 opacity-50"></div>

            <div className="mb-10">
              <FontAwesomeIcon
                icon={faCalendarAlt}
                className="text-pink-400 mb-4 text-2xl"
              />
              <h4 className="text-[10px] uppercase tracking-[0.4em] text-pink-300 mb-3 font-black">
                Thời gian cử hành
              </h4>
              <p className="text-2xl font-serif text-[#444] mb-1">
                {new Date(wedding.event_date).toLocaleDateString("vi-VN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p className="text-[#D67B8C] font-serif italic text-base">
                (Tức ngày {wedding.lunar_date})
              </p>
            </div>

            <div className="flex justify-between items-center py-8 border-y border-pink-50">
              <div className="flex-1">
                <FontAwesomeIcon
                  icon={faClock}
                  className="text-pink-200 mb-2"
                />
                <p className="font-bold text-xl text-gray-700">
                  {new Date(wedding.event_date).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="text-[10px] uppercase text-gray-400">
                  Giờ làm lễ
                </p>
              </div>
              <div className="h-12 w-[1px] bg-pink-100"></div>
              <div className="flex-1">
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  className="text-pink-200 mb-2"
                />
                <p className="font-bold text-xl text-gray-700 capitalize">
                  {wedding.location_type}
                </p>
                <p className="text-[10px] uppercase text-gray-400">Địa điểm</p>
              </div>
            </div>

            <div className="mt-10">
              <p className="text-gray-500 font-light text-base leading-relaxed px-2">
                <span className="block text-pink-400 font-bold mb-1 italic">
                  Địa chỉ:
                </span>
                {wedding.address}
              </p>
            </div>
          </div>
        </section>

        {/* 5. ALBUM - HIỆU ỨNG LUNG LINH */}
        {wedding.album_image && wedding.album_image.length > 0 && (
          <section className="py-20 px-6">
            <div className="flex items-center gap-4 mb-12">
              <div className="flex-1 h-[1px] bg-pink-100"></div>
              <h3 className="font-serif text-3xl text-[#444]">Khoảnh Khắc</h3>
              <div className="flex-1 h-[1px] bg-pink-100"></div>
            </div>
            <div className="columns-2 gap-4 space-y-4">
              {wedding.album_image.map((img, index) => (
                <div
                  key={index}
                  className="break-inside-avoid rounded-2xl overflow-hidden shadow-md border-4 border-white transition-transform hover:scale-[1.03] duration-500"
                >
                  <img
                    src={`http://localhost:8000/storage/weddingevents/albums/${img}`}
                    className="w-full h-auto object-cover"
                    alt="Wedding Gallery"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. COUNTDOWN BOX */}
        <section className="py-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-pink-500/5 -skew-y-6 transform origin-right"></div>
          <div className="relative z-10">
            <h3 className="text-xs uppercase tracking-[0.5em] text-[#D67B8C] mb-10 font-black">
              Ngày vui sắp đến
            </h3>
            <div className="inline-flex items-center gap-4 bg-white p-8 rounded-[30px] shadow-xl border border-pink-50">
              <div className="text-center">
                <span className="block text-5xl font-serif text-[#D67B8C] mb-1">
                  {daysLeft}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-gray-400">
                  Ngày hạnh phúc
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 7. MAP - FULL WIDTH GỌN GÀNG */}
        {wedding.map_iframe && wedding.map_iframe !== "Frame" && (
          <section className="p-6">
            <div
              className="rounded-[35px] overflow-hidden shadow-lg border-8 border-white h-72 grayscale-[0.3] hover:grayscale-0 transition-all duration-700"
              dangerouslySetInnerHTML={{ __html: wedding.map_iframe }}
            />
          </section>
        )}

        {/* 8. RSVP FOOTER - NÚT BẤM SANG CHẢNH */}
        <section className="py-24 px-10 text-center">
          <div className="bg-gradient-to-br from-[#4A4A4A] to-[#2D2D2D] text-white p-14 rounded-[60px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-pink-500/10 rounded-full -mr-20 -mt-20 blur-2xl"></div>
            <h3 className="text-3xl font-serif mb-6 relative z-10">
              Bạn sẽ đến chứ?
            </h3>
            <p className="text-gray-400 text-sm mb-12 font-light leading-relaxed tracking-wide">
              Sự hiện diện của bạn là món quà ý nghĩa nhất <br /> mà chúng tôi
              mong nhận được.
            </p>
            <button
              onClick={() =>
                alert(
                  "Hệ thống đã ghi nhận sự tham dự của " + data.guest_name + "!"
                )
              }
              className="group relative overflow-hidden bg-white text-black px-12 py-5 rounded-full font-bold uppercase tracking-[0.2em] text-[10px] transition-all duration-300 hover:bg-pink-500 hover:text-white"
            >
              <span className="relative z-10">Xác Nhận Tham Dự</span>
              <div className="absolute inset-0 bg-pink-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
          </div>

          <footer className="mt-24 pb-10">
            <div className="flex justify-center gap-2 text-pink-200 mb-6">
              <FontAwesomeIcon icon={faHeart} size="xs" />
              <FontAwesomeIcon icon={faHeart} size="xs" />
              <FontAwesomeIcon icon={faHeart} size="xs" />
            </div>
            <p className="text-gray-300 text-[10px] tracking-[0.8em] uppercase font-light">
              Made with Love by Tung
            </p>
          </footer>
        </section>
      </main>
    </div>
  );
};

export default GuestInvitation;
