import React from "react";
import { Link } from "react-router-dom";

/**
 * Page layout wrapper with consistent padding and max-width.
 */
export const PageLayout = ({ children }) => (
  <div className="w-full">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {children}
    </div>
  </div>
);

/**
 * Page header with title, optional description, and optional action slot.
 */
export const PageHeader = ({ title, description, action }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
    <div>
      <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
        {title}
      </h1>
      {description && (
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      )}
    </div>
    {action && <div className="flex-shrink-0">{action}</div>}
  </div>
);

/**
 * Card container with border and subtle shadow.
 */
export const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white border border-slate-200 rounded-xl shadow-sm ${className}`}
  >
    {children}
  </div>
);

/**
 * Primary action button.
 */
export const PrimaryButton = ({
  children,
  loading = false,
  disabled = false,
  type = "button",
  className = "",
  onClick,
  ...props
}) => {
  const isDisabled = loading || disabled;
  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading}
      onClick={onClick}
      className={[
        "inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg",
        "text-sm font-semibold text-white bg-emerald-600",
        "hover:bg-emerald-700 active:bg-emerald-800",
        "transition-colors duration-150 outline-none shadow-xs",
        "focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2",
        isDisabled ? "opacity-60 cursor-not-allowed pointer-events-none" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {loading && (
        <svg
          className="w-4 h-4 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

/**
 * Secondary / outline button.
 */
export const SecondaryButton = ({
  children,
  disabled = false,
  type = "button",
  className = "",
  onClick,
  ...props
}) => (
  <button
    type={type}
    disabled={disabled}
    onClick={onClick}
    className={[
      "inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg",
      "text-sm font-medium text-slate-700 bg-white",
      "border border-slate-200 hover:bg-slate-50 active:bg-slate-100",
      "transition-colors duration-150 outline-none",
      "focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2",
      disabled ? "opacity-60 cursor-not-allowed" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ")}
    {...props}
  >
    {children}
  </button>
);

/**
 * Danger / destructive button.
 */
export const DangerButton = ({
  children,
  loading = false,
  disabled = false,
  type = "button",
  className = "",
  onClick,
  ...props
}) => {
  const isDisabled = loading || disabled;
  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading}
      onClick={onClick}
      className={[
        "inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg",
        "text-sm font-semibold text-white bg-red-600",
        "hover:bg-red-700 active:bg-red-800",
        "transition-colors duration-150 outline-none shadow-xs",
        "focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2",
        isDisabled ? "opacity-60 cursor-not-allowed pointer-events-none" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {loading && (
        <svg
          className="w-4 h-4 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

/**
 * Form input with label and error.
 */
export const FormField = React.forwardRef(
  (
    {
      id,
      label,
      type = "text",
      placeholder,
      error,
      disabled,
      required,
      className = "",
      ...props
    },
    ref
  ) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-slate-700 select-none"
        >
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={[
          "w-full h-11 px-3.5 rounded-lg border text-sm text-slate-900",
          "placeholder:text-slate-400 bg-white",
          "transition-all duration-150 outline-none",
          error
            ? "border-red-400 focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:border-red-400"
            : "border-slate-200 focus-visible:ring-2 focus-visible:ring-emerald-200 focus-visible:border-emerald-600",
          disabled ? "opacity-50 cursor-not-allowed bg-slate-50" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-xs text-red-600 flex items-center gap-1"
        >
          <svg
            className="w-3.5 h-3.5 flex-shrink-0"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm-.75 3.75a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-1.5 0v-3.5zm.75 6.5a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
);
FormField.displayName = "FormField";

/**
 * Textarea form field with label and error.
 */
export const FormTextarea = ({
  id,
  label,
  placeholder,
  error,
  disabled,
  required,
  rows = 3,
  className = "",
  ...props
}) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label
        htmlFor={id}
        className="text-sm font-medium text-slate-700 select-none"
      >
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
    )}
    <textarea
      id={id}
      rows={rows}
      placeholder={placeholder}
      disabled={disabled}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
      className={[
        "w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900",
        "placeholder:text-slate-400 bg-white resize-y",
        "transition-all duration-150 outline-none",
        error
          ? "border-red-400 focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:border-red-400"
          : "border-slate-200 focus-visible:ring-2 focus-visible:ring-emerald-200 focus-visible:border-emerald-600",
        disabled ? "opacity-50 cursor-not-allowed bg-slate-50" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
    {error && (
      <p
        id={`${id}-error`}
        role="alert"
        className="text-xs text-red-600 flex items-center gap-1"
      >
        <svg
          className="w-3.5 h-3.5 flex-shrink-0"
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm-.75 3.75a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-1.5 0v-3.5zm.75 6.5a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5z" />
        </svg>
        {error}
      </p>
    )}
  </div>
);

/**
 * Select / dropdown field with label and error.
 */
export const FormSelect = ({
  id,
  label,
  error,
  disabled,
  required,
  className = "",
  children,
  ...props
}) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label
        htmlFor={id}
        className="text-sm font-medium text-slate-700 select-none"
      >
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
    )}
    <select
      id={id}
      disabled={disabled}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
      className={[
        "w-full h-11 px-3.5 rounded-lg border text-sm text-slate-900 bg-white",
        "transition-all duration-150 outline-none appearance-none",
        "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 viewBox%3D%220 0 16 16%22 fill%3D%22%2368756C%22%3E%3Cpath d%3D%22M4 6l4 4 4-4%22 stroke%3D%22%2368756C%22 stroke-width%3D%221.5%22 stroke-linecap%3D%22round%22 stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:1rem_1rem] pr-9",
        error
          ? "border-red-400 focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:border-red-400"
          : "border-slate-200 focus-visible:ring-2 focus-visible:ring-emerald-200 focus-visible:border-emerald-600",
        disabled ? "opacity-50 cursor-not-allowed bg-slate-50" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </select>
    {error && (
      <p
        id={`${id}-error`}
        role="alert"
        className="text-xs text-red-600 flex items-center gap-1"
      >
        <svg
          className="w-3.5 h-3.5 flex-shrink-0"
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm-.75 3.75a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-1.5 0v-3.5zm.75 6.5a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5z" />
        </svg>
        {error}
      </p>
    )}
  </div>
);

/**
 * Inline error banner for API errors.
 */
export const ErrorBanner = ({ message }) => {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="flex items-start gap-2.5 px-3.5 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm"
    >
      <svg
        className="w-4 h-4 mt-0.5 flex-shrink-0"
        viewBox="0 0 16 16"
        fill="currentColor"
      >
        <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm-.75 3.75a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-1.5 0v-3.5zm.75 6.5a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5z" />
      </svg>
      <span>{message}</span>
    </div>
  );
};

/**
 * Inline spinner for loading states inside a page.
 */
export const PageSpinner = () => (
  <div className="flex items-center justify-center py-24">
    <div className="flex flex-col items-center gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />
      <p className="text-sm text-slate-500 font-medium">Loading...</p>
    </div>
  </div>
);

/**
 * Empty state illustration + message.
 */
export const EmptyState = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    {icon && (
      <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
        {icon}
      </div>
    )}
    <h3 className="text-base font-semibold text-slate-700">{title}</h3>
    {description && (
      <p className="mt-1.5 text-sm text-slate-500 max-w-xs">{description}</p>
    )}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

/**
 * Status badge — green for active, slate for inactive.
 */
export const StatusBadge = ({ isActive }) => (
  <span
    className={[
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
      isActive
        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
        : "bg-slate-100 text-slate-500 border border-slate-200",
    ].join(" ")}
  >
    <span
      className={[
        "w-1.5 h-1.5 rounded-full",
        isActive ? "bg-emerald-600" : "bg-slate-400",
      ].join(" ")}
    />
    {isActive ? "Active" : "Inactive"}
  </span>
);

/**
 * Generic text badge with colour variant.
 */
export const Badge = ({ children, variant = "slate" }) => {
  const variants = {
    slate: "bg-slate-100 text-slate-600 border-slate-200",
    blue: "bg-emerald-50/70 text-emerald-700 border-emerald-200",
    emerald: "bg-emerald-50 text-emerald-800 border-emerald-200",
    amber: "bg-amber-50 text-amber-800 border-amber-200",
    red: "bg-red-50 text-red-700 border-red-200",
    violet: "bg-amber-50 text-amber-800 border-amber-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${variants[variant] ?? variants.slate}`}
    >
      {children}
    </span>
  );
};

/**
 * Confirmation dialog (modal) for destructive actions.
 */
export const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
  danger = false,
}) => {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onCancel}
      />
      {/* Panel */}
      <div className="relative bg-white rounded-xl border border-slate-200 shadow-xl p-6 w-full max-w-sm">
        <h2
          id="confirm-dialog-title"
          className="text-base font-semibold text-slate-900"
        >
          {title}
        </h2>
        <p className="mt-2 text-sm text-slate-500">{message}</p>
        <div className="mt-6 flex gap-3 justify-end">
          <SecondaryButton onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </SecondaryButton>
          {danger ? (
            <DangerButton loading={loading} onClick={onConfirm}>
              {confirmLabel}
            </DangerButton>
          ) : (
            <PrimaryButton loading={loading} onClick={onConfirm}>
              {confirmLabel}
            </PrimaryButton>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Back navigation link with chevron.
 */
export const BackLink = ({ to, label }) => {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors duration-150 mb-6 group"
    >
      <svg
        className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-150"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 12L6 8l4-4" />
      </svg>
      {label}
    </Link>
  );
};

/**
 * Detail row for key/value display on details pages.
 */
export const DetailRow = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-3.5 border-b border-slate-100 last:border-0">
    <dt className="text-sm font-medium text-slate-500 sm:w-40 flex-shrink-0">
      {label}
    </dt>
    <dd className="text-sm text-slate-900 flex-1">{value ?? "—"}</dd>
  </div>
);
