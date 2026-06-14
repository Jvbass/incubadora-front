import { useQuery } from "@tanstack/react-query";
import { Briefcase } from "lucide-react";
import { fetchPublishedJobs } from "../../../api/jobsApi";
import { JobOfferCard } from "../components/JobOfferCard";
import type { JobOffer } from "../../../types";

const JobsListPage = () => {
  const { data: jobs, isLoading } = useQuery<JobOffer[]>({
    queryKey: ["publishedJobs"],
    queryFn: fetchPublishedJobs,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4">
      <h1 className="text-2xl font-bold dark:text-text-light flex items-center gap-2">
        <Briefcase size={22} /> Ofertas de empleo
      </h1>

      {isLoading ? (
        <p className="text-gray-500 dark:text-gray-400">Cargando ofertas...</p>
      ) : !jobs || jobs.length === 0 ? (
        <p className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md dark:text-gray-300">
          No hay ofertas de empleo publicadas en este momento.
        </p>
      ) : (
        <div className="space-y-3">
          {jobs.map((offer) => (
            <JobOfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobsListPage;
