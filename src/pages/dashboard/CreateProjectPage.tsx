import FormSidePanel from "../../components/ui/project-form/FormSidePanel";
import ProjectForm from "../../components/ui/project-form/ProjectForm";


const CreateProjectPage = () => {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-8">
        <FormSidePanel />
        <ProjectForm />
      </div>
    </div>
  );
};

export default CreateProjectPage;
