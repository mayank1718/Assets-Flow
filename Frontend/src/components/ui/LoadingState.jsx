import React from "react";
import { Loader2 } from "lucide-react";

export const LoadingState = ({
  message = "Loading...",
  rows = 4,
  variant = "spinner", // 'spinner' | 'table-skeleton' | 'cards-skeleton'
  className = "",
}) => {
  if (variant === "table-skeleton") {
    return (
      <div className={`p-4 space-y-3 animate-pulse ${className}`}>
        <div className="h-9 bg-slate-100 rounded-lg w-full" />
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="h-12 bg-slate-50 border border-slate-100 rounded-lg w-full flex items-center px-4 gap-4">
            <div className="h-4 bg-slate-200 rounded w-1/4" />
            <div className="h-4 bg-slate-200 rounded w-1/4" />
            <div className="h-4 bg-slate-200 rounded w-1/6" />
            <div className="h-4 bg-slate-200 rounded w-1/6" />
            <div className="h-4 bg-slate-200 rounded w-1/12 ml-auto" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "cards-skeleton") {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse ${className}`}>
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <div className="h-3 bg-slate-200 rounded w-1/2" />
            <div className="h-8 bg-slate-200 rounded w-1/3" />
            <div className="h-3 bg-slate-100 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center py-20 px-4 text-center ${className}`}
    >
      <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-3 stroke-[2]" />
      <p className="text-sm font-medium text-slate-500">{message}</p>
    </div>
  );
};

export default LoadingState;
