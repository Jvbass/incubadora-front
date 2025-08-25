import type { ProjectDetailResponse, FeedbackResponse } from "../../../types";
import { useProjectRating } from "../../../hooks/useProjectRating";
import { StarRating } from "../../ux/StarRating";
import { Link } from "react-router-dom";

interface ProjectMainContentProps {
  project: ProjectDetailResponse;
  feedbackList?: FeedbackResponse[];
}

export const ProjectMainContent = ({
  project,
  feedbackList,
}: ProjectMainContentProps) => {
  const { starRating, feedbackCount, averageRatingFormatted } =
    useProjectRating(feedbackList);

  return (
    <section>
      {/* Project Header with Image and Title */}
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        {/* Project Image */}
        <div className="flex-shrink-0">
          <img
            src="https://placehold.co/120x120"
            alt={`${project.title} logo`}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover "
          />
        </div>

        {/* Title and Info */}
        <div className="flex-1 min-w-0">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-text-light mb-2">
            {project.title}
          </h1>
          <span className="text-md font-bold text-gray-600 dark:text-brand-100 ">
            {project.subtitle}
          </span>

          <p className="text-lg text-gray-600 dark:text-text-light mb-4">
            Creado por{" "}
            <Link to="/home">
              <span className="font-semibold text-gray-700 dark:text-brand-100 hover:text-blue-500 transition duration-200">
                {project.developerUsername}
              </span>
            </Link>
          </p>

          {/* Rating and Reviews */}
          {feedbackCount > 0 && (
            <StarRating
              rating={starRating}
              showRating={true}
              showCount={true}
              ratingValue={averageRatingFormatted}
              count={feedbackCount}
            />
          )}
        </div>
      </div>

      {/* Project Description */}
      <div className="mt-8 prose prose-lg max-w-none prose-p:text-gray-600 text-gray-800 dark:text-text-light">
        <p>{project.description}</p>
      </div>
    </section>
  );
};
