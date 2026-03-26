import React from 'react';
import clsx from 'clsx';

const Input = React.forwardRef(({ className, type, label, error, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && <label className="mb-1.5 block text-sm font-medium text-gray-300">{label}</label>}
      <input
        type={type}
        className={clsx(
          "flex h-10 w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
          error && "border-red-500 focus:ring-red-500",
          className
        )}
        ref={ref}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  );
});
Input.displayName = "Input";

export { Input };
