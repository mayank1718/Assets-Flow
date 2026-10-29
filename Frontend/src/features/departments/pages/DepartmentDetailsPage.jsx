import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDepartment } from "../hooks/useDepartment";
import {
  PageLayout,
  Card,
  PrimaryButton,
  SecondaryButton,
  StatusBadge,
  PageSpinner,
  ErrorBanner,
  BackLink,
  DetailRow,
  ConfirmDialog,
} from "../../shared/components/AdminUI";

const DepartmentDetailsPage = () => {
  const { id } = useParams();
  const { fetchDepartmentByIdHandler, updateDepartmentStatusHandler, loading } =
    useDepartment();

  const [dept, setDept] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [statusDialog, setStatusDialog] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await fetchDepartmentByIdHandler(id);
      if (data) {
        setDept(data);
      } else {
        setFetchError("Department not found or could not be loaded.");
      }
      setInitialLoading(false);
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleStatusConfirm = async () => {
    setStatusLoading(true);
    const success = await updateDepartmentStatusHandler(
      id,
      !dept.isActive,
    );
    if (success) {
      // Refresh the local dept state
      const updated = await fetchDepartmentByIdHandler(id);
      if (updated) setDept(updated);
    }
    setStatusLoading(false);
    setStatusDialog(false);
  };

  if (initialLoading) {
    return (
      <PageLayout>
        <PageSpinner />
      </PageLayout>
    );
  }

  if (fetchError) {
    return (
      <PageLayout>
        <BackLink to="/departments" label="Back to Departments" />
        <ErrorBanner message={fetchError} />
      </PageLayout>
    );
  }


  return (
    <PageLayout>
      <BackLink to="/departments" label="Back to Departments" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
                {dept.name}
              </h1>
              <span className="font-mono text-sm bg-slate-100 text-slate-600 px-2.5 py-1 rounded">
                {dept.code}
              </span>
              <StatusBadge isActive={dept.isActive} />
            </div>
            {dept.description && (
              <p className="mt-1.5 text-sm text-slate-500">
                {dept.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => setStatusDialog(true)}
            disabled={loading}
            className={[
              "inline-flex items-center h-10 px-4 rounded-lg text-sm font-medium border transition-colors duration-150",
              dept.isActive
                ? "text-amber-600 border-amber-200 hover:bg-amber-50"
                : "text-emerald-600 border-emerald-200 hover:bg-emerald-50",
              loading ? "opacity-60 cursor-not-allowed" : "",
            ].join(" ")}>
            {dept.isActive ? "Deactivate" : "Activate"}
          </button>
          <Link to={`/departments/${id}/edit`}>
            <PrimaryButton>Edit Department</PrimaryButton>
          </Link>
        </div>
      </div>

      {/* Details card */}
      <div className="max-w-2xl">
        <Card>
          <div className="px-6 py-2">
            <dl>
              <DetailRow label="Department Name" value={dept.name} />
              <DetailRow
                label="Code"
                value={
                  <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">
                    {dept.code}
                  </span>
                }
              />
              <DetailRow
                label="Description"
                value={dept.description || "No description provided."}
              />
              <DetailRow
                label="Status"
                value={<StatusBadge isActive={dept.isActive} />}
              />
            </dl>
          </div>
        </Card>
      </div>

      {/* Status confirmation */}
      <ConfirmDialog
        open={statusDialog}
        title={dept.isActive ? "Deactivate Department" : "Activate Department"}
        message={
          dept.isActive
            ? `Are you sure you want to deactivate "${dept.name}"?`
            : `Are you sure you want to activate "${dept.name}"?`
        }
        confirmLabel={dept.isActive ? "Deactivate" : "Activate"}
        danger={dept.isActive}
        loading={statusLoading}
        onConfirm={handleStatusConfirm}
        onCancel={() => setStatusDialog(false)}
      />
    </PageLayout>
  );
};

export default DepartmentDetailsPage;
