import React, { type ReactNode, type MouseEventHandler } from "react";

// 1. Define la interfaz de las props con las mismas opciones que antes
interface ButtonProps {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  icon?: React.ElementType;
  linkTo?: string;
  className?: string; // Prop adicional para clases personalizadas
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  size = "medium",
  icon: Icon,
  linkTo,
  className = "",
}) => {
  // 2. Define las clases base y las variantes
  const baseClasses =
    "flex items-center justify-center gap-2 font-semibold rounded-lg cursor-pointer transition-all duration-200 ease-in-out";

  const sizeClasses = {
    small: "px-3 py-2 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg",
  };

  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-600 text-white hover:bg-gray-700",
    outline:
      "bg-transparent text-blue-600 border border-blue-600 hover:bg-blue-100",
  };

  // 3. Combina todas las clases
  const combinedClasses =
    `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`.trim();

  const buttonContent = (
    <>
      {Icon && <span className="flex items-center">{<Icon />}</span>}
      <span>{children}</span>
    </>
  );

  // 4. Renderiza el botón o el enlace
  if (linkTo) {
    return (
      <a href={linkTo} className={combinedClasses} onClick={onClick}>
        {buttonContent}
      </a>
    );
  }

  return (
    <button className={combinedClasses} onClick={onClick}>
      {buttonContent}
    </button>
  );
};

export default Button;
