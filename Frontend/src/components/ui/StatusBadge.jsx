import React from "react";

export const StatusBadge = ({ status, isActive, variant, size = "md" }) => {
  // If isActive is explicitly provided as boolean
  if (typeof isActive === "boolean") {
    return (
      <span
        className={[
          "inline-flex items-center gap-1.5 rounded-full font-medium transition-colors",
          size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
          isActive
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
            : "bg-slate-100 text-slate-600 border border-slate-200",
        ].join(" ")}
      >
        <span
          className={[
            "rounded-full",
            size === "sm" ? "w-1 h-1" : "w-1.5 h-1.5",
            isActive ? "bg-emerald-500" : "bg-slate-400",
          ].join(" ")}
        />
        {isActive ? "Active" : "Inactive"}
      </span>
    );
  }

  // Derive styling from status string or explicit variant
  const s = String(status || "").toLowerCase().trim();

  let styles = "bg-slate-100 text-slate-700 border-slate-200 dot-slate-400";
  let label = status || "Unknown";

  if (
    variant === "emerald" ||
    s === "active" ||
    s === "available" ||
    s === "approved"
  ) {
    // Approved / Active: Verdant Green on Pale Green
    styles = "bg-emerald-50 text-emerald-800 border-emerald-200 dot-emerald-600";
  } else if (
    variant === "blue" ||
    s === "in use" ||
    s === "allocated" ||
    s === "assigned"
  ) {
    // In Use / Allocated: Accessible distinction (clean teal-slate or deep forest)
    styles = "bg-emerald-50/70 text-emerald-700 border-emerald-200/80 dot-emerald-500";
  } else if (
    variant === "amber" ||
    s === "maintenance" ||
    s === "under maintenance" ||
    s === "pending"
  ) {
    // Pending / Maintenance: Mellow Yellow / Amber with dark readable text
    styles = "bg-amber-50 text-amber-800 border-amber-200 dot-amber-500";
  } else if (
    variant === "red" ||
    s === "inactive" ||
    s === "retired" ||
    s === "decommissioned" ||
    s === "lost" ||
    s === "rejected"
  ) {
    // Rejected / Retired / Inactive: Accessible red with pale-red surface
    styles = "bg-red-50 text-red-700 border-red-200 dot-red-500";
  } else if (
    variant === "slate" ||
    s === "cancelled" ||
    s === "canceled"
  ) {
    // Cancelled: Neutral gray/slate
    styles = "bg-slate-100 text-slate-600 border-slate-200 dot-slate-400";
  } else if (s === "completed") {
    // Completed: Accessible distinguishable variant with pale surface
    styles = "bg-emerald-100/60 text-emerald-900 border-emerald-300 dot-emerald-700";
  } else if (variant === "indigo" || s === "admin") {
    styles = "bg-amber-50 text-amber-800 border-amber-200 dot-amber-500";
  } else if (variant === "cyan" || s === "assetmanager" || s === "asset manager") {
    styles = "bg-emerald-50 text-emerald-800 border-emerald-200 dot-emerald-600";
    label = "Asset Manager";
  } else if (s === "employee") {
    styles = "bg-slate-100 text-slate-700 border-slate-200 dot-slate-400";
    label = "Employee";
  }

  const dotColorClass = styles.split(" ").find((c) => c.startsWith("dot-"))?.replace("dot-", "bg-") || "bg-slate-400";
  const badgeClasses = styles.split(" ").filter((c) => !c.startsWith("dot-")).join(" ");

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full font-medium border capitalize transition-colors",
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
        badgeClasses,
      ].join(" ")}
    >
      <span
        className={[
          "rounded-full flex-shrink-0",
          size === "sm" ? "w-1 h-1" : "w-1.5 h-1.5",
          dotColorClass,
        ].join(" ")}
      />
      {label}
    </span>
  );
};

export default StatusBadge;
