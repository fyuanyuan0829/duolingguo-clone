import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  disabled,
  ...props 
}) => {
  const baseStyle = "font-bold py-3 px-6 rounded-2xl border-b-4 active:border-b-0 active:mt-1 transition-all uppercase tracking-wide text-sm sm:text-base";
  
  const variants = {
    primary: "bg-lingo-green border-lingo-greenDark text-white hover:bg-opacity-90",
    secondary: "bg-white border-gray-200 text-lingo-text hover:bg-gray-50",
    danger: "bg-lingo-red border-lingo-redDark text-white hover:bg-opacity-90",
    ghost: "bg-transparent border-transparent text-lingo-blue hover:bg-lingo-gray/20 border-b-0 active:mt-0"
  };

  const disabledStyle = disabled ? "opacity-50 cursor-not-allowed pointer-events-none border-b-0 mt-1" : "";
  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${widthStyle} ${disabledStyle} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
