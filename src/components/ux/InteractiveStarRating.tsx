import { useState } from "react";

interface InteractiveStarRatingProps {
  value: number;
  onChange: (value: number) => void;
  size?: number;
}

export const InteractiveStarRating = ({
  value,
  onChange,
  size = 32,
}: InteractiveStarRatingProps) => {
  const [hovered, setHovered] = useState<number>(0);

  const filled = hovered || value;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="focus:outline-none transition-transform hover:scale-110"
          aria-label={`${star} estrella${star > 1 ? "s" : ""}`}
        >
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            className="inline-block"
          >
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill={star <= filled ? "#fbbf24" : "#e5e7eb"}
              stroke={star <= filled ? "#f59e0b" : "#d1d5db"}
              strokeWidth="1"
            />
          </svg>
        </button>
      ))}
      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
        {value > 0 ? `${value}/5` : "Sin calificación"}
      </span>
    </div>
  );
};
