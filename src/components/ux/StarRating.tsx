interface StarRatingProps {
  rating: number; // 1-5 scale
  size?: number;
  showRating?: boolean;
  showCount?: boolean;
  ratingValue?: string;
  count?: number;
}

interface StarIconProps {
  fillPercentage: number; // 0-100
  size: number;
  id: string;
}

const StarIcon = ({ fillPercentage, size, id }: StarIconProps) => {
  const gradientId = `star-gradient-${id}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className="inline-block"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset={`${fillPercentage}%`} stopColor="#fbbf24" />
          <stop offset={`${fillPercentage}%`} stopColor="#e5e7eb" />
        </linearGradient>
      </defs>
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill={`url(#${gradientId})`}
        stroke="none"
      />
    </svg>
  );
};

export const StarRating = ({
  rating,
  size = 20,
  showRating = false,
  showCount = false,
  ratingValue,
  count,
}: StarRatingProps) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    let fillPercentage = 0;

    if (rating >= i) {
      // Full star
      fillPercentage = 100;
    } else if (rating > i - 1) {
      // Partial star - calculate percentage based on decimal part
      const decimalPart = rating - Math.floor(rating);
      fillPercentage = decimalPart * 100;
    }
    // else fillPercentage remains 0 (empty star)

    stars.push(
      <StarIcon
        key={i}
        fillPercentage={fillPercentage}
        size={size}
        id={`${i}-${Math.random().toString(36).substr(2, 9)}`} // Unique ID for gradient
      />
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">{stars}</div>
      {showRating && ratingValue && (
        <span className="text-lg font-semibold text-gray-800 dark:text-gray-300">
          {ratingValue}
        </span>
      )}
      {showCount && count !== undefined && (
        <>
          <span className="text-gray-400">•</span>
          <span className="text-gray-600 dark:text-gray-300">
            {count} {count === 1 ? "review" : "reviews"}
          </span>
        </>
      )}
    </div>
  );
};
