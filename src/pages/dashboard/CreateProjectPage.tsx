import FormSidePanel from "../../components/ui/project-form/FormSidePanel";
import ProjectForm from "../../components/ui/project-form/ProjectForm";

const CreateProjectPage = () => {
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className=" mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 md:gap-8">
          <FormSidePanel />
          <ProjectForm />
        </div>
      </div>
    </div>
  );
};

export default CreateProjectPage;
