import { useMemo } from 'react';
import type { FeedbackResponse } from '../types';

export const useProjectRating = (feedbackList?: FeedbackResponse[]) => {
  return useMemo(() => {
    if (!feedbackList || feedbackList.length === 0) {
      return {
        averageRating: 0,
        feedbackCount: 0,
        averageRatingFormatted: 'Sé el primero! 🧑‍🚀',
        starRating: 0, // For 1-5 star display
      };
    }

    const totalRating = feedbackList.reduce((sum, feedback) => sum + feedback.rating, 0);
    const averageRating = totalRating / feedbackList.length;
    const starRating = averageRating; // Convert 1-10 to 1-5 scale (keep decimal for partial stars)

    return {
      averageRating,
      feedbackCount: feedbackList.length,
      averageRatingFormatted: starRating.toFixed(1), // Display formatted rating
      starRating, // For star display with decimal support
    };
  }, [feedbackList]);
};