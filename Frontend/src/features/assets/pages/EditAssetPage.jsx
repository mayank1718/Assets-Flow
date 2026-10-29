import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAssets } from "../hooks/useAssets";
import { useDepartment } from "../../departments/hooks/useDepartment";
import {
  PageLayout,
  PageHeader,
  Card,
  FormField,
  FormTextarea,
  FormSelect,
  PrimaryButton,
  SecondaryButton,
  ErrorBanner,
  PageSpinner,
  BackLink,
} from "../../shared/components/AdminUI";

const ASSET_CATEGORIES = [
  "electronics",
  "furniture",
  "vehicles",
  "machinery",
  "tools",
  "software",
  "other",
];

const validate = (values) => {
  const errors = {};
  if (!values.name.trim()) {
    errors.name = "Asset name is required.";
  }
  if (!values.category) {
    errors.category = "Category is required.";
  }
  return errors;
};

const EditAssetPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchAssetDetailHandler, updateAssetHandler, loading, error } =
    useAssets();
  const { departments, fetchDepartmentsHandler } = useDepartment();

  const [fields, setFields] = useState({
    name: "",
    assetTag: "",
    category: "",
    description: "",
    department: "",
    location: "",
    purchaseDate: "",
    purchaseCost: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const load = async () => {
      await fetchDepartmentsHandler();
      const asset = await fetchAssetDetailHandler(id);
      if (asset) {
        // department may be a populated object or an ID string
        const deptId =
          asset.department && typeof asset.department === "object"
            ? asset.department._id
            : asset.department ?? "";

        setFields({
          name: asset.name ?? "",
          assetTag: asset.assetTag ?? "",
          category: asset.category ?? "",
          description: asset.description ?? "",
          department: deptId,
          location: asset.location ?? "",
          purchaseDate: asset.purchaseDate
            ? asset.purchaseDate.split("T")[0]
            : "",
          purchaseCost:
            asset.purchaseCost !== undefined && asset.purchaseCost !== null
              ? String(asset.purchaseCost)
              : "",
        });
      } else {
        setFetchError("Asset not found or could not be loaded.");
      }
      setInitialLoading(false);
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (submitted && fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    const errors = validate(fields);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    const payload = {
      name: fields.name.trim(),
      category: fields.category,
    };
    if (fields.assetTag.trim()) payload.assetTag = fields.assetTag.trim();
    if (fields.description.trim()) payload.description = fields.description.trim();
    payload.department = fields.department || null;
    if (fields.location.trim()) payload.location = fields.location.trim();
    if (fields.purchaseDate) payload.purchaseDate = fields.purchaseDate;
    if (fields.purchaseCost !== "") {
      const cost = parseFloat(fields.purchaseCost);
      if (!isNaN(cost)) payload.purchaseCost = cost;
    }

    const success = await updateAssetHandler(id, payload);
    if (success) {
      navigate(`/assets/${id}`);
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
      <BackLink to={`/assets/${id}`} label="Back to Asset" />
      <PageHeader
        title="Edit Asset"
        description="Update the details for this asset."
      />

      <div className="max-w-2xl">
        <Card>
          <div className="px-6 py-6">
            {error && (
              <div className="mb-6">
                <ErrorBanner message={error} />
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField
                    id="asset-name"
                    name="name"
                    label="Asset Name"
                    placeholder="e.g. Dell Laptop"
                    required
                    value={fields.name}
                    onChange={handleChange}
                    error={fieldErrors.name}
                    disabled={loading}
                    autoFocus
                  />
                  <FormField
                    id="asset-tag"
                    name="assetTag"
                    label="Asset Tag"
                    placeholder="e.g. IT-0042"
                    value={fields.assetTag}
                    onChange={handleChange}
                    error={fieldErrors.assetTag}
                    disabled={loading}
                  />
                </div>

                <FormSelect
                  id="asset-category"
                  name="category"
                  label="Category"
                  required
                  value={fields.category}
                  onChange={handleChange}
                  error={fieldErrors.category}
                  disabled={loading}
                >
                  <option value="">Select a category</option>
                  {ASSET_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </FormSelect>

                <FormSelect
                  id="asset-department"
                  name="department"
                  label="Department"
                  value={fields.department}
                  onChange={handleChange}
                  error={fieldErrors.department}
                  disabled={loading}
                >
                  <option value="">Unassigned</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name}
                    </option>
                  ))}
                </FormSelect>

                <FormField
                  id="asset-location"
                  name="location"
                  label="Location"
                  placeholder="e.g. Floor 2 — Room 204"
                  value={fields.location}
                  onChange={handleChange}
                  error={fieldErrors.location}
                  disabled={loading}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField
                    id="asset-purchase-date"
                    name="purchaseDate"
                    label="Purchase Date"
                    type="date"
                    value={fields.purchaseDate}
                    onChange={handleChange}
                    error={fieldErrors.purchaseDate}
                    disabled={loading}
                  />
                  <FormField
                    id="asset-purchase-cost"
                    name="purchaseCost"
                    label="Purchase Cost"
                    type="number"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    value={fields.purchaseCost}
                    onChange={handleChange}
                    error={fieldErrors.purchaseCost}
                    disabled={loading}
                  />
                </div>

                <FormTextarea
                  id="asset-description"
                  name="description"
                  label="Description"
                  placeholder="Optional notes about this asset."
                  value={fields.description}
                  onChange={handleChange}
                  error={fieldErrors.description}
                  disabled={loading}
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-3 mt-7 pt-6 border-t border-slate-100">
                <PrimaryButton type="submit" loading={loading} disabled={loading}>
                  Save Changes
                </PrimaryButton>
                <SecondaryButton
                  type="button"
                  disabled={loading}
                  onClick={() => navigate(`/assets/${id}`)}
                >
                  Cancel
                </SecondaryButton>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
};

export default EditAssetPage;