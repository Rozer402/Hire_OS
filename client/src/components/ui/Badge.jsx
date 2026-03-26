import React from 'react';
import clsx from 'clsx';

const Badge = React.forwardRef(({ children, variant = 'info', className, ...props }, ref) => {
  const variants = {
    success: "badge-success",
    warning: "badge-warning",
    danger: "badge-danger",
    info: "badge-info",
    primary: "badge-primary",
    secondary: "badge-secondary",
  };

  return (
    <div ref={ref} className={clsx(variants[variant], className)} {...props}>
      {children}
    </div>
  );
});
Badge.displayName = "Badge";

export { Badge };
