import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Search,
  Eye,
  Edit,
  Power,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Building2,
  Mail,
  BadgeCheck,
} from "lucide-react";
import { useEmployee } from "../hooks/useEmployee";
import { useDepartment } from "../../departments/hooks/useDepartment";
import PageHeader from "../../../components/layout/PageHeader";
import SearchInput from "../../../components/ui/SearchInput";
import DataTable from "../../../components/ui/DataTable";
import StatusBadge from "../../../components/ui/StatusBadge";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";

export const EmployeeListPage = () => {
  const {
    employees,
    loading,
    error,
    fetchEmployeesHandler,
    updateEmployeeStatusHandler,
  } = useEmployee();
  const { departments, fetchDepartmentsHandler } = useDepartment();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusDialog, setStatusDialog] = useState(null); // { id, name, isActive }
  const [statusLoading, setStatusLoading] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: string }

  useEffect(() => {
    fetchEmployeesHandler();
    fetchDepartmentsHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDeptName = React.useCallback(
    (deptId) => {
      if (!deptId) return "—";
      if (typeof deptId === "object" && deptId.name) return deptId.name;
      const found = departments?.find((d) => d._id === deptId);
      return found ? found.name : "—";
    },
    [departments]
  );

  // Client-side search by name, email, or employee ID
  const filteredEmployees = useMemo(() => {
    if (!employees || !Array.isArray(employees)) return [];
    if (!searchTerm.trim()) return employees;

    const query = searchTerm.toLowerCase().trim();
    return employees.filter((emp) => {
      const name = (emp.fullName || emp.name || "").toLowerCase();
      const email = (emp.email || "").toLowerCase();
      const empId = (emp.employeeId || "").toLowerCase();
      const dept = getDeptName(emp.department).toLowerCase();
      return (
        name.includes(query) ||
        email.includes(query) ||
        empId.includes(query) ||
        dept.includes(query)
      );
    });
  }, [employees, searchTerm, getDeptName]);

  const openStatusConfirm = (emp) => {
    setStatusDialog({
      id: emp._id,
      name: emp.fullName || emp.name || "Employee",
      isActive: emp.isActive ?? true,
    });
  };

  const handleStatusConfirm = async () => {
    if (!statusDialog) return;
    setStatusLoading(true);
    setFeedback(null);

    const targetStatus = !statusDialog.isActive;
    const success = await updateEmployeeStatusHandler(
      statusDialog.id,
      targetStatus
    );

    setStatusLoading(false);
    setStatusDialog(null);

    if (success) {
      setFeedback({
        type: "success",
        message: `Employee "${statusDialog.name}" has been ${
          targetStatus ? "activated" : "deactivated"
        } successfully.`,
      });
      // Auto-clear feedback after 4 seconds
      setTimeout(() => setFeedback(null), 4000);
    } else {
      setFeedback({
        type: "error",
        message: `Failed to update status for "${statusDialog.name}".`,
      });
    }
  };

  const columns = [
    {
      title: "Employee",
      key: "name",
      render: (emp) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold uppercase flex-shrink-0">
            {(emp.fullName || emp.name || emp.email || "E")
              .charAt(0)
              .toUpperCase()}
          </div>
          <div>
            <Link
              to={`/employees/${emp._id}`}
              className="font-semibold text-slate-900 hover:text-blue-600 transition-colors block leading-tight"
            >
              {emp.fullName || emp.name || "Unnamed Employee"}
            </Link>
            <span className="text-xs text-slate-500 block">{emp.email}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Employee ID",
      key: "employeeId",
      render: (emp) =>
        emp.employeeId ? (
          <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
            {emp.employeeId}
          </span>
        ) : (
          "—"
        ),
    },
    {
      title: "Department",
      key: "department",
      render: (emp) => (
        <span className="text-xs text-slate-700 font-medium">
          {getDeptName(emp.department)}
        </span>
      ),
    },
    {
      title: "Role",
      key: "role",
      render: (emp) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 capitalize">
          {emp.role === "assetManager" ? "Asset Manager" : emp.role || "Employee"}
        </span>
      ),
    },
    {
      title: "Account Status",
      key: "isActive",
      render: (emp) => <StatusBadge isActive={emp.isActive ?? true} />,
    },
    {
      title: "Actions",
      key: "actions",
      align: "right",
      render: (emp) => {
        const isActive = emp.isActive ?? true;
        return (
          <div className="flex items-center justify-end gap-1.5">
            <Link
              to={`/employees/${emp._id}`}
              title="View profile"
              className="inline-flex items-center gap-1 h-7 px-2.5 rounded text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              View
            </Link>
            <Link
              to={`/employees/${emp._id}/edit`}
              title="Edit employee"
              className="inline-flex items-center gap-1 h-7 px-2.5 rounded text-xs font-medium text-blue-600 bg-blue-50/60 border border-blue-200 hover:bg-blue-100/60 transition-colors"
            >
              <Edit className="w-3.5 h-3.5" />
              Edit
            </Link>
            <button
              type="button"
              onClick={() => openStatusConfirm(emp)}
              title={isActive ? "Deactivate employee" : "Activate employee"}
              className={[
                "inline-flex items-center gap-1 h-7 px-2.5 rounded text-xs font-medium border transition-colors",
                isActive
                  ? "text-amber-700 bg-amber-50/60 border-amber-200 hover:bg-amber-100/60"
                  : "text-emerald-700 bg-emerald-50/60 border-emerald-200 hover:bg-emerald-100/60",
              ].join(" ")}
            >
              <Power className="w-3.5 h-3.5" />
              {isActive ? "Deactivate" : "Activate"}
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <PageHeader
        title="Employees"
        description="Browse, filter, and manage staff accounts and credentials."
        breadcrumbs={[
          { label: "Dashboard", to: "/admin/dashboard" },
          { label: "Employees" },
        ]}
        action={
          <button
            type="button"
            onClick={() => fetchEmployeesHandler()}
            disabled={loading}
            className="inline-flex items-center gap-2 h-9 px-3.5 rounded-lg text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        }
      />

      {/* Success / Error Feedback Banner */}
      {feedback && (
        <div
          role="alert"
          className={`mb-6 p-4 rounded-xl border flex items-center justify-between gap-3 text-sm animate-fade-in ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedback.type === "success" ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs font-medium underline opacity-80 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* General Context Error */}
      {error && !feedback && (
        <div
          role="alert"
          className="mb-6 p-4 rounded-xl border border-red-200 bg-red-50 text-red-800 flex items-center justify-between text-sm"
        >
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => fetchEmployeesHandler()}
            className="text-xs font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Search and Filters Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="w-full sm:max-w-md">
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, employee ID..."
          />
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span>
            Showing{" "}
            <strong className="text-slate-800 font-semibold">
              {filteredEmployees.length}
            </strong>{" "}
            of {employees?.length || 0} employees
          </span>
        </div>
      </div>

      {/* Employees Table */}
      <DataTable
        columns={columns}
        data={filteredEmployees}
        loading={loading}
        emptyTitle={
          searchTerm ? "No matching employees" : "No employees registered"
        }
        emptyDescription={
          searchTerm
            ? `No records matched "${searchTerm}". Try a different keyword.`
            : "No employee accounts found in the system."
        }
        emptyIcon={Users}
        emptyAction={
          searchTerm ? (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="inline-flex items-center h-8 px-3 rounded-lg text-xs font-medium text-slate-700 border border-slate-200 hover:bg-slate-50"
            >
              Clear Search
            </button>
          ) : undefined
        }
      />

      {/* Activate / Deactivate Confirmation Dialog */}
      <ConfirmDialog
        open={!!statusDialog}
        title={
          statusDialog?.isActive
            ? "Deactivate Employee Account"
            : "Activate Employee Account"
        }
        message={
          statusDialog?.isActive
            ? `Are you sure you want to deactivate "${statusDialog?.name}"? They will lose access to the system until reactivated.`
            : `Are you sure you want to activate "${statusDialog?.name}"? Their account access will be restored.`
        }
        confirmLabel={statusDialog?.isActive ? "Deactivate" : "Activate"}
        danger={statusDialog?.isActive}
        loading={statusLoading}
        onConfirm={handleStatusConfirm}
        onCancel={() => setStatusDialog(null)}
      />
    </div>
  );
};

export default EmployeeListPage;