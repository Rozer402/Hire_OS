import React from 'react';
import clsx from 'clsx';

export function ScoreRing({ score, size = 60, strokeWidth = 6, className }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  let colorClass = "text-status-success";
  if (score < 60) colorClass = "text-status-danger";
  else if (score < 75) colorClass = "text-status-warning";
  else if (score >= 90) colorClass = "text-primary";

  return (
    <div className={clsx("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-onyx-800"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={clsx("transition-all duration-1000 ease-in-out", colorClass)}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-sm font-bold text-onyx-50">{score}</span>
      </div>
    </div>
  );
}
