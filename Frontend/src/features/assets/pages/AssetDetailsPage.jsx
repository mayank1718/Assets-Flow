import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAssets } from "../hooks/useAssets";
import { useDepartment } from "../../departments/hooks/useDepartment";
import { useAuth } from "../../auth/hooks/useAuth";
import {
  PageLayout,
  Card,
  PrimaryButton,
  Badge,
  PageSpinner,
  ErrorBanner,
  BackLink,
  DetailRow,
  ConfirmDialog,
} from "../../shared/components/AdminUI";

const statusVariant = (status) => {
  if (!status) return "slate";
  const s = status.toLowerCase();
  if (s === "available") return "emerald";
  if (s === "in use" || s === "assigned" || s === "allocated") return "blue";
  if (s === "maintenance" || s === "under maintenance") return "amber";
  if (s === "retired" || s === "decommissioned") return "red";
  return "slate";
};

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

const formatCurrency = (value) => {
  if (value === undefined || value === null || value === "") return "—";
  const num = parseFloat(value);
  if (isNaN(num)) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(num);
};

const AssetDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchAssetDetailHandler, deleteAssetHandler } = useAssets();
  const { departments, fetchDepartmentsHandler } = useDepartment();
  const { user } = useAuth();

  const isAdminOrManager =
    user && (user.role === "admin" || user.role === "assetManager");

  const [asset, setAsset] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      await fetchDepartmentsHandler();
      const data = await fetchAssetDetailHandler(id);
      if (data) {
        setAsset(data);
      } else {
        setFetchError("Asset not found or could not be loaded.");
      }
      setInitialLoading(false);
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getDeptName = () => {
    if (!asset?.department) return "—";
    if (typeof asset.department === "object" && asset.department.name) {
      return asset.department.name;
    }
    const found = departments.find((d) => d._id === asset.department);
    return found ? found.name : "—";
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    const success = await deleteAssetHandler(id);
    setDeleteLoading(false);
    if (success) {
      navigate("/assets");
    } else {
      setDeleteDialog(false);
    }
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
        <BackLink to="/assets" label="Back to Assets" />
        <ErrorBanner message={fetchError} />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <BackLink to="/assets" label="Back to Assets" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
              {asset.name}
            </h1>
            {asset.assetTag && (
              <span className="font-mono text-sm bg-slate-100 text-slate-600 px-2.5 py-1 rounded">
                {asset.assetTag}
              </span>
            )}
            {asset.status && (
              <Badge variant={statusVariant(asset.status)}>
                {asset.status}
              </Badge>
            )}
          </div>
          {asset.description && (
            <p className="mt-1.5 text-sm text-slate-500">{asset.description}</p>
          )}
        </div>

        {isAdminOrManager && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => setDeleteDialog(true)}
              className="inline-flex items-center h-10 px-4 rounded-lg text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-colors duration-150">
              Delete
            </button>
            <Link to={`/assets/${id}/edit`}>
              <PrimaryButton>Edit Asset</PrimaryButton>
            </Link>
          </div>
        )}
      </div>

      {/* Details card */}
      <div className="max-w-2xl">
        <Card>
          <div className="px-6 py-2">
            <dl>
              <DetailRow label="Asset Name" value={asset.name} />
              <DetailRow
                label="Asset Tag"
                value={
                  asset.assetTag ? (
                    <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">
                      {asset.assetTag}
                    </span>
                  ) : undefined
                }
              />
              <DetailRow
                label="Category"
                value={
                  asset.category
                    ? asset.category.charAt(0).toUpperCase() +
                      asset.category.slice(1)
                    : undefined
                }
              />
              <DetailRow label="Department" value={getDeptName()} />
              <DetailRow label="Location" value={asset.location} />
              <DetailRow
                label="Status"
                value={
                  asset.status ? (
                    <Badge variant={statusVariant(asset.status)}>
                      {asset.status}
                    </Badge>
                  ) : undefined
                }
              />
              <DetailRow
                label="Purchase Date"
                value={formatDate(asset.purchaseDate)}
              />
              <DetailRow
                label="Purchase Cost"
                value={formatCurrency(asset.purchaseCost)}
              />
              <DetailRow label="Description" value={asset.description} />
            </dl>
          </div>
        </Card>
      </div>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={deleteDialog}
        title="Delete Asset"
        message={`Are you sure you want to permanently delete "${asset.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        danger
        loading={deleteLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialog(false)}
      />
    </PageLayout>
  );
};

export default AssetDetailsPage;