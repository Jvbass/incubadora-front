// External library imports
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

// Internal imports
import { fetchProjects } from "../api/queries";
import Loading from "../components/ux/Loading";
import { ProjectCard } from "../components/ui/card/ProjectCard";

// Types
import type { ProjectSummary } from "../types";

// Styles
import "../index.css";

const HomePage = () => {
  // Query to fetch all published projects for homepage display
  const { data, isLoading, isError } = useQuery<ProjectSummary[]>({
    queryKey: ["projects"],
    queryFn: fetchProjects,
    staleTime: 1000 * 60 * 60, // 1 hour cache
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="h-screen text-center flex items-center justify-center">
          <Loading message="loading projects" />
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="p-8 h-screen w-full text-center">
          <div className="max-w-md mx-auto">
            <h2 className="text-xl font-bold text-red-600 mb-4">
              Unable to Load Projects
            </h2>
            <p className="text-gray-600 mb-4">
              We're having trouble loading the projects. Please try again later.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="p-8 h-screen w-full text-center font-bold">
          No projects found
        </div>
      </div>
    );
  }

  // Success state with projects
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="p-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Explore Projects</h1>
        </div>
        <ul className="space-y-4 mt-6">
          {data.map((project) => (
            <Link
              to={`/project/${project.slug}`}
              key={project.id}
              className="block hover:opacity-90 transition-opacity"
            >
              <ProjectCard
                project={project}
                variant="full"
              />
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );


};

export default HomePage;
