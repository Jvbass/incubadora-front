import { Menu } from "lucide-react";

interface MobileMenuButtonProps {
  onClick: () => void;
}

export function MobileMenuButton({ onClick }: MobileMenuButtonProps) {
  return (
    <button
      onClick={onClick}
      className="sticky top-4 left-4 z-50 md:hidden bg-bg-soft dark:bg-bg-darker text-black dark:text-white p-2  hover:text-blue-800 rounded-lg transition-colors"
    >
      <Menu size={24} />
    </button>
  );
}
