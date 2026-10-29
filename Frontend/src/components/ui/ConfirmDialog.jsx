import React from "react";
import { AlertCircle, Loader2 } from "lucide-react";

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={loading ? undefined : onCancel}
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-xl border border-slate-200 shadow-xl p-6 w-full max-w-md z-10 animate-scale-in">
        <div className="flex items-start gap-4">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              danger
                ? "bg-red-50 text-red-600 border border-red-100"
                : "bg-emerald-50 text-emerald-700 border border-emerald-100"
            }`}
          >
            <AlertCircle className="w-5 h-5 stroke-[2]" />
          </div>

          <div className="flex-1 min-w-0">
            <h2
              id="confirm-dialog-title"
              className="text-base font-semibold text-slate-900 leading-6"
            >
              {title}
            </h2>
            <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="inline-flex items-center justify-center h-9 px-4 rounded-lg text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 active:bg-slate-100 transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={[
              "inline-flex items-center justify-center gap-2 h-9 px-4 rounded-lg text-sm font-semibold text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 shadow-xs",
              danger
                ? "bg-red-600 hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-400"
                : "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 focus-visible:ring-emerald-400",
            ].join(" ")}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin stroke-[2.5]" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
