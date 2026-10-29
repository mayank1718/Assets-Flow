import React, { useState, useRef, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  Menu,
  LogOut,
  ChevronDown,
  Shield,
  User,
  LayoutDashboard,
  Box,
} from "lucide-react";
import { useAuth } from "../../features/auth/hooks/useAuth";

const getPageTitle = (pathname) => {
  if (pathname.startsWith("/admin/dashboard")) return "Admin Dashboard";
  if (pathname.startsWith("/asset-manager/dashboard")) return "Asset Manager Dashboard";
  if (pathname.startsWith("/employee/dashboard")) return "Employee Dashboard";
  if (pathname === "/departments/create") return "Create Department";
  if (pathname.includes("/departments/") && pathname.endsWith("/edit")) return "Edit Department";
  if (pathname.includes("/departments/")) return "Department Details";
  if (pathname.startsWith("/departments")) return "Departments";
  if (pathname === "/employees") return "Employees";
  if (pathname.includes("/employees/") && pathname.endsWith("/edit")) return "Edit Employee";
  if (pathname.includes("/employees/")) return "Employee Details";
  if (pathname === "/assets/create") return "Register Asset";
  if (pathname.includes("/assets/") && pathname.endsWith("/edit")) return "Edit Asset";
  if (pathname.includes("/assets/") && pathname.endsWith("/allocate")) return "Allocate Asset";
  if (pathname.includes("/assets/")) return "Asset Details";
  if (pathname.startsWith("/assets")) return "Assets";
  if (pathname === "/bookings/create") return "Request Booking";
  if (pathname === "/bookings/review") return "Review Bookings";
  if (pathname.startsWith("/bookings/")) return "Booking Details";
  if (pathname.startsWith("/bookings")) return "Bookings";
  return "AssetFlow";
};

export const Header = ({ onOpenMobileMenu }) => {
  const { user, handleLogout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const pageTitle = getPageTitle(location.pathname);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const onLogoutClick = async () => {
    setDropdownOpen(false);
    await handleLogout();
    navigate("/login");
  };

  const roleLabel =
    user?.role === "admin"
      ? "Administrator"
      : user?.role === "assetManager"
      ? "Asset Manager"
      : "Employee";

  const initials = (user?.fullName || user?.name || user?.email || "U")
    .charAt(0)
    .toUpperCase();

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-10 px-4 sm:px-6 flex items-center justify-between">
      {/* Left side: Hamburger + Page Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg md:hidden transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-base font-semibold text-slate-800 tracking-tight">
            {pageTitle}
          </span>
        </div>
      </div>

      {/* Right side: User Profile dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-lg border border-slate-200/80 hover:bg-slate-50 transition-colors"
          aria-expanded={dropdownOpen}
          aria-haspopup="true"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-2xs relative">
            {initials}
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-yellow-400 ring-2 ring-white" />
          </div>

          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-900 leading-tight">
              {user?.fullName || user?.name || "User"}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              {roleLabel}
            </span>
          </div>

          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-150 ${
              dropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-slate-200 shadow-lg py-1.5 z-50">
            {/* Header info */}
            <div className="px-4 py-2.5 border-b border-slate-100">
              <p className="text-xs font-semibold text-slate-900 truncate">
                {user?.fullName || user?.name || "User"}
              </p>
              <p className="text-xs text-slate-500 truncate mt-0.5">
                {user?.email || "—"}
              </p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                <Shield className="w-3 h-3 text-emerald-600" />
                {roleLabel}
              </div>
            </div>

            {/* Menu Links */}
            <div className="py-1">
              <Link
                to="/"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 text-slate-400" />
                Go to Dashboard
              </Link>
              <Link
                to="/assets"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Box className="w-4 h-4 text-slate-400" />
                View Assets
              </Link>
            </div>

            {/* Logout button */}
            <div className="border-t border-slate-100 pt-1">
              <button
                type="button"
                onClick={onLogoutClick}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
