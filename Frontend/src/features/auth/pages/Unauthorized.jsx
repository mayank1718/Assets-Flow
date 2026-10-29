import React from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export const Unauthorized = () => {
  const { user } = useAuth();

  const getDashboardLink = () => {
    if (user?.role === "admin") return "/admin/dashboard";
    if (user?.role === "assetManager") return "/asset-manager/dashboard";
    return "/employee/dashboard";
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-xs">
        <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-7 h-7 stroke-[2]" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Access Restricted
        </h1>
        <p className="mt-2 text-sm text-slate-500 leading-relaxed">
          You don't have the required administrative permissions to access this page.
        </p>
        <div className="mt-6">
          <Link
            to={getDashboardLink()}
            className="inline-flex items-center gap-2 h-10 px-5 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
