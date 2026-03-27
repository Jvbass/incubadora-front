import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchMentoringBySlug } from "../../../api/mentoringApi";
import Loading from "../../../components/ux/Loading";
import MentorshipForm from "../components/MentorshipForm";

const EditMentorshipPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: mentoring, isLoading, isError, error } = useQuery({
    queryKey: ["mentorings", "detail", slug],
    queryFn: () => fetchMentoringBySlug(slug!),
    enabled: !!slug,
  });

  if (isLoading) return <Loading message="Cargando mentoría..." />;

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-red-500">Error al cargar: {error.message}</p>
      </div>
    );
  }

  if (!mentoring) return null;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <MentorshipForm
        mentorshipId={mentoring.id}
        initialData={mentoring as any}
        onClose={() => navigate(-1)}
      />
    </div>
  );
};

export default EditMentorshipPage;
