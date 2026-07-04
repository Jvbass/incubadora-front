import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateUserProfile } from "../../../api/profileApi";
import type { ProfileResponse, ProfileUpdateRequest } from "../../../types";

/**
 * Construye el body completo del PUT /profile a partir del perfil actual.
 * El backend reemplaza el perfil entero, por lo que cada edición inline
 * debe enviar todos los campos y no solo el modificado.
 */
export const buildUpdateRequest = (
  profile: ProfileResponse
): ProfileUpdateRequest => ({
  headline: profile.headline ?? "",
  slug: profile.slug,
  bio: profile.bio ?? "",
  profileVisibility: profile.profileVisibility,
  socialLinks: (profile.socialLinks ?? []).map(({ platform, url }) => ({
    platform,
    url,
  })),
  techStackIds: (profile.techStack ?? []).map((tech) => tech.id),
  workExperiences: (profile.workExperiences ?? []).map(
    ({ companyName, position, description, startYear, endYear }) => ({
      companyName,
      position,
      description,
      startYear,
      endYear,
    })
  ),
  languages: (profile.languages ?? []).map(({ language, proficiency }) => ({
    language,
    proficiency,
  })),
  certificates: (profile.certificates ?? []).map(
    ({ name, imageUrl, certificateUrl }) => ({ name, imageUrl, certificateUrl })
  ),
});

/**
 * Edición inline del perfil propio: recibe el perfil base (el del usuario
 * autenticado) y expone `saveProfile(patch)` que mergea el cambio puntual
 * sobre el resto de los datos actuales.
 */
export const useInlineProfileEdit = (profile: ProfileResponse | undefined) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (updated) => {
      toast.success("Perfil actualizado");
      queryClient.setQueryData(["userProfile"], updated);
      queryClient.invalidateQueries({ queryKey: ["profileBySlug"] });
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
    },
    onError: (error) => {
      toast.error(`Error al guardar: ${error.message}`);
    },
  });

  const saveProfile = (patch: Partial<ProfileUpdateRequest>) => {
    if (!profile) return;
    mutation.mutate({ ...buildUpdateRequest(profile), ...patch });
  };

  return { saveProfile, isSaving: mutation.isPending };
};
