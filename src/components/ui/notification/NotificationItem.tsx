import { Link, useNavigate } from "react-router-dom";
import type { Notification } from "../../../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markNotificationAsRead } from "../../../api/queries";

interface NotificationItemProps {
  notification: Notification;
  onClose: () => void;
}

const NotificationItem = ({ notification, onClose }: NotificationItemProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  /*
  useMutation para marcar la notificacion como leida
  */
  const { mutateAsync } = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      // Invalida y re-obtiene las notificaciones para actualizar la UI
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onClose(); // Cierra el dropdown inmediatamente

    // Si el read esta en falso, la marca como true con el metodo markNotificationAsRead
    if (!notification.read) {
      await mutateAsync(notification.id);
    }

    // Navega al enlace de la notificación
    navigate(notification.link);
  };

  return (
    <Link
      to={notification.link}
      onClick={handleClick}
      className={`block px-4 py-3 text-sm transition-colors ${
        notification.read
          ? "text-gray-600 hover:bg-gray-100"
          : "text-gray-800 bg-indigo-50 font-semibold hover:bg-indigo-100"
      }`}
    >
      <p>{notification.message}</p>
      <p
        className={`mt-1 text-xs ${
          notification.read ? "text-gray-400" : "text-indigo-500"
        }`}
      >
        {notification.timeAgo}
      </p>
    </Link>
  );
};

export default NotificationItem;
