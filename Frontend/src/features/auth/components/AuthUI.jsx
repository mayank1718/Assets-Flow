import React from "react";

/**
 * Reusable form input with label, optional icon, and error state.
 */
export const FormInput = React.forwardRef(
  (
    {
      id,
      label,
      type = "text",
      placeholder,
      error,
      disabled,
      rightElement,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-slate-700 select-none"
          >
            {label}
          </label>
        )}
        <div className="relative">
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
              "placeholder:text-slate-400",
              "transition-all duration-150 outline-none",
              "bg-white",
              error
                ? "border-red-400 focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:border-red-400"
                : "border-slate-200 focus-visible:ring-2 focus-visible:ring-emerald-200 focus-visible:border-emerald-600",
              disabled ? "opacity-50 cursor-not-allowed bg-slate-50" : "",
              rightElement ? "pr-10" : "",
              className,
            ]
              .filter(Boolean)
              .join(" ")}
            {...props}
          />
          {rightElement && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {rightElement}
            </div>
          )}
        </div>
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
  }
);

FormInput.displayName = "FormInput";

/**
 * Primary action button with loading state.
 */
export const PrimaryButton = ({
  children,
  loading = false,
  disabled = false,
  type = "button",
  className = "",
  ...props
}) => {
  const isDisabled = loading || disabled;
  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading}
      className={[
        "w-full h-11 px-4 rounded-lg text-sm font-semibold text-white",
        "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800",
        "transition-all duration-150 outline-none shadow-xs",
        "focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2",
        "flex items-center justify-center gap-2",
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
 * Password visibility toggle button.
 */
export const PasswordToggle = ({ visible, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    aria-label={visible ? "Hide password" : "Show password"}
    className="text-slate-400 hover:text-slate-600 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 rounded"
  >
    {visible ? (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    ) : (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )}
  </button>
);

/**
 * Inline API error alert banner.
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
 * AssetFlow brand wordmark + icon.
 */
export const AssetFlowBrand = () => (
  <div className="flex flex-col items-center gap-3">
    <div className="w-11 h-11 rounded-xl bg-emerald-600 flex items-center justify-center shadow-xs relative">
      <svg
        className="w-5 h-5 text-white"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        <line x1="12" y1="12" x2="12" y2="16" />
        <line x1="10" y1="14" x2="14" y2="14" />
      </svg>
      <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-yellow-400 ring-2 ring-white" />
    </div>
    <span className="text-xl font-bold tracking-tight text-slate-900">
      Asset<span className="text-emerald-700">Flow</span>
    </span>
  </div>
);
