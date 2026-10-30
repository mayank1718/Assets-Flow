import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDepartment } from "../hooks/useDepartment";
import {
  PageLayout,
  PageHeader,
  Card,
  PrimaryButton,
  StatusBadge,
  PageSpinner,
  ErrorBanner,
  EmptyState,
  ConfirmDialog,
} from "../../shared/components/AdminUI";

const BuildingIcon = () => (
  <svg
    className="w-6 h-6"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
  </svg>
);

const DepartmentListPage = () => {
  const {
    departments,
    loading,
    error,
    fetchDepartmentsHandler,
    updateDepartmentStatusHandler,
  } = useDepartment();

  const [statusDialog, setStatusDialog] = useState(null); // { id, name, isActive }
  const [statusLoading, setStatusLoading] = useState(false);

  useEffect(() => {
    fetchDepartmentsHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openStatusDialog = (dept) => {
    setStatusDialog({ id: dept._id, name: dept.name, isActive: dept.isActive });
  };

  const handleStatusConfirm = async () => {
    if (!statusDialog) return;
    setStatusLoading(true);
    await updateDepartmentStatusHandler(statusDialog.id, !statusDialog.isActive);
    setStatusLoading(false);
    setStatusDialog(null);
  };

  return (
    <PageLayout>
      <PageHeader
        title="Departments"
        description="Manage your organisation's departments."
        action={
          <Link to="/departments/create">
            <PrimaryButton>
              <svg
                className="w-4 h-4"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="8" y1="3" x2="8" y2="13" />
                <line x1="3" y1="8" x2="13" y2="8" />
              </svg>
              New Department
            </PrimaryButton>
          </Link>
        }
      />

      {error && (
        <div className="mb-6">
          <ErrorBanner message={error} />
        </div>
      )}

      {loading ? (
        <PageSpinner />
      ) : departments.length === 0 ? (
        <Card>
          <EmptyState
            icon={<BuildingIcon />}
            title="No departments yet"
            description="Create your first department to get started organising your assets."
            action={
              <Link to="/departments/create">
                <PrimaryButton>New Department</PrimaryButton>
              </Link>
            }
          />
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Name
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Code
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">
                    Description
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {departments.map((dept) => (
                  <tr
                    key={dept._id}
                    className="hover:bg-slate-50/60 transition-colors duration-100"
                  >
                    <td className="px-5 py-4 font-medium text-slate-900">
                      {dept.name}
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                        {dept.code}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-500 hidden md:table-cell max-w-xs truncate">
                      {dept.description || "—"}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge isActive={dept.isActive} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/departments/${dept._id}`}
                          className="inline-flex items-center h-8 px-3 rounded-lg text-xs font-medium text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors duration-150"
                        >
                          View
                        </Link>
                        <Link
                          to={`/departments/${dept._id}/edit`}
                          className="inline-flex items-center h-8 px-3 rounded-lg text-xs font-medium text-emerald-700 border border-emerald-200 hover:bg-emerald-50 transition-colors duration-150"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => openStatusDialog(dept)}
                          className={[
                            "inline-flex items-center h-8 px-3 rounded-lg text-xs font-medium border transition-colors duration-150",
                            dept.isActive
                              ? "text-amber-600 border-amber-200 hover:bg-amber-50"
                              : "text-emerald-600 border-emerald-200 hover:bg-emerald-50",
                          ].join(" ")}
                        >
                          {dept.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Status toggle confirmation */}
      <ConfirmDialog
        open={!!statusDialog}
        title={
          statusDialog?.isActive
            ? "Deactivate Department"
            : "Activate Department"
        }
        message={
          statusDialog?.isActive
            ? `Are you sure you want to deactivate "${statusDialog?.name}"? It will no longer be available for new assignments.`
            : `Are you sure you want to activate "${statusDialog?.name}"?`
        }
        confirmLabel={statusDialog?.isActive ? "Deactivate" : "Activate"}
        danger={statusDialog?.isActive}
        loading={statusLoading}
        onConfirm={handleStatusConfirm}
        onCancel={() => setStatusDialog(null)}
      />
    </PageLayout>
  );
};

export default DepartmentListPage;