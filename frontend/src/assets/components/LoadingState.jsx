import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const LoadingState = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#FFF5F7] overflow-hidden">
      <div className="relative flex items-center justify-center">
        {/* Vòng tròn lan tỏa (Sử dụng animate-ping của Tailwind) */}
        <div className="absolute w-16 h-16 bg-pink-200 rounded-full animate-ping opacity-75"></div>
        <div className="absolute w-24 h-24 border-2 border-pink-100 rounded-full animate-pulse"></div>

        {/* Trái tim chính ở giữa (Dùng animation tùy chỉnh trong class) */}
        <div className="relative z-10 text-pink-500 text-6xl drop-shadow-lg animate-[heartbeat_1s_infinite]">
          <FontAwesomeIcon icon={faHeart} />
        </div>
      </div>

      {/* Chữ Loading */}
      <div className="mt-12 text-center">
        <h3 className="text-[#D67B8C] font-serif italic text-2xl tracking-[0.3em] animate-pulse">
          Đang tải...
        </h3>

        {/* 3 dấu chấm chạy */}
        <div className="flex justify-center gap-2 mt-4">
          <div className="w-2 h-2 bg-pink-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-pink-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-pink-300 rounded-full animate-bounce"></div>
        </div>
      </div>

      {/* CSS cho nhịp đập trái tim  */}
      <style>{`
        @keyframes heartbeat {
          0% { transform: scale(1); }
          25% { transform: scale(1.1); }
          50% { transform: scale(1); }
          75% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default LoadingState;
