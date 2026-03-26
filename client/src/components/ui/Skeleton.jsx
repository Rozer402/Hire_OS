import React from 'react';
import clsx from 'clsx';

function Skeleton({ className, ...props }) {
  return (
    <div
      className={clsx("animate-pulse rounded-md bg-gray-800", className)}
      {...props}
    />
  );
}

export { Skeleton };
