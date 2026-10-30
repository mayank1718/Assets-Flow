import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Mail,
  Building2,
  BadgeCheck,
  Shield,
  Calendar,
  User,
  Power,
  AlertCircle,
} from "lucide-react";
import { useEmployee } from "../hooks/useEmployee";
import { useDepartment } from "../../departments/hooks/useDepartment";
import PageHeader from "../../../components/layout/PageHeader";
import StatusBadge from "../../../components/ui/StatusBadge";
import LoadingState from "../../../components/ui/LoadingState";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";

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

export const EmployeeDetailsPage = () => {
  const { id } = useParams();
  const {
    fetchEmployeeByIdHandler,
    updateEmployeeStatusHandler,
  } = useEmployee();
  const { departments, fetchDepartmentsHandler } = useDepartment();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusDialog, setStatusDialog] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      await fetchDepartmentsHandler();

      const data = await fetchEmployeeByIdHandler(id);
      if (data) {
        setEmployee(data);
      } else {
        setError("Employee not found or could not be loaded.");
      }
      setLoading(false);
    };

    if (id) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getDepartmentInfo = () => {
    if (!employee?.department) return { name: "—", code: "—" };
    if (typeof employee.department === "object") {
      return {
        name: employee.department.name || "—",
        code: employee.department.code || "—",
      };
    }
    const found = departments?.find((d) => d._id === employee.department);
    return found
      ? { name: found.name, code: found.code }
      : { name: employee.department, code: "—" };
  };

  const handleStatusToggle = async () => {
    if (!employee) return;
    setStatusLoading(true);
    const targetStatus = !(employee.isActive ?? true);
    const success = await updateEmployeeStatusHandler(employee._id, targetStatus);
    setStatusLoading(false);
    setStatusDialog(false);

    if (success) {
      setEmployee((prev) => ({ ...prev, isActive: targetStatus }));
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <LoadingState message="Loading employee details..." />
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white border border-red-200 rounded-xl p-8 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 border border-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            {error || "Employee not found"}
          </h2>
          <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
            The requested employee profile does not exist or you may not have permission to view it.
          </p>
          <div className="mt-6">
            <Link
              to="/employees"
              className="inline-flex items-center gap-2 h-9 px-4 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Employees
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const dept = getDepartmentInfo();
  const isActive = employee.isActive ?? true;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <div className="mb-6">
        <Link
          to="/employees"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to Employees
        </Link>
      </div>

      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {employee.fullName || employee.name || "Employee Details"}
            </h1>
            <StatusBadge isActive={isActive} />
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Employee account details and workplace assignment.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => setStatusDialog(true)}
            className={[
              "inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-medium border transition-colors",
              isActive
                ? "text-amber-700 bg-amber-50/60 border-amber-200 hover:bg-amber-100/60"
                : "text-emerald-700 bg-emerald-50/60 border-emerald-200 hover:bg-emerald-100/60",
            ].join(" ")}
          >
            <Power className="w-3.5 h-3.5" />
            {isActive ? "Deactivate" : "Activate"}
          </button>

          <Link
            to={`/employees/${employee._id}/edit`}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 transition-colors shadow-2xs"
          >
            <Edit className="w-3.5 h-3.5" />
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Profile Card Header */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs mb-6">
        <div className="p-6 flex flex-col sm:flex-row sm:items-center gap-5 border-b border-slate-100">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl font-bold uppercase flex-shrink-0 shadow-2xs">
            {(employee.fullName || employee.name || employee.email || "E")
              .charAt(0)
              .toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-900 truncate">
                {employee.fullName || employee.name}
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 capitalize">
                <Shield className="w-3 h-3 text-slate-500" />
                {employee.role === "assetManager"
                  ? "Asset Manager"
                  : employee.role || "Employee"}
              </span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {employee.email}
              </span>
              {employee.employeeId && (
                <span className="flex items-center gap-1.5 font-mono">
                  <BadgeCheck className="w-3.5 h-3.5 text-slate-400" />
                  ID: {employee.employeeId}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Fields List */}
        <div className="p-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            Account & Employment Information
          </h3>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
            <div className="py-2 border-b border-slate-100">
              <dt className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
                Full Name
              </dt>
              <dd className="font-semibold text-slate-900">
                {employee.fullName || employee.name || "—"}
              </dd>
            </div>

            <div className="py-2 border-b border-slate-100">
              <dt className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
                Email Address
              </dt>
              <dd className="font-semibold text-slate-900">{employee.email}</dd>
            </div>

            <div className="py-2 border-b border-slate-100">
              <dt className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
                Employee ID
              </dt>
              <dd className="font-mono font-semibold text-slate-900">
                {employee.employeeId ? (
                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs">
                    {employee.employeeId}
                  </span>
                ) : (
                  "—"
                )}
              </dd>
            </div>

            <div className="py-2 border-b border-slate-100">
              <dt className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
                Department
              </dt>
              <dd className="font-semibold text-slate-900 flex items-center gap-2">
                <span>{dept.name}</span>
                {dept.code !== "—" && (
                  <span className="font-mono text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                    {dept.code}
                  </span>
                )}
              </dd>
            </div>

            <div className="py-2 border-b border-slate-100">
              <dt className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
                Role
              </dt>
              <dd className="font-semibold text-slate-900 capitalize">
                {employee.role === "assetManager"
                  ? "Asset Manager"
                  : employee.role || "Employee"}
              </dd>
            </div>

            <div className="py-2 border-b border-slate-100">
              <dt className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
                Designation
              </dt>
              <dd className="font-semibold text-slate-900 capitalize">
                {employee.designation || "Staff"}
              </dd>
            </div>

            <div className="py-2 border-b border-slate-100">
              <dt className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
                Account Status
              </dt>
              <dd className="mt-0.5">
                <StatusBadge isActive={isActive} />
              </dd>
            </div>

            <div className="py-2 border-b border-slate-100">
              <dt className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
                Registered Date
              </dt>
              <dd className="font-semibold text-slate-900 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {formatDate(employee.createdAt)}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={statusDialog}
        title={
          isActive ? "Deactivate Employee Account" : "Activate Employee Account"
        }
        message={
          isActive
            ? `Are you sure you want to deactivate ${
                employee.fullName || employee.name
              }? They will no longer be able to log in.`
            : `Are you sure you want to activate ${
                employee.fullName || employee.name
              }? Their system access will be restored.`
        }
        confirmLabel={isActive ? "Deactivate" : "Activate"}
        danger={isActive}
        loading={statusLoading}
        onConfirm={handleStatusToggle}
        onCancel={() => setStatusDialog(false)}
      />
    </div>
  );
};

export default EmployeeDetailsPage;