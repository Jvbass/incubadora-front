import FormSidePanel from "../components/FormSidePanel";
import ProjectWizard from "../components/ProjectWizard";

// Creación de proyecto como wizard de 4 pasos (SDD §12.3 R5).
// La edición sigue usando ProjectForm (ver EditProjectPage).
const CreateProjectPage = () => {
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className=" mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 md:gap-8">
          <FormSidePanel />
          <ProjectWizard />
        </div>
      </div>
    </div>
  );
};

export default CreateProjectPage;
