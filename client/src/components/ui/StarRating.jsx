import React from 'react';
import { Star } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs) => twMerge(clsx(inputs));

export const StarRating = ({ value, onChange, readonly = false }) => {
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onChange?.(star)}
          className={cn(
            "p-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded",
            readonly ? "cursor-default" : "cursor-pointer hover:bg-gray-100"
          )}
        >
          <Star
            className={cn(
              "w-6 h-6",
              star <= value
                ? "fill-yellow-400 text-yellow-400"
                : "fill-transparent text-gray-300"
            )}
          />
        </button>
      ))}
    </div>
  );
};
