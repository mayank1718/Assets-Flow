import React from "react";
import { Link } from "react-router-dom";

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "text-emerald-700 bg-emerald-50 border-emerald-100",
  to,
  trend,
  className = "",
}) => {
  const content = (
    <div
      className={`bg-white rounded-xl border border-slate-200 p-5 shadow-xs transition-all duration-150 hover:border-slate-300 ${
        to ? "hover:shadow-sm cursor-pointer group" : ""
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">
              {value ?? "—"}
            </span>
            {trend && (
              <span
                className={`text-xs font-medium ${
                  trend.positive ? "text-emerald-600" : "text-slate-500"
                }`}
              >
                {trend.text}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-500 truncate">{subtitle}</p>
          )}
        </div>

        {Icon && (
          <div
            className={`w-11 h-11 rounded-lg border flex items-center justify-center flex-shrink-0 transition-transform duration-150 ${
              to ? "group-hover:scale-105" : ""
            } ${iconColor}`}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="block no-underline">
        {content}
      </Link>
    );
  }

  return content;
};

export default StatCard;
