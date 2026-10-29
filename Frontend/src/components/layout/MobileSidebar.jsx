import React from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { X, Layers, LogOut, Shield } from "lucide-react";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { getNavItems, isNavItemActive } from "./navConfig";

export const MobileSidebar = ({ open, onClose }) => {
  const { user, handleLogout } = useAuth();
  const navItems = getNavItems(user?.role);
  const { pathname, hash } = useLocation();

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 md:hidden"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white shadow-2xl flex flex-col z-10 animate-slide-right">
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-200">
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center gap-2.5 no-underline"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs relative">
              <Layers className="w-4 h-4 stroke-[2.25]" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-yellow-400 ring-2 ring-white" />
            </div>
            <span className="text-base font-bold tracking-tight text-slate-900">
              Asset<span className="text-emerald-700">Flow</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links */}
        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          <p className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Navigation
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) => {
                  const active = isNavItemActive(item, isActive, pathname, hash);
                  return [
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-lg border-l-[3px] text-sm font-medium transition-colors",
                    active
                      ? "bg-emerald-50 border-emerald-600 text-emerald-800 font-semibold"
                      : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50",
                  ].join(" ")
                }}
              >
                {({ isActive }) => {
                  const active = isNavItemActive(item, isActive, pathname, hash);
                  return (
                    <>
                      <Icon
                        className={`w-5 h-5 ${
                          active
                            ? "text-emerald-600 stroke-[2.25]"
                            : "text-slate-400 stroke-[1.75]"
                        }`}
                      />
                      <span className="flex-1">{item.label}</span>
                      {active && (
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 ml-auto" />
                      )}
                    </>
                  );
                }}
              </NavLink>
            );
          })}
        </div>

        {/* Bottom User Profile + Logout */}
        {user && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center text-xs font-bold uppercase flex-shrink-0">
                {(user.fullName || user.name || user.email || "U")
                  .charAt(0)
                  .toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">
                  {user.fullName || user.name || "User"}
                </p>
                <p className="text-xs text-slate-500 capitalize truncate flex items-center gap-1">
                  <Shield className="w-3 h-3 text-emerald-600" />
                  {user.role === "assetManager" ? "Asset Manager" : user.role}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={async () => {
                onClose();
                await handleLogout();
              }}
              className="w-full flex items-center justify-center gap-2 h-9 px-3 rounded-lg text-xs font-medium text-red-600 bg-white border border-red-200 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileSidebar;
