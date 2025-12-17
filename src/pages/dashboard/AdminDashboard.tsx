import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  fetchMentorRequests,
  approveMentorUpgrade,
  rejectMentorUpgrade,
} from "../../api/queries";
import Loading from "../../components/ux/Loading";
import { Button } from "../../components/button/RoundedButton";
import { useAuthStore } from "../../stores/authStore";
import { useState } from "react";
import Modal from "../../components/ui/modal/Modal";
import type { MentorRequest } from "../../types";

const AdminDashboard = () => {
  const queryClient = useQueryClient();
  const loginStore = useAuthStore((state) => state.login);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectNotificationId, setRejectNotificationId] = useState<
    number | null
  >(null);
  const [rejectReason, setRejectReason] = useState("");
  const [filter, setFilter] = useState("PENDING"); // Opcional: para futuras expansiones

  // Query para obtener las solicitudes pendientes
  const { data: requests, isLoading } = useQuery<MentorRequest[]>({
    queryKey: ["mentorRequests", filter],
    queryFn: fetchMentorRequests,
    staleTime: 1000 * 60 * 5,
  });

  // Mutación para APROBAR
  const approveMutation = useMutation({
    mutationFn: (userId: number) => approveMentorUpgrade(userId),
    onSuccess: (data, userId) => {
      // El backend devuelve el nuevo token JWT. Se debe actualizar el token del usuario APROBADO si es el admin quien lo está haciendo.
      // Aquí simplemente invalidamos las solicitudes para quitarlas de la lista del admin.
      queryClient.invalidateQueries({ queryKey: ["mentorRequests"] });

      // Opcional: Si el admin está logueado con el mismo usuario que aprobó (caso improbable) actualizaría el token
      // Pero lo importante es que el USUARIO DEV reciba su token actualizado al volver a loguearse.
      toast.success(
        `Usuario ${userId} aprobado. Recibirá notificación con su nuevo token.`
      );
    },
    onError: () => {
      toast.error("Error al aprobar la solicitud.");
    },
  });

  // Mutación para RECHAZAR
  const rejectMutation = useMutation({
    mutationFn: rejectMentorUpgrade,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentorRequests"] });
      toast.success("Solicitud rechazada. El usuario ha sido notificado.");
      setIsRejectModalOpen(false);
      setRejectReason("");
      setRejectNotificationId(null);
    },
    onError: () => {
      toast.error("Error al rechazar la solicitud.");
    },
  });

  // Handlers para el modal de rechazo
  const handleRejectClick = (notificationId: number) => {
    setRejectNotificationId(notificationId);
    setIsRejectModalOpen(true);
  };

  const handleRejectSubmit = () => {
    if (rejectNotificationId && rejectReason.length >= 10) {
      rejectMutation.mutate({
        notificationId: rejectNotificationId,
        reason: rejectReason,
      });
    } else {
      toast.error("El motivo de rechazo debe tener al menos 10 caracteres.");
    }
  };

  if (isLoading) return <Loading message="Cargando solicitudes" />;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold dark:text-text-light">
        Panel de Administración - Solicitudes de Mentoría
      </h1>

      <div className="space-y-4">
        {requests?.length === 0 ? (
          <p className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md dark:text-gray-300">
            No hay solicitudes pendientes de revisión.
          </p>
        ) : (
          requests?.map((req) => {
            // Extraer el userId del enlace de aprobación para la mutación
            const userIdMatch = req.approveLink.match(/\/(\d+)\/approve/);
            const userId = userIdMatch ? parseInt(userIdMatch[1]) : null;

            return (
              <div
                key={req.notificationId}
                className="flex justify-between items-center p-4 bg-white dark:bg-bg-dark rounded-lg shadow border border-divider dark:border-gray-700"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold dark:text-text-light">
                    {req.applicant.username}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {req.message}
                  </p>
                  <Link
                    to={`/profile/${req.applicant.slug}`}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Ver Perfil de {req.applicant.username}
                  </Link>
                </div>
                <div className="flex space-x-3 ml-4 flex-shrink-0">
                  <Button
                    variant="primary"
                    size="small"
                    onClick={() => userId && approveMutation.mutate(userId)}
                    disabled={approveMutation.isPending}
                  >
                    {approveMutation.isPending ? "Aprobando..." : "Aprobar"}
                  </Button>
                  <Button
                    variant="secondary"
                    size="small"
                    className="bg-red-500 hover:bg-red-600"
                    onClick={() => handleRejectClick(req.notificationId)}
                    disabled={rejectMutation.isPending}
                  >
                    Rechazar
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>

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
