import React from 'react';
import clsx from 'clsx';

const Button = React.forwardRef(({ className, variant = 'primary', size = 'default', children, ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50 cursor-pointer";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover shadow-sm",
    secondary: "bg-onyx-800 text-onyx-100 hover:bg-onyx-700 border border-onyx-700",
    ghost: "hover:bg-onyx-800 text-onyx-300 hover:text-white",
    danger: "bg-status-danger text-white hover:bg-status-danger/90 shadow-sm"
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10 p-2"
  };

  return (
    <button
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});
Button.displayName = "Button";

export { Button };
