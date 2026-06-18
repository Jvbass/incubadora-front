import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMyProjects, updateProjectStatus } from "../../../api/projectApi";
import { fetchUserProfile } from "../../../api/profileApi";
import { requestMentorUpgrade } from "../../../api/adminApi";
import Loading from "../../../components/ux/Loading";
import { Cog, Eye, Lightbulb, MessageSquare, Heart, FolderGit2, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { ProjectCard } from "../../projects/components/ProjectCard";
import type { ProjectSummary } from "../../../types";
import { useState } from "react";
import Modal from "../../../components/ui/modal/Modal";
import ProjectForm from "../../projects/components/ProjectForm";
import ProjectDetailPage from "../../projects/pages/ProjectDetailPage";
import { Button } from "../../../components/button/RoundedButton";
import { useAuthZustand } from "../../../hooks/useAuthZustand";
import toast from "react-hot-toast";
import AvatarUsuario from "../../../components/ui/AvatarUsuario";

const TABS = [
  { key: "resumen", label: "Resumen" },
  { key: "proyectos", label: "Proyectos" },
  { key: "feedback", label: "Feedback" },
  { key: "kudos", label: "Kudos" },
  { key: "social", label: "Social" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const cardClass =
  "p-5 rounded-lg border bg-bg-light dark:bg-bg-dark border-divider dark:border-border text-text-main dark:text-text-light";

const DeveloperDashboard = () => {
  const [viewingProjectSlug, setViewingProjectSlug] = useState<string | null>(null);
  const [editingProjectSlug, setEditingProjectSlug] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tab, setTab] = useState<TabKey>("resumen");

  const queryClient = useQueryClient();
  const { user } = useAuthZustand();

  const handleProjectView = (slug: string) => {
    setViewingProjectSlug(slug);
    setEditingProjectSlug(null);
    setIsModalOpen(true);
  };

  const handleProjectEdit = (slug: string) => {
    setEditingProjectSlug(slug);
    setViewingProjectSlug(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setViewingProjectSlug(null);
    setEditingProjectSlug(null);
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["userData"],
    queryFn: fetchUserProfile,
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });

  const { data: projects } = useQuery<ProjectSummary[]>({
    queryKey: ["myProjects"],
    queryFn: fetchMyProjects,
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });

  const requestMentorMutation = useMutation({
    mutationFn: requestMentorUpgrade,
    onSuccess: () => {
      toast.success(
        "Solicitud enviada. Recibirás una notificación con la respuesta del administrador."
      );
    },
    onError: (err: any) => {
      toast.error(
        err.response?.data?.message || "Ocurrió un error al enviar la solicitud."
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ slug, status }: { slug: string; status: string }) =>
      updateProjectStatus(slug, status),
    onSuccess: () => {
      toast.success("Estado del proyecto actualizado");
      queryClient.invalidateQueries({ queryKey: ["myProjects"] });
      queryClient.invalidateQueries({ queryKey: ["userData"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || "No se pudo cambiar el estado."),
  });

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loading message="perfil" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="text-center p-8 text-text-main dark:text-text-light">
        <p className="text-red-500">
          {isError ? `Error al cargar el perfil: ${error?.message}` : "No se encontraron datos del perfil."}
        </p>
        <Link to="/" className="text-cta-600 hover:underline">Volver</Link>
      </div>
    );
  }

  const stats = data.stats;
  const allProjects = projects ?? [];

  // Tarjeta de estadística (pestaña Resumen)
  const StatCard = ({ label, value }: { label: string; value: number | string }) => (
    <div className={`${cardClass} flex flex-col gap-1`}>
      <span className="text-3xl font-bold text-cta-600 dark:text-cta-300">{value}</span>
      <span className="text-sm text-text-soft dark:text-gray-400">{label}</span>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* ── User card (F-13) ───────────────────────────────────────────── */}
      <div className={`${cardClass} flex flex-col sm:flex-row sm:items-center gap-5`}>
        <AvatarUsuario
          src={data.avatarThumbnailUrl ?? data.avatarUrl}
          nombre={`${data.firstName} ${data.lastName}`}
          tamano="w-20 h-20"
          forma="rounded-full"
          className="shadow-md shrink-0"
        />
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold truncate">
            {data.firstName} {data.lastName}
          </h1>
          <p className="text-sm text-text-soft dark:text-gray-400">@{data.slug}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2 py-0.5 rounded-full bg-cta-100/60 dark:bg-cta-900/30 text-cta-600 dark:text-cta-300 font-semibold">
              {user?.role}
            </span>
            <span className="text-text-soft dark:text-gray-400">
              {data.publicProfile ? "Perfil público" : "Perfil privado"}
            </span>
            {stats && (
              <span className="text-text-soft dark:text-gray-400">
                · Score {Math.round(stats.score)}
              </span>
            )}
          </div>
          {/* Solicitud de cambio a mentor (regla: 3 proyectos) */}
          {user?.role === "DEV" && (
            <div className="mt-2">
              {allProjects.length < 3 ? (
                <span className="text-xs text-red-400">
                  Publica 3 proyectos para poder solicitar el rol de mentor
                </span>
              ) : (
                <Button
                  variant="outline"
                  className="text-xs"
                  onClick={() => requestMentorMutation.mutate()}
                  disabled={requestMentorMutation.isPending}
                >
                  {requestMentorMutation.isPending
                    ? "Enviando solicitud..."
                    : "Solicitar cambio a Mentor"}
                </Button>
              )}
            </div>
          )}
        </div>
        <div className="flex sm:flex-col gap-3 shrink-0">
          <Link to="/settings" title="Configuración" aria-label="Configuración">
            <Cog size={22} className="hover:text-cta-600 transition-colors" />
          </Link>
          <Link to="/profile" title="Ver mi perfil" aria-label="Ver mi perfil">
            <Eye size={22} className="hover:text-cta-600 transition-colors" />
          </Link>
        </div>
      </div>

      {/* ── Tabs (F-14) ────────────────────────────────────────────────── */}
      <div className="flex gap-1 border-b border-divider dark:border-border overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
              tab === t.key
                ? "border-cta-600 text-cta-600 dark:text-cta-300 dark:border-cta-300"
                : "border-transparent text-text-soft dark:text-gray-400 hover:text-text-main dark:hover:text-text-light"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Tab content ────────────────────────────────────────────────── */}
      {tab === "resumen" && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard label="Proyectos publicados" value={stats?.totalProjects ?? 0} />
          <StatCard label="Feedbacks recibidos" value={stats?.totalFeedbacksReceived ?? 0} />
          <StatCard label="Feedbacks realizados" value={stats?.totalFeedbacksGiven ?? 0} />
          <StatCard label="Kudos recibidos" value={stats?.totalKudosReceived ?? 0} />
          <StatCard label="Kudos realizados" value={stats?.totalKudosGiven ?? 0} />
          <StatCard label="Rating promedio" value={(stats?.avgProjectRating ?? 0).toFixed(1)} />
        </div>
      )}

      {tab === "proyectos" && (
        <div className={cardClass}>
          <div className="flex justify-between items-center border-b border-divider dark:border-border pb-2 mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FolderGit2 size={20} /> Mis Proyectos
            </h2>
            <Link
              to="/projects/new"
              className="flex items-center gap-1 text-sm font-semibold rounded-md py-1 px-2 border border-cta-600 text-cta-600 hover:bg-cta-600 hover:text-white transition-colors dark:border-cta-300 dark:text-cta-300"
            >
              <Lightbulb strokeWidth={2} size={18} /> Crear
            </Link>
          </div>
          {allProjects.length === 0 ? (
            <p className="text-sm text-text-soft dark:text-gray-400">Aún no tienes proyectos.</p>
          ) : (
            <ul className="space-y-4">
              {allProjects.map((project) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  variant="compact"
                  onEdit={handleProjectEdit}
                  onView={handleProjectView}
                  onStatusChange={(slug, status) =>
                    statusMutation.mutate({ slug, status })
                  }
                />
              ))}
            </ul>
          )}
        </div>
      )}

      {tab === "feedback" && (
        <div className="space-y-6">
          <section className={cardClass}>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <MessageSquare size={18} /> Feedbacks recibidos
            </h3>
            {(data.feedbackReceived ?? []).length === 0 ? (
              <p className="text-sm text-text-soft dark:text-gray-400">Todavía no recibiste feedback en tus proyectos.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {data.feedbackReceived.map((f) => (
                  <li key={f.id} className="border-b border-divider dark:border-border pb-2 last:border-0">
                    <span className="font-medium">{f.author}</span> en{" "}
                    <span className="text-cta-600 dark:text-cta-300">{f.relatedProjectTitle}</span>
                    <span className="text-text-soft dark:text-gray-400"> — {f.feedbackDescription} · {f.rating}⭐</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section className={cardClass}>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <MessageSquare size={18} /> Feedbacks realizados
            </h3>
            {(data.feedbackGiven ?? []).length === 0 ? (
              <p className="text-sm text-text-soft dark:text-gray-400">Todavía no diste feedback a otros proyectos.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {data.feedbackGiven.map((f) => (
                  <li key={f.id} className="border-b border-divider dark:border-border pb-2 last:border-0">
                    <span className="text-cta-600 dark:text-cta-300">{f.relatedProjectTitle}</span>
                    <span className="text-text-soft dark:text-gray-400"> — {f.feedbackDescription} · {f.rating}⭐</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}

      {tab === "kudos" && (
        <div className="space-y-6">
          <section className={cardClass}>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Heart size={18} /> Kudos recibidos
            </h3>
            {(data.kudosReceived ?? []).length === 0 ? (
              <p className="text-sm text-text-soft dark:text-gray-400">Todavía no recibiste kudos.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {data.kudosReceived.map((k) => (
                  <li key={k.id} className="border-b border-divider dark:border-border pb-2 last:border-0">
                    <span className="font-medium">{k.senderUsername}</span>
                    <span className="text-text-soft dark:text-gray-400"> — {k.message}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section className={cardClass}>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Heart size={18} /> Kudos realizados
            </h3>
            {(data.kudosGiven ?? []).length === 0 ? (
              <p className="text-sm text-text-soft dark:text-gray-400">Todavía no diste kudos.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {data.kudosGiven.map((k) => (
                  <li key={k.id} className="border-b border-divider dark:border-border pb-2 last:border-0">
                    Para <span className="font-medium">{k.receiverUsername}</span>
                    <span className="text-text-soft dark:text-gray-400"> — {k.message}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}

      {tab === "social" && (
        <div className={`${cardClass} flex flex-col items-center gap-2 py-10 text-center`}>
          <Users size={32} className="text-text-soft dark:text-gray-500" />
          <p className="font-medium">Social</p>
          <p className="text-sm text-text-soft dark:text-gray-400">
            Próximamente: usuarios y proyectos que sigues.
          </p>
        </div>
      )}

      {/* Modales de ver/editar proyecto */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProjectSlug ? "Editar Proyecto" : "Detalles del Proyecto"}
      >
        {viewingProjectSlug && <ProjectDetailPage slug={viewingProjectSlug} />}
        {editingProjectSlug && (
          <ProjectForm projectSlug={editingProjectSlug} onClose={handleCloseModal} />
        )}
      </Modal>
    </div>
  );
};

export default DeveloperDashboard;
