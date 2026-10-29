import React from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Shield,
  Layers,
} from "lucide-react";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { getNavItems, isNavItemActive } from "./navConfig";

export const Sidebar = ({ collapsed = false, onToggleCollapse }) => {
  const { user } = useAuth();
  const navItems = getNavItems(user?.role);
  const { pathname, hash } = useLocation();

  return (
    <aside
      className={`hidden md:flex flex-col bg-white border-r border-slate-200 transition-all duration-200 ease-in-out relative z-20 ${
        collapsed ? "w-18" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-4 border-b border-slate-200/80 justify-between">
        <Link
          to="/"
          className={`flex items-center gap-3 no-underline overflow-hidden ${
            collapsed ? "justify-center w-full" : ""
          }`}
          title="AssetFlow"
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs flex-shrink-0 relative">
            <Layers className="w-5 h-5 stroke-[2.25]" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-yellow-400 ring-2 ring-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-base font-bold tracking-tight text-slate-900 leading-none">
                Asset<span className="text-emerald-700">Flow</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-400 mt-1 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                Enterprise
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation items */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {!collapsed && (
          <p className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Navigation
          </p>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.to}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) => {
                const active = isNavItemActive(item, isActive, pathname, hash);
                return [
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg border-l-[3px] text-sm font-medium transition-all duration-150 group relative",
                  collapsed ? "justify-center px-2" : "",
                  active
                    ? "bg-emerald-50 border-emerald-600 text-emerald-800 font-semibold shadow-2xs"
                    : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50",
                ].join(" ")
              }}
            >
              {({ isActive }) => {
                const active = isNavItemActive(item, isActive, pathname, hash);
                return (
                  <>
                    <Icon
                      className={`w-5 h-5 flex-shrink-0 transition-colors ${
                        active
                          ? "text-emerald-600 stroke-[2.25]"
                          : "text-slate-400 group-hover:text-slate-600 stroke-[1.75]"
                      }`}
                    />
                    {!collapsed && (
                      <span className="truncate flex-1">{item.label}</span>
                    )}
                    {!collapsed && active && (
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 flex-shrink-0 ml-auto" />
                    )}
                  </>
                );
              }}
            </NavLink>
          );
        })}
      </div>

      {/* Collapse Rail Button */}
      <div className="p-3 border-t border-slate-200/80">
        <button
          type="button"
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center gap-2 p-2 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse Sidebar</span>
            </>
          )}
        </button>
      </div>

      {/* User Info Bar at bottom */}
      {!collapsed && user && (
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200/80 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center text-xs font-bold uppercase flex-shrink-0">
            {(user.fullName || user.name || user.email || "U")
              .charAt(0)
              .toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-800 truncate">
              {user.fullName || user.name || "User"}
            </p>
            <p className="text-[11px] text-slate-500 capitalize truncate flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-600" />
              {user.role === "assetManager" ? "Asset Manager" : user.role}
            </p>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
