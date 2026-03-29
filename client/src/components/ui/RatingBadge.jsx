import React from 'react';
import { cn } from './StarRating';

export const RatingBadge = ({ value }) => {
  if (value === null || value === undefined) return <span className="text-gray-400">-</span>;

  let colorClass = 'bg-gray-100 text-gray-800';
  if (value >= 4.5) colorClass = 'bg-green-100 text-green-800';
  else if (value >= 3.5) colorClass = 'bg-emerald-100 text-emerald-800';
  else if (value >= 2.5) colorClass = 'bg-yellow-100 text-yellow-800';
  else if (value >= 1.5) colorClass = 'bg-orange-100 text-orange-800';
  else colorClass = 'bg-red-100 text-red-800';

  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-sm font-medium", colorClass)}>
      {value.toFixed(1)} ★
    </span>
  );
};
