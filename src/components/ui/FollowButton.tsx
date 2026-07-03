import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { UserPlus, UserCheck } from "lucide-react";
import {
  getUserFollowStatus,
  followUser,
  unfollowUser,
  getProjectFollowStatus,
  followProject,
  unfollowProject,
} from "../../api/followApi";

interface FollowButtonProps {
  kind: "user" | "project";
  slug: string;
}

/**
 * Botón seguir/dejar de seguir con contador (G-01). Renderizarlo solo para
 * usuarios autenticados; el estado se consulta al endpoint de status.
 */
const FollowButton = ({ kind, slug }: FollowButtonProps) => {
  const queryClient = useQueryClient();

  const statusFn = kind === "user" ? getUserFollowStatus : getProjectFollowStatus;
  const followFn = kind === "user" ? followUser : followProject;
  const unfollowFn = kind === "user" ? unfollowUser : unfollowProject;

  const { data } = useQuery({
    queryKey: ["followStatus", kind, slug],
    queryFn: () => statusFn(slug),
    staleTime: 1000 * 60,
  });

  const mutation = useMutation({
    mutationFn: () => (data?.following ? unfollowFn(slug) : followFn(slug)),
    onSuccess: (res) => {
      queryClient.setQueryData(["followStatus", kind, slug], res);
      queryClient.invalidateQueries({ queryKey: ["followedUsers"] });
      queryClient.invalidateQueries({ queryKey: ["followedProjects"] });
    },
    onError: () => toast.error("No se pudo actualizar el seguimiento."),
  });

  const following = data?.following ?? false;

  return (
    <button
      type="button"
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md border transition-colors disabled:opacity-50 ${
        following
          ? "border-divider dark:border-border text-text-soft dark:text-gray-400 hover:border-red-400 hover:text-red-400"
          : "border-cta-600 text-cta-600 hover:bg-cta-600 hover:text-white dark:border-cta-300 dark:text-cta-300"
      }`}
    >
      {following ? <UserCheck size={16} /> : <UserPlus size={16} />}
      {following ? "Siguiendo" : "Seguir"}
      {data ? ` · ${data.followers}` : ""}
    </button>
  );
};

export default FollowButton;
