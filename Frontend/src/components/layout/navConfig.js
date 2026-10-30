import {
  LayoutDashboard,
  Building2,
  Users,
  Box,
  CalendarDays,
  ClipboardCheck,
  CalendarPlus,
} from "lucide-react";

export const getNavItems = (role) => {
  switch (role) {
    case "admin":
      return [
        {
          label: "Dashboard",
          to: "/admin/dashboard",
          icon: LayoutDashboard,
        },
        {
          label: "Departments",
          to: "/departments",
          icon: Building2,
        },
        {
          label: "Employees",
          to: "/employees",
          icon: Users,
        },
        {
          label: "Assets",
          to: "/assets",
          icon: Box,
        },
        {
          label: "Bookings",
          to: "/bookings",
          icon: CalendarDays,
        },
        {
          label: "Review Bookings",
          to: "/bookings/review",
          icon: ClipboardCheck,
        },
      ];

    case "assetManager":
      return [
        {
          label: "Dashboard",
          to: "/asset-manager/dashboard",
          icon: LayoutDashboard,
        },
        {
          label: "Assets",
          to: "/assets",
          icon: Box,
        },
        {
          label: "Bookings",
          to: "/bookings",
          icon: CalendarDays,
        },
        {
          label: "Review Bookings",
          to: "/bookings/review",
          icon: ClipboardCheck,
        },
      ];

    case "approver":
      return [
        {
          label: "Bookings",
          to: "/bookings",
          icon: CalendarDays,
        },
        {
          label: "Review Bookings",
          to: "/bookings/review",
          icon: ClipboardCheck,
        },
      ];

    case "employee":
      return [
        {
          label: "Dashboard",
          to: "/employee/dashboard",
          icon: LayoutDashboard,
        },
        {
          label: "My Assigned Assets",
          to: "/employee/dashboard#assigned-assets",
          icon: Box,
        },
        {
          label: "Bookings",
          to: "/bookings",
          icon: CalendarDays,
        },
        {
          label: "Request Booking",
          to: "/bookings/create",
          icon: CalendarPlus,
        },
      ];

    default:
      return [
        {
          label: "Bookings",
          to: "/bookings",
          icon: CalendarDays,
        },
      ];
  }
};

export const isNavItemActive = (item, isActive, pathname, hash) => {
  if (!isActive) return false;

  if (
    item.to === "/bookings" &&
    (pathname === "/bookings/review" ||
      pathname.startsWith("/bookings/review/") ||
      pathname === "/bookings/create" ||
      pathname.startsWith("/bookings/create/"))
  ) {
    return false;
  }

  if (item.to === "/employee/dashboard") {
    return !hash;
  }

  if (item.to === "/employee/dashboard#assigned-assets") {
    return hash === "#assigned-assets";
  }

  return true;
};
