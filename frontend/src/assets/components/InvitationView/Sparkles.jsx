import { useEffect, useRef } from "react";

const Sparkles = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let w, h;
    let particles = [];
    let animationFrameId;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    const createParticle = () => ({
      x: Math.random() * w,
      y: h + Math.random() * 100,
      size: Math.random() * 3 + 1, // Tăng kích thước tí cho dễ thấy
      speed: Math.random() * 1 + 0.5, // Tăng tốc độ trôi lên một chút
      alpha: Math.random() * 0.8 + 0.2,
      velocity: Math.random() * 0.5 - 0.25, // Thêm độ lệch ngang cho ngầu
    });

    for (let i = 0; i < 100; i++) particles.push(createParticle());

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.y -= p.speed;
        p.x += p.velocity; // Hạt bay hơi chéo nhẹ

        if (p.y < -10) {
          Object.assign(p, createParticle());
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        // Dùng màu hồng đậm hơn một chút để nổi bật trên nền trắng
        ctx.fillStyle = `rgba(201, 75, 106, ${p.alpha})`;
        ctx.shadowBlur = 10; // Thêm hiệu ứng phát sáng cho hạt
        ctx.shadowColor = "rgba(201, 75, 106, 0.5)";
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resize);
    resize();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1, mixBlendMode: "multiply" }} // Thêm style này
    />
  );
};

export default Sparkles;
