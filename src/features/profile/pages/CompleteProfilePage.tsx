import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchUserProfile } from "../../../api/profileApi";
import Loading from "../../../components/ux/Loading";
import ImageUpload from "../../../components/ui/ImageUpload";
import ProfileWizard from "../components/ProfileWizard";
import toast from "react-hot-toast";

// Página de onboarding de perfil (profile-wizard SDD, WU1+WU2): aloja la
// sección persistente de avatar/imagen de banner (D8) y el ProfileWizard de
// 4 pasos. Espeja el layout de imágenes de EditProfilePage.
const CompleteProfilePage = () => {
  const queryClient = useQueryClient();

  const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
    staleTime: Infinity, // No necesita re-fetch mientras el usuario completa el wizard
  });

  // Invalida ambas claves de caché (D2): "userProfile" (perfil propio,
  // /settings, Navbar) y "userData" (dashboard). Evita que el dashboard
  // quede mostrando un avatar/banner desactualizado tras subir uno acá.
  const invalidateProfileCaches = () => {
    queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    queryClient.invalidateQueries({ queryKey: ["userData"] });
  };

  const handleAvatarUpload = () => {
    toast.success("Avatar actualizado correctamente.");
    invalidateProfileCaches();
  };

  const handleAvatarDelete = () => {
    toast.success("Avatar eliminado.");
    invalidateProfileCaches();
  };

  const handleBioImageUpload = () => {
    toast.success("Imagen de banner actualizada correctamente.");
    invalidateProfileCaches();
  };

  const handleBioImageDelete = () => {
    toast.success("Imagen de banner eliminada.");
    invalidateProfileCaches();
  };

  if (isLoadingProfile) {
    return <Loading message="Cargando tu perfil..." />;
  }

  if (!profileData) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-main dark:text-text-light">
          Completa tu perfil
        </h1>
        <p className="mt-1 text-sm text-text-soft dark:text-gray-400">
          Sumá tu foto, tu stack y tu trayectoria para que el resto de la
          comunidad te conozca mejor. Podés omitir este paso en cualquier
          momento.
        </p>
      </div>

      {/* Imágenes del perfil (D8): se guardan de inmediato, fuera del
          wizard y sin verse afectadas por omitirlo o abandonarlo. */}
      <div className="p-6 bg-bg-light dark:bg-bg-dark text-text-main dark:text-text-light rounded-lg shadow-md border border-divider dark:border-border space-y-6">
        <h2 className="text-xl font-bold text-text-main dark:text-text-light">
          Imágenes del perfil
        </h2>
        <div data-testid="complete-profile-avatar-upload">
          <ImageUpload
            label="Avatar"
            aspectHint="1:1, 400×400"
            currentImageUrl={profileData?.avatarUrl}
            endpoint="/profile/avatar"
            deleteEndpoint="/profile/avatar"
            onUploadSuccess={handleAvatarUpload}
            onDeleteSuccess={handleAvatarDelete}
          />
        </div>
        <div data-testid="complete-profile-bio-image-upload">
          <ImageUpload
            label="Imagen de banner"
            aspectHint="3:1, 1200×400"
            currentImageUrl={profileData?.bioImageUrl}
            endpoint="/profile/bio-image"
            deleteEndpoint="/profile/bio-image"
            onUploadSuccess={handleBioImageUpload}
            onDeleteSuccess={handleBioImageDelete}
          />
        </div>
      </div>

      <ProfileWizard profile={profileData} />
    </div>
  );
};

export default CompleteProfilePage;
