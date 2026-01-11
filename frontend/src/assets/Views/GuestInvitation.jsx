import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { publicApi } from "../api/axios";
import Sparkles from "../components/InvitationView/Sparkles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const GuestInvitation = () => {
  const { slug } = useParams();
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
        const res = await publicApi.get(`invitations/${slug}`);
        setData(res.data.data);
        calculateCountdown(res.data.data?.event_date);
      } catch (error) {
        console.error("Không tìm thấy thiệp", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvitation();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-pink-50">
        <div className="w-16 h-16 border-4 border-[#c94b6a] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-[#c94b6a] font-serif italic">
          Đang mở thiệp hồng...
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center p-10 font-serif">
        Rất tiếc, không tìm thấy thông tin thiệp mời này!
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white text-[#333] overflow-x-hidden font-sans">
      {/* Background cố định phía dưới cùng */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#fff5f7] via-white to-[#fff5f7] z-0" />

      {/* Hiệu ứng hạt lấp lánh lớp giữa */}
      <Sparkles />

      {/* Nội dung chính lớp trên cùng */}
      <main className="relative z-10 max-w-2xl mx-auto shadow-2xl bg-white/40 backdrop-blur-[2px]">
        {/* 1. COVER IMAGE SECTION */}
        <section className="relative h-[60vh] overflow-hidden">
          <img
            src={
              data.cover_image
                ? `http://localhost:8000/storage/invitations/covers/${data.cover_image}`
                : "https://images.pexels.com/photos/2253879/pexels-photo-2253879.jpeg"
            }
            className="w-full h-full object-cover animate-slowZoom"
            alt="Wedding Cover"
          />
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute bottom-10 left-0 right-0 text-center text-white">
            <h2 className="text-xl font-serif italic mb-2">Save The Date</h2>
            <div className="h-[1px] w-20 bg-white mx-auto mb-4"></div>
            <p className="text-lg tracking-[0.2em] uppercase font-light">
              {new Date(data.event_date).toLocaleDateString("vi-VN", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </section>

        {/* 2. GREETING SECTION */}
        <section className="py-16 px-6 text-center">
          <div className="animate-fadeInUp">
            <p className="text-[#c94b6a] font-serif italic text-lg mb-2">
              Trân trọng kính mời
            </p>
            <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b-2 border-pink-100 inline-block pb-2 px-6">
              {data.guest_name}
            </h2>

            <div className="flex flex-col items-center justify-center space-y-4">
              <h1 className="font-serif text-5xl md:text-6xl text-[#c94b6a]">
                {data.groom_name}
              </h1>
              <div className="flex items-center gap-4 text-pink-300">
                <div className="h-[1px] w-12 bg-pink-200"></div>
                <FontAwesomeIcon icon={faHeart} className="animate-pulse" />
                <div className="h-[1px] w-12 bg-pink-200"></div>
              </div>
              <h1 className="font-serif text-5xl md:text-6xl text-[#c94b6a]">
                {data.bride_name}
              </h1>
            </div>

            <p className="mt-10 text-gray-500 leading-relaxed max-w-md mx-auto italic">
              "Sự hiện diện của bạn là món quà quý giá nhất đối với chúng tôi
              trong ngày trọng đại này."
            </p>
          </div>
        </section>

        {/* 3. EVENT DETAILS */}
        <section className="bg-[#c94b6a]/5 py-16 px-8 rounded-t-[50px] space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Lễ Thành Hôn / Vu Quy */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border-t-4 border-[#c94b6a] text-center transition-transform hover:scale-[1.02]">
              <div className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#c94b6a]">
                📅
              </div>
              <h3 className="uppercase tracking-widest text-sm font-bold text-gray-400 mb-2">
                Thời gian
              </h3>
              <p className="text-xl font-bold text-gray-800">
                {new Date(data.event_date).toLocaleDateString("vi-VN", {
                  weekday: "long",
                  day: "numeric",
                  month: "numeric",
                  year: "numeric",
                })}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                (Tức ngày {data.lunar_date || "đang cập nhật"})
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-center gap-2">
                <span className="text-pink-600 font-bold">
                  Lúc:{" "}
                  {new Date(data.event_date).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>

            {/* Địa Điểm */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border-t-4 border-[#c94b6a] text-center transition-transform hover:scale-[1.02]">
              <div className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#c94b6a]">
                📍
              </div>
              <h3 className="uppercase tracking-widest text-sm font-bold text-gray-400 mb-2">
                Địa điểm
              </h3>
              <p className="text-lg font-bold text-gray-800 capitalize">
                Tại {data.location_type}
              </p>
              <p className="text-gray-500 text-sm mt-2">{data.address}</p>
            </div>
          </div>

          {/* Countdown Section */}
          <div className="text-center space-y-4 pt-10">
            <h3 className="text-gray-400 uppercase tracking-[0.3em] text-xs font-bold">
              Ngày trọng đại còn
            </h3>
            <div className="flex justify-center items-center gap-6">
              <div className="bg-white w-24 h-24 rounded-2xl flex flex-col items-center justify-center shadow-lg border border-pink-100">
                <span className="text-4xl font-bold text-[#c94b6a]">
                  {daysLeft}
                </span>
                <span className="text-[10px] text-gray-400 uppercase">
                  Ngày
                </span>
              </div>
            </div>
            <p className="text-pink-400 font-serif italic pt-4">
              Chúng tôi đang chờ đón bạn!
            </p>
          </div>
        </section>

        {/* 4. MAP SECTION (Nếu có) */}
        {data.map_iframe && (
          <section className="py-10 px-6 bg-white">
            <h3 className="text-center font-serif text-2xl mb-6">Chỉ đường</h3>
            <div
              className="rounded-3xl overflow-hidden shadow-inner border-4 border-white h-80"
              dangerouslySetInnerHTML={{ __html: data.map_iframe }}
            />
          </section>
        )}

        {/* 5. RSVP FOOTER */}
        <section className="py-20 text-center px-6">
          <div className="p-10 bg-gradient-to-br from-[#c94b6a] to-[#a83a55] rounded-[40px] text-white shadow-2xl">
            <h3 className="text-2xl font-serif mb-4">Bạn sẽ tham dự chứ?</h3>
            <p className="text-pink-100 text-sm mb-8 font-light">
              Làm ơn xác nhận để chúng tôi chuẩn bị đón tiếp chu đáo nhất.
            </p>
            <button
              onClick={() =>
                alert("Cảm ơn " + data.guest_name + " đã xác nhận tham dự!")
              }
              className="bg-white text-[#c94b6a] px-12 py-4 rounded-full font-bold uppercase tracking-widest shadow-xl hover:bg-pink-50 transition-all active:scale-95"
            >
              💌 Xác nhận ngay
            </button>
          </div>
          <p className="mt-12 text-gray-300 text-[10px] tracking-widest uppercase">
            Design by Tung's Wedding App
          </p>
        </section>
      </main>
    </div>
  );
};

export default GuestInvitation;
