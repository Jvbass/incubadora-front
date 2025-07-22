import type { Notification } from "../../../types";
import NotificationItem from "./NotificationItem";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markAllNotificationsAsRead } from "../../../api/queries";

interface NotificationDropdownProps {
  notifications: Notification[];
  onClose: () => void;
}

const NotificationDropdown = ({
  notifications,
  onClose,
}: NotificationDropdownProps) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return (
    <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-gray-300 ring-opacity-5 focus:outline-none z-40">
      <div className="flex justify-between items-center px-4 py-2">
        <h3 className="text-lg font-bold text-gray-900">Notificaciones</h3>
        <button
          onClick={() => mutate()}
          disabled={isPending || !notifications.some((n) => !n.read)}
          className="text-xs text-indigo-600 hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          {isPending ? "Marcando..." : "Marcar todas como leídas"}
        </button>
      </div>
      <div className="py-1 max-h-96 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <NotificationItem key={n.id} notification={n} onClose={onClose} />
          ))
        ) : (
          <p className="px-4 py-3 text-sm text-gray-500 text-center">
            No tienes notificaciones.
          </p>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
