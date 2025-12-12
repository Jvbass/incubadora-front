import { useEffect, useState } from "react";

export const BackgroundEffects = () => {
  // Generate random stars for dark mode
  const [stars, setStars] = useState<
    {
      id: number;
      top: string;
      left: string;
      size: string;
      delay: string;
      duration: string;
    }[]
  >([]);

  useEffect(() => {
    const newStars = Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1}px`,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 3 + 2}s`,
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Dark Mode: Stars */}
      <div className="hidden dark:block absolute inset-0 bg-bg-darker transition-colors duration-700 ">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white opacity-20 animate-twinkle"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              animationDelay: star.delay,
              animationDuration: star.duration,
            }}
          />
        ))}
      </div>

      {/* Light Mode: Aurora */}
      <div className="dark:hidden block absolute inset-0 bg-bg-light transition-colors duration-700 ">
        {/* borde superior */}
        <div className="absolute top-[-25%] left-0 w-[35%] h-[35%] bg-purple-300 rounded-full mix-blend-multiply filter blur-[80px] opacity-30 animate-aurora-top"></div>

        {/* borde derecho */}
        <div className="absolute top-0 right-[-32%] w-[35%] h-[35%] bg-yellow-300 rounded-full mix-blend-multiply filter blur-[80px] opacity-30 animate-aurora-right"></div>

        {/* borde inferior */}
        <div className="absolute bottom-[-20%] right-0 w-[35%] h-[35%] bg-green-300 rounded-full mix-blend-multiply filter blur-[80px] opacity-30 animate-aurora-bottom"></div>

        {/* borde izquierdo */}
        <div className="absolute bottom-0 left-[-20%] w-[35%] h-[35%] bg-blue-300 rounded-full mix-blend-multiply filter blur-[80px] opacity-30 animate-aurora-left"></div>
      </div>
    </div>
  );
};
