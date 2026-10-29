import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  CheckCircle2,
  Clock,
  Wrench,
  Plus,
  ArrowRight,
  ListFilter,
  Shield,
} from "lucide-react";
import { useAuth } from "../../auth/hooks/useAuth";
import { useAssets } from "../../assets/hooks/useAssets";
import { useDepartment } from "../../departments/hooks/useDepartment";
import PageHeader from "../../../components/layout/PageHeader";
import StatCard from "../../../components/ui/StatCard";
import DataTable from "../../../components/ui/DataTable";
import StatusBadge from "../../../components/ui/StatusBadge";

export const AssetManagerDashboard = () => {
  const { user } = useAuth();
  const { assets, loading, fetchAssetsHandler } = useAssets();
  const { departments, fetchDepartmentsHandler } = useDepartment();

  useEffect(() => {
    fetchAssetsHandler();
    fetchDepartmentsHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalAssets = assets ? assets.length : 0;
  const availableAssets = assets
    ? assets.filter((a) => a.status?.toLowerCase() === "available").length
    : 0;
  const allocatedAssets = assets
    ? assets.filter((a) =>
        ["in use", "assigned", "allocated"].includes(a.status?.toLowerCase())
      ).length
    : 0;
  const maintenanceAssets = assets
    ? assets.filter((a) =>
        ["maintenance", "under maintenance"].includes(a.status?.toLowerCase())
      ).length
    : 0;

  const recentAssets = assets ? [...assets].reverse().slice(0, 6) : [];

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
          {item.location && (
            <span className="text-xs text-slate-500 block truncate">
              {item.location}
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
      title: "Actions",
      key: "actions",
      align: "right",
      render: (item) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            to={`/assets/${item._id}`}
            className="inline-flex items-center h-7 px-2.5 rounded text-xs font-medium text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            View
          </Link>
          <Link
            to={`/assets/${item._id}/edit`}
            className="inline-flex items-center h-7 px-2.5 rounded text-xs font-medium text-blue-600 border border-blue-200 hover:bg-blue-50 transition-colors"
          >
            Edit
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <PageHeader
        title={`Asset Management Overview`}
        description={`Welcome back, ${
          user?.fullName || user?.name || "Asset Manager"
        }. Monitor inventory health and allocations.`}
        action={
          <div className="flex items-center gap-2.5">
            <Link
              to="/assets/create"
              className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-2xs"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              Add Asset
            </Link>
          </div>
        }
      />

      {/* Inventory Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Inventory"
          value={loading ? "—" : totalAssets}
          subtitle="All catalogued equipment"
          icon={Box}
          iconColor="text-blue-600 bg-blue-50 border-blue-100"
          to="/assets"
        />
        <StatCard
          title="Available"
          value={loading ? "—" : availableAssets}
          subtitle="Unallocated & deployable"
          icon={CheckCircle2}
          iconColor="text-emerald-600 bg-emerald-50 border-emerald-100"
          to="/assets"
        />
        <StatCard
          title="Allocated / In Use"
          value={loading ? "—" : allocatedAssets}
          subtitle="Assigned to staff or units"
          icon={Clock}
          iconColor="text-indigo-600 bg-indigo-50 border-indigo-100"
          to="/assets"
        />
        <StatCard
          title="In Maintenance"
          value={loading ? "—" : maintenanceAssets}
          subtitle="Servicing or repairs"
          icon={Wrench}
          iconColor="text-amber-600 bg-amber-50 border-amber-100"
          to="/assets"
        />
      </div>

      {/* Quick Action Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-8 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-800">
            Quick Asset Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Register new assets, review allocations, and update equipment status.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            to="/assets"
            className="inline-flex items-center gap-2 h-9 px-3.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors"
          >
            <ListFilter className="w-3.5 h-3.5" />
            Full Inventory
          </Link>
          <Link
            to="/assets/create"
            className="inline-flex items-center gap-2 h-9 px-3.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Register Asset
          </Link>
        </div>
      </div>

      {/* Recent Inventory Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Assets</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Recently modified or registered equipment in the system.
            </p>
          </div>
          <Link
            to="/assets"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            View all inventory
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <DataTable
          columns={assetColumns}
          data={recentAssets}
          loading={loading}
          emptyTitle="No inventory found"
          emptyDescription="You haven't registered any assets yet."
          emptyAction={
            <Link
              to="/assets/create"
              className="inline-flex items-center gap-2 h-9 px-4 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add First Asset
            </Link>
          }
        />
      </div>
    </div>
  );
};

export default AssetManagerDashboard;