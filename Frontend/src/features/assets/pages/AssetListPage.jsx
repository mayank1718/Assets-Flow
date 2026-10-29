import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAssets } from "../hooks/useAssets";
import { useDepartment } from "../../departments/hooks/useDepartment";
import {
  PageLayout,
  PageHeader,
  Card,
  PrimaryButton,
  Badge,
  PageSpinner,
  ErrorBanner,
  EmptyState,
  ConfirmDialog,
} from "../../shared/components/AdminUI";
import { useAuth } from "../../auth/hooks/useAuth";

const AssetIcon = () => (
  <svg
    className="w-6 h-6"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
  </svg>
);

/**
 * Derive a badge variant from an asset status string.
 */
const statusVariant = (status) => {
  if (!status) return "slate";
  const s = status.toLowerCase();
  if (s === "available") return "emerald";
  if (s === "in use" || s === "assigned" || s === "allocated") return "blue";
  if (s === "maintenance" || s === "under maintenance") return "amber";
  if (s === "retired" || s === "decommissioned") return "red";
  return "slate";
};

const AssetListPage = () => {
  const { assets, loading, error, fetchAssetsHandler, deleteAssetHandler } =
    useAssets();
  const { fetchDepartmentsHandler, departments } = useDepartment();
  const { user } = useAuth();

  const isAdminOrManager =
    user && (user.role === "admin" || user.role === "assetManager");

  const [deleteDialog, setDeleteDialog] = useState(null); // { id, name }
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchAssetsHandler();
    fetchDepartmentsHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDeptName = (deptId) => {
    if (!deptId) return "—";
    if (typeof deptId === "object" && deptId.name) return deptId.name;
    const found = departments.find((d) => d._id === deptId);
    return found ? found.name : "—";
  };

  const openDeleteDialog = (asset) => {
    setDeleteDialog({ id: asset._id, name: asset.name });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog) return;
    setDeleteLoading(true);
    await deleteAssetHandler(deleteDialog.id);
    setDeleteLoading(false);
    setDeleteDialog(null);
  };

  return (
    <PageLayout>
      <PageHeader
        title="Assets"
        description="Browse and manage all registered assets."
        action={
          isAdminOrManager ? (
            <Link to="/assets/create">
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
                New Asset
              </PrimaryButton>
            </Link>
          ) : null
        }
      />

      {error && (
        <div className="mb-6">
          <ErrorBanner message={error} />
        </div>
      )}

      {loading ? (
        <PageSpinner />
      ) : assets.length === 0 ? (
        <Card>
          <EmptyState
            icon={<AssetIcon />}
            title="No assets registered"
            description="Once assets are registered they will appear here."
            action={
              isAdminOrManager ? (
                <Link to="/assets/create">
                  <PrimaryButton>New Asset</PrimaryButton>
                </Link>
              ) : null
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
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">
                    Asset Tag
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">
                    Category
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">
                    Department
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
                {assets.map((asset) => (
                  <tr
                    key={asset._id}
                    className="hover:bg-slate-50/60 transition-colors duration-100"
                  >
                    <td className="px-5 py-4 font-medium text-slate-900">
                      {asset.name}
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      {asset.assetTag ? (
                        <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                          {asset.assetTag}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-5 py-4 text-slate-600 hidden md:table-cell capitalize">
                      {asset.category || "—"}
                    </td>
                    <td className="px-5 py-4 text-slate-600 hidden lg:table-cell">
                      {getDeptName(asset.department)}
                    </td>
                    <td className="px-5 py-4">
                      {asset.status ? (
                        <Badge variant={statusVariant(asset.status)}>
                          {asset.status}
                        </Badge>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/assets/${asset._id}`}
                          className="inline-flex items-center h-8 px-3 rounded-lg text-xs font-medium text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors duration-150"
                        >
                          View
                        </Link>
                        {isAdminOrManager && (
                          <>
                            <Link
                              to={`/assets/${asset._id}/edit`}
                              className="inline-flex items-center h-8 px-3 rounded-lg text-xs font-medium text-blue-600 border border-blue-200 hover:bg-blue-50 transition-colors duration-150"
                            >
                              Edit
                            </Link>
                            <button
                              type="button"
                              onClick={() => openDeleteDialog(asset)}
                              className="inline-flex items-center h-8 px-3 rounded-lg text-xs font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-colors duration-150"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deleteDialog}
        title="Delete Asset"
        message={`Are you sure you want to permanently delete "${deleteDialog?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        danger
        loading={deleteLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialog(null)}
      />
    </PageLayout>
  );
};

export default AssetListPage;