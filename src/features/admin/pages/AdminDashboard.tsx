import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  fetchMentorRequests,
  decideMentorRequest,
} from "../../../api/adminApi";
import Loading from "../../../components/ux/Loading";
import { Button } from "../../../components/button/RoundedButton";
import { useState } from "react";
import Modal from "../../../components/ui/modal/Modal";
import type { MentorRequest } from "../../../types";
import ReportsPanel from "../components/ReportsPanel";

const AdminDashboard = () => {
  const queryClient = useQueryClient();
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectRequestId, setRejectRequestId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  // Query para obtener las solicitudes pendientes
  const { data: requests, isLoading } = useQuery<MentorRequest[]>({
    queryKey: ["mentorRequests", "PENDING"],
    queryFn: () => fetchMentorRequests("PENDING"),
    staleTime: 1000 * 60 * 5,
  });

  // Mutación para APROBAR
  const approveMutation = useMutation({
    mutationFn: (requestId: number) =>
      decideMentorRequest({ requestId, decision: "approve" }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["mentorRequests"] });
      toast.success(
        `Solicitud de ${data.username} aprobada. El usuario debe volver a iniciar sesión para usar su nuevo rol.`
      );
    },
    onError: () => {
      toast.error("Error al aprobar la solicitud.");
    },
  });

  // Mutación para RECHAZAR
  const rejectMutation = useMutation({
    mutationFn: ({
      requestId,
      reason,
    }: {
      requestId: number;
      reason: string;
    }) => decideMentorRequest({ requestId, decision: "reject", reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentorRequests"] });
      toast.success("Solicitud rechazada. El usuario ha sido notificado.");
      setIsRejectModalOpen(false);
      setRejectReason("");
      setRejectRequestId(null);
    },
    onError: () => {
      toast.error("Error al rechazar la solicitud.");
    },
  });

  // Handlers para el modal de rechazo
  const handleRejectClick = (requestId: number) => {
    setRejectRequestId(requestId);
    setIsRejectModalOpen(true);
  };

  const handleRejectSubmit = () => {
    if (rejectRequestId && rejectReason.length >= 10) {
      rejectMutation.mutate({
        requestId: rejectRequestId,
        reason: rejectReason,
      });
    } else {
      toast.error("El motivo de rechazo debe tener al menos 10 caracteres.");
    }
  };

  if (isLoading) return <Loading message="Cargando solicitudes" />;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold dark:text-text-light">
        Panel de Administración
      </h1>

      <h2 className="text-2xl font-bold dark:text-text-light">
        Solicitudes de Mentoría
      </h2>

      <div className="space-y-4">
        {requests?.length === 0 ? (
          <p className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md dark:text-gray-300">
            No hay solicitudes pendientes de revisión.
          </p>
        ) : (
          requests?.map((req) => (
            <div
              key={req.id}
              className="flex justify-between items-center p-4 bg-white dark:bg-bg-dark rounded-lg shadow border border-divider dark:border-gray-700"
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold dark:text-text-light">
                  {req.username}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {req.publishedProjectCount} proyecto(s) publicado(s) ·
                  Solicitada el{" "}
                  {new Date(req.createdAt).toLocaleDateString("es-ES")}
                </p>
                <Link
                  to={`/portfolio/${req.userSlug}`}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Ver Portfolio de {req.username}
                </Link>
              </div>
              <div className="flex space-x-3 ml-4 flex-shrink-0">
                <Button
                  variant="primary"
                  size="small"
                  onClick={() => approveMutation.mutate(req.id)}
                  disabled={approveMutation.isPending}
                >
                  {approveMutation.isPending ? "Aprobando..." : "Aprobar"}
                </Button>
                <Button
                  variant="secondary"
                  size="small"
                  className="bg-red-500 hover:bg-red-600"
                  onClick={() => handleRejectClick(req.id)}
                  disabled={rejectMutation.isPending}
                >
                  Rechazar
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reportes de contenido (2ª pasada del sistema de reportes) */}
      <ReportsPanel />

      {/* Modal de Rechazo */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title="Rechazar Solicitud de Mentoría"
      >
        <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
          <h2 className="text-xl font-bold mb-4 dark:text-text-light">
            Motivo del Rechazo
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Explica claramente por qué se rechaza la solicitud para que el
            usuario pueda corregir su perfil (Mín. 10 caracteres).
          </p>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={4}
            placeholder="Ej: Faltan al menos 3 proyectos en estado 'published'."
            className="w-full p-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-md dark:text-text-light"
          />
          <div className="flex justify-end space-x-3 mt-4">
            <Button
              variant="secondary"
              onClick={() => setIsRejectModalOpen(false)}
              className="bg-gray-400 hover:bg-gray-500"
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleRejectSubmit}
              disabled={rejectMutation.isPending || rejectReason.length < 10}
              className="bg-red-600 hover:bg-red-700"
            >
              {rejectMutation.isPending
                ? "Enviando Rechazo..."
                : "Confirmar Rechazo"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
