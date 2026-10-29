import { createBrowserRouter } from "react-router-dom";

// Auth pages
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import Unauthorized from "../features/auth/pages/Unauthorized";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";

// Shared Dashboard Layout
import DashboardLayout from "../components/layout/DashboardLayout";

// Dashboard pages
import AdminDashboard from "../features/dashboard/pages/AdminDashboard";
import EmployeeDashboard from "../features/dashboard/pages/EmployeeDashboard";
import AssetManagerDashboard from "../features/dashboard/pages/AssetManagerDashboard";
import DashboardRedirect from "../features/dashboard/components/DashboardRedirect";

// Department pages
import DepartmentListPage from "../features/departments/pages/DepartmentListPage";
import CreateDepartmentPage from "../features/departments/pages/CreateDepartmentPage";
import DepartmentDetailsPage from "../features/departments/pages/DepartmentDetailsPage";
import EditDepartmentPage from "../features/departments/pages/EditDepartmentPage";

// Employee pages
import EmployeeListPage from "../features/employees/pages/EmployeeListPage";
import EmployeeDetailsPage from "../features/employees/pages/EmployeeDetailsPage";
import EditEmployeePage from "../features/employees/pages/EditEmployeePage";

// Asset pages
import AssetListPage from "../features/assets/pages/AssetListPage";
import CreateAssetPage from "../features/assets/pages/CreateAssetPage";
import AssetDetailsPage from "../features/assets/pages/AssetDetailsPage";
import EditAssetPage from "../features/assets/pages/EditAssetPage";
import AssetAllocationPage from "../features/assets/pages/AssetAllocationPage";

// Booking pages
import BookingListPage from "../features/booking/pages/BookingListPage";
import CreateBookingPage from "../features/booking/pages/CreateBookingPage";
import BookingDetailsPage from "../features/booking/pages/BookingDetailsPage";
import ReviewBookingsPage from "../features/booking/pages/ReviewBookingsPage";

export const routes = createBrowserRouter([
  // Public routes
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },

  // Authenticated routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          // Landing redirect
          {
            path: "/",
            element: <DashboardRedirect />,
          },

          // Employee dashboard
          {
            element: <ProtectedRoute allowedRoles={["employee"]} />,
            children: [
              {
                path: "/employee/dashboard",
                element: <EmployeeDashboard />,
              },
            ],
          },

          // Asset views
          {
            path: "/assets",
            element: <AssetListPage />,
          },
          {
            path: "/assets/:id",
            element: <AssetDetailsPage />,
          },

          // Employee booking creation
          {
            element: <ProtectedRoute allowedRoles={["employee"]} />,
            children: [
              {
                path: "/bookings/create",
                element: <CreateBookingPage />,
              },
            ],
          },

          // Booking review — admin, asset manager, approver
          {
            element: (
              <ProtectedRoute
                allowedRoles={["admin", "assetManager", "approver"]}
              />
            ),
            children: [
              {
                path: "/bookings/review",
                element: <ReviewBookingsPage />,
              },
            ],
          },

          // Booking list & details — all authorized roles
          {
            element: (
              <ProtectedRoute
                allowedRoles={[
                  "admin",
                  "assetManager",
                  "employee",
                  "approver",
                  "auditor",
                ]}
              />
            ),
            children: [
              {
                path: "/bookings",
                element: <BookingListPage />,
              },
              {
                path: "/bookings/:id",
                element: <BookingDetailsPage />,
              },
            ],
          },

          // Admin routes
          {
            element: <ProtectedRoute allowedRoles={["admin"]} />,
            children: [
              {
                path: "/admin/dashboard",
                element: <AdminDashboard />,
              },
              {
                path: "/departments",
                element: <DepartmentListPage />,
              },
              {
                path: "/departments/create",
                element: <CreateDepartmentPage />,
              },
              {
                path: "/departments/:id/edit",
                element: <EditDepartmentPage />,
              },
              {
                path: "/departments/:id",
                element: <DepartmentDetailsPage />,
              },
              {
                path: "/employees",
                element: <EmployeeListPage />,
              },
              {
                path: "/employees/:id",
                element: <EmployeeDetailsPage />,
              },
              {
                path: "/employees/:id/edit",
                element: <EditEmployeePage />,
              },
            ],
          },

          // Asset Manager and Admin routes
          {
            element: (
              <ProtectedRoute allowedRoles={["admin", "assetManager"]} />
            ),
            children: [
              {
                path: "/asset-manager/dashboard",
                element: <AssetManagerDashboard />,
              },
              {
                path: "/assets/create",
                element: <CreateAssetPage />,
              },
              {
                path: "/assets/:id/edit",
                element: <EditAssetPage />,
              },
              {
                path: "/assets/:id/allocate",
                element: <AssetAllocationPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
