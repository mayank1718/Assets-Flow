import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Building2,
  Box,
  CheckCircle2,
  Plus,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../../auth/hooks/useAuth";
import { useEmployee } from "../../employees/hooks/useEmployee";
import { useDepartment } from "../../departments/hooks/useDepartment";
import { useAssets } from "../../assets/hooks/useAssets";
import PageHeader from "../../../components/layout/PageHeader";
import StatCard from "../../../components/ui/StatCard";
import DataTable from "../../../components/ui/DataTable";
import StatusBadge from "../../../components/ui/StatusBadge";

export const AdminDashboard = () => {
  const { user } = useAuth();
  const {
    employees,
    loading: employeesLoading,
    fetchEmployeesHandler,
  } = useEmployee();
  const {
    departments,
    loading: departmentsLoading,
    fetchDepartmentsHandler,
  } = useDepartment();
  const {
    assets,
    loading: assetsLoading,
    fetchAssetsHandler,
  } = useAssets();

  useEffect(() => {
    fetchEmployeesHandler();
    fetchDepartmentsHandler();
    fetchAssetsHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalEmployees = employees ? employees.length : 0;
  const totalDepartments = departments ? departments.length : 0;
  const totalAssets = assets ? assets.length : 0;
  const availableAssets = assets
    ? assets.filter((a) => a.status?.toLowerCase() === "available").length
    : 0;

  const isLoading = employeesLoading || departmentsLoading || assetsLoading;

  // Recent assets (last 5)
  const recentAssets = assets ? [...assets].reverse().slice(0, 5) : [];

  const getDeptName = (deptId) => {
    if (!deptId) return "—";
    if (typeof deptId === "object" && deptId.name) return deptId.name;
    const found = departments?.find((d) => d._id === deptId);
    return found ? found.name : "—";
  };

  const assetColumns = [
    {
      title: "Asset Name",
      key: "name",
      render: (item) => (
        <div>
          <span className="font-semibold text-slate-900 block">{item.name}</span>
          {item.description && (
            <span className="text-xs text-slate-500 truncate max-w-xs block">
              {item.description}
            </span>
          )}
        </div>
      ),
    },
    {
      title: "Asset Tag",
      key: "assetTag",
      render: (item) =>
        item.assetTag ? (
          <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
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
        <span className="capitalize text-slate-600 text-xs font-medium">
          {item.category || "—"}
        </span>
      ),
    },
    {
      title: "Department",
      key: "department",
      render: (item) => (
        <span className="text-xs text-slate-600">
          {getDeptName(item.department)}
        </span>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (item) => <StatusBadge status={item.status || "available"} />,
    },
    {
      title: "Action",
      key: "action",
      align: "right",
      render: (item) => (
        <Link
          to={`/assets/${item._id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
        >
          View
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <PageHeader
        title={`Welcome back, ${user?.fullName || user?.name || "Admin"}`}
        description="Here is an overview of your organisation's assets, employees, and departments."
        action={
          <div className="flex items-center gap-2.5">
            <Link
              to="/assets/create"
              className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 transition-colors shadow-2xs"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              New Asset
            </Link>
          </div>
        }
      />

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Assets"
          value={isLoading ? "—" : totalAssets}
          subtitle="Registered organisation assets"
          icon={Box}
          iconColor="text-emerald-700 bg-emerald-50 border-emerald-100"
          to="/assets"
        />
        <StatCard
          title="Available Assets"
          value={isLoading ? "—" : availableAssets}
          subtitle="Ready for allocation"
          icon={CheckCircle2}
          iconColor="text-amber-800 bg-amber-50 border-amber-200"
          to="/assets"
        />
        <StatCard
          title="Total Employees"
          value={isLoading ? "—" : totalEmployees}
          subtitle="Active workforce"
          icon={Users}
          iconColor="text-emerald-700 bg-emerald-50 border-emerald-100"
          to="/employees"
        />
        <StatCard
          title="Departments"
          value={isLoading ? "—" : totalDepartments}
          subtitle="Operational units"
          icon={Building2}
          iconColor="text-amber-800 bg-amber-50 border-amber-200"
          to="/departments"
        />
      </div>

      {/* Quick Actions & Short Cuts */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-8 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Quick Actions
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            to="/assets/create"
            className="flex items-center justify-between p-3.5 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Box className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 group-hover:text-emerald-800">
                  Register New Asset
                </p>
                <p className="text-xs text-slate-500">Add equipment to inventory</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
          </Link>

          <Link
            to="/departments"
            className="flex items-center justify-between p-3.5 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 group-hover:text-emerald-800">
                  Manage Departments
                </p>
                <p className="text-xs text-slate-500">View and configure units</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
          </Link>

          <Link
            to="/employees"
            className="flex items-center justify-between p-3.5 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 group-hover:text-emerald-800">
                  Manage Employees
                </p>
                <p className="text-xs text-slate-500">Staff records & accounts</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
          </Link>
        </div>
      </div>

      {/* Recent Assets Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Assets</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Latest items added to your asset register.
            </p>
          </div>
          <Link
            to="/assets"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
          >
            View all assets
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <DataTable
          columns={assetColumns}
          data={recentAssets}
          loading={assetsLoading}
          emptyTitle="No assets registered yet"
          emptyDescription="Start by registering your organisation's first asset."
          emptyAction={
            <Link
              to="/assets/create"
              className="inline-flex items-center gap-2 h-9 px-4 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Register Asset
            </Link>
          }
        />
      </div>
    </div>
  );
};

export default AdminDashboard;