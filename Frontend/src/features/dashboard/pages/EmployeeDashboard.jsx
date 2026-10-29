import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Box,
  User,
  Building2,
  BadgeCheck,
  Shield,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "../../auth/hooks/useAuth";
import { useAssets } from "../../assets/hooks/useAssets";
import { useDepartment } from "../../departments/hooks/useDepartment";
import PageHeader from "../../../components/layout/PageHeader";
import DataTable from "../../../components/ui/DataTable";
import StatusBadge from "../../../components/ui/StatusBadge";

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
};

export const EmployeeDashboard = () => {
  const { user } = useAuth();
  const { hash } = useLocation();
  const { assets, loading: assetsLoading, fetchAssetsHandler } = useAssets();
  const { departments, fetchDepartmentsHandler } = useDepartment();

  useEffect(() => {
    if (hash === "#assigned-assets") {
      document
        .getElementById("assigned-assets")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  }, [hash]);

  useEffect(() => {
    fetchAssetsHandler();
    fetchDepartmentsHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter only assets allocated to this employee
  const myAssignedAssets = assets
    ? assets.filter((asset) => {
        if (!asset || !user) return false;
        const assignedId =
          typeof asset.assignedTo === "object" && asset.assignedTo?._id
            ? asset.assignedTo._id
            : asset.assignedTo;
        const userId =
          typeof asset.user === "object" && asset.user?._id
            ? asset.user._id
            : asset.user;

        return (
          assignedId === user._id ||
          userId === user._id ||
          (user.employeeId && asset.assignedEmployeeId === user.employeeId)
        );
      })
    : [];

  const getDeptName = () => {
    if (!user?.department) return "—";
    if (typeof user.department === "object" && user.department.name) {
      return user.department.name;
    }
    const found = departments?.find((d) => d._id === user.department);
    return found ? found.name : user.department;
  };

  const assetColumns = [
    {
      title: "Asset Name",
      key: "name",
      render: (item) => (
        <div>
          <span className="font-semibold text-slate-900 block">{item.name}</span>
          {item.description && (
            <span className="text-xs text-slate-500 block truncate max-w-xs">
              {item.description}
            </span>
          )}
        </div>
      ),
    },
    {
      title: "Asset Identifier",
      key: "assetTag",
      render: (item) =>
        item.assetTag ? (
          <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded">
            {item.assetTag}
          </span>
        ) : (
          "—"
        ),
    },
    {
      title: "Category",
      key: "category",
      render: (item) => (
        <span className="capitalize text-xs font-medium text-slate-600">
          {item.category || "—"}
        </span>
      ),
    },
    {
      title: "Location",
      key: "location",
      render: (item) => (
        <span className="text-xs text-slate-600">{item.location || "—"}</span>
      ),
    },
    {
      title: "Allocated Date",
      key: "allocatedAt",
      render: (item) => (
        <span className="text-xs text-slate-600">
          {formatDate(item.allocatedDate || item.allocatedAt || item.updatedAt)}
        </span>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (item) => <StatusBadge status={item.status || "Assigned"} />,
    },
    {
      title: "Action",
      key: "action",
      align: "right",
      render: (item) => (
        <Link
          to={`/assets/${item._id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
        >
          View Details
          <ExternalLink className="w-3 h-3" />
        </Link>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <PageHeader
        title={`Welcome, ${user?.fullName || user?.name || "Employee"}`}
        description="View your workplace profile and track equipment assigned to your account."
      />

      {/* Profile Overview Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl font-bold uppercase flex-shrink-0">
              {(user?.fullName || user?.name || user?.email || "E")
                .charAt(0)
                .toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {user?.fullName || user?.name || "Employee"}
              </h2>
              <p className="text-sm text-slate-500">{user?.email || "—"}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge isActive={user?.isActive ?? true} />
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 capitalize">
              <Shield className="w-3 h-3 text-slate-500" />
              {user?.role || "Employee"}
            </span>
          </div>
        </div>

        {/* Profile metadata details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0 mt-0.5">
              <BadgeCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Employee ID
              </p>
              <p className="text-sm font-semibold text-slate-800 font-mono mt-0.5">
                {user?.employeeId || "—"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Department
              </p>
              <p className="text-sm font-semibold text-slate-800 mt-0.5">
                {getDeptName()}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0 mt-0.5">
              <User className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Designation
              </p>
              <p className="text-sm font-semibold text-slate-800 mt-0.5 capitalize">
                {user?.designation || "Staff"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Box className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Assigned Assets
              </p>
              <p className="text-sm font-semibold text-emerald-700 mt-0.5">
                {assetsLoading ? "—" : `${myAssignedAssets.length} active`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* My Assigned Assets Table */}
      <div id="assigned-assets" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              My Assigned Assets
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Hardware and devices allocated to your workstation.
            </p>
          </div>
        </div>

        <DataTable
          columns={assetColumns}
          data={myAssignedAssets}
          loading={assetsLoading}
          emptyTitle="No assigned assets"
          emptyDescription="You currently have no assets assigned to your profile. Any allocated equipment will be listed here."
          emptyIcon={Box}
        />
      </div>
    </div>
  );
};

export default EmployeeDashboard;