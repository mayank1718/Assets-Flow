import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export const PageHeader = ({
  title,
  description,
  breadcrumbs = [],
  action,
  className = "",
}) => {
  return (
    <div className={`mb-6 sm:mb-8 ${className}`}>
      {breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={crumb.label || idx}>
                {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                {crumb.to && !isLast ? (
                  <Link
                    to={crumb.to}
                    className="hover:text-slate-800 transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className={isLast ? "font-medium text-slate-800" : ""}>
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          )}
        </div>

        {action && <div className="flex items-center gap-2.5 flex-wrap flex-shrink-0">{action}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
