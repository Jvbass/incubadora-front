import ProjectForm from "../../components/ui/create-project-form/ProjectForm";
import ProjectInfoPanel from "../../components/ui/create-project-form/ProjectInfoPanel";

const CreateProjectPage = () => {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-8">
        <ProjectInfoPanel />
        <ProjectForm />
      </div>
    </div>
  );
};

export default CreateProjectPage;
