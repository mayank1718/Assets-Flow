import React from "react";
import { FolderOpen } from "lucide-react";

export const EmptyState = ({
  icon: Icon = FolderOpen,
  title = "No data found",
  description,
  action,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mb-4 text-slate-400">
        {React.createElement(Icon, { className: "w-6 h-6 stroke-[1.75]" })}
      </div>
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      {description && (
        <p className="mt-1.5 text-sm text-slate-500 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};

export default EmptyState;
