import { useNavigate, useParams } from "react-router-dom";
import ProjectForm from "../components/ProjectForm";

const EditProjectPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <ProjectForm
        projectSlug={slug}
        onClose={() => navigate(-1)}
      />
    </div>
  );
};

export default EditProjectPage;
