import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNotifications } from "../../api/queries";
import { Bell } from "lucide-react";
import NotificationDropdown from "../ui/notification/NotificationDropdown";

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Realizamos polling cada minuto para obtener nuevas notificaciones
  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });

  const unreadCount = notifications?.filter((n) => !n.read).length || 0;

  // Cierra el dropdown si se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-full p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none  cursor-pointer"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 justify-center items-center text-white text-xs">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          </span>
        )}
      </button>

      {isOpen && notifications && (
        <NotificationDropdown
          notifications={notifications}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationBell;
