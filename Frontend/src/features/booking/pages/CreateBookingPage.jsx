import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarPlus,
  Calendar,
  Box,
  FileText,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useBooking } from "../hooks/useBooking";
import { useAssets } from "../../assets/hooks/useAssets";
import PageHeader from "../../../components/layout/PageHeader";

export const CreateBookingPage = () => {
  const navigate = useNavigate();
  const { handleCreateBooking, loading: bookingSubmitting, error: bookingError } =
    useBooking();
  const { assets, fetchAssetsHandler, loading: assetsLoading } = useAssets();

  const [fields, setFields] = useState({
    asset: "",
    startDate: "",
    endDate: "",
    purpose: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    fetchAssetsHandler().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Today's date in YYYY-MM-DD format for min date attribute
  const todayStr = useMemo(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  // List of available / registered assets
  const selectableAssets = useMemo(() => {
    if (!assets || !Array.isArray(assets)) return [];
    return assets;
  }, [assets]);

  const validate = (values) => {
    const errors = {};

    if (!values.asset) {
      errors.asset = "Please select an asset to reserve.";
    }

    if (!values.startDate) {
      errors.startDate = "Start date is required.";
    }

    if (!values.endDate) {
      errors.endDate = "End date is required.";
    } else if (values.startDate && values.endDate < values.startDate) {
      errors.endDate = "End date must be the same as or later than start date.";
    }

    if (!values.purpose.trim()) {
      errors.purpose = "Please provide the purpose of your booking.";
    } else if (values.purpose.length > 200) {
      errors.purpose = "Purpose cannot exceed 200 characters.";
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));

    if (submitted && fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (formError) setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormError(null);

    const errors = validate(fields);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    // Payload strictly includes only required fields; no requestedBy, reviewedBy, or status
    const payload = {
      asset: fields.asset,
      startDate: fields.startDate,
      endDate: fields.endDate,
      purpose: fields.purpose.trim(),
    };

    try {
      await handleCreateBooking(payload);
      navigate("/bookings");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Failed to submit booking request. Please check the details and try again.";
      setFormError(msg);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <div className="mb-6">
        <Link
          to="/bookings"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to Bookings
        </Link>
      </div>

      <PageHeader
        title="Request an Asset Booking"
        description="Submit a reservation request for workplace hardware or equipment."
        breadcrumbs={[
          { label: "Dashboard", to: "/employee/dashboard" },
          { label: "Bookings", to: "/bookings" },
          { label: "New Request" },
        ]}
      />

      {/* Form Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs">
        {/* Error notification */}
        {(formError || bookingError) && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-xl border border-red-200 bg-red-50 text-red-800 flex items-start gap-3 text-sm animate-fade-in"
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Unable to submit request</p>
              <p className="mt-0.5 text-xs text-red-700">
                {formError || bookingError}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Asset Selection */}
          <div>
            <label
              htmlFor="booking-asset"
              className="block text-sm font-semibold text-slate-800 mb-1.5"
            >
              Select Asset <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="booking-asset"
                name="asset"
                value={fields.asset}
                onChange={handleChange}
                disabled={bookingSubmitting || assetsLoading}
                className={`w-full h-11 px-3.5 rounded-lg border text-sm text-slate-900 bg-white outline-none transition-all cursor-pointer ${
                  fieldErrors.asset
                    ? "border-red-400 focus:ring-2 focus:ring-red-100"
                    : "border-slate-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                } disabled:opacity-50 disabled:bg-slate-50`}
              >
                <option value="">
                  {assetsLoading
                    ? "Loading available assets..."
                    : "-- Choose an equipment/hardware asset --"}
                </option>
                {selectableAssets.map((asset) => {
                  const tag = asset.assetTag ? ` (${asset.assetTag})` : "";
                  const category = asset.category
                    ? ` - ${asset.category.charAt(0).toUpperCase() + asset.category.slice(1)}`
                    : "";
                  const statusNote = asset.status ? ` [${asset.status}]` : "";

                  return (
                    <option key={asset._id} value={asset._id}>
                      {asset.name}
                      {tag}
                      {category}
                      {statusNote}
                    </option>
                  );
                })}
              </select>
            </div>
            {fieldErrors.asset && (
              <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                {fieldErrors.asset}
              </p>
            )}
          </div>

          {/* Date Range: Start Date & End Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Start Date */}
            <div>
              <label
                htmlFor="booking-start-date"
                className="block text-sm font-semibold text-slate-800 mb-1.5"
              >
                Start Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="booking-start-date"
                  name="startDate"
                  type="date"
                  min={todayStr}
                  value={fields.startDate}
                  onChange={handleChange}
                  disabled={bookingSubmitting}
                  className={`w-full h-11 px-3.5 rounded-lg border text-sm text-slate-900 bg-white outline-none transition-all ${
                    fieldErrors.startDate
                      ? "border-red-400 focus:ring-2 focus:ring-red-100"
                      : "border-slate-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                  } disabled:opacity-50 disabled:bg-slate-50`}
                />
              </div>
              {fieldErrors.startDate && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  {fieldErrors.startDate}
                </p>
              )}
            </div>

            {/* End Date */}
            <div>
              <label
                htmlFor="booking-end-date"
                className="block text-sm font-semibold text-slate-800 mb-1.5"
              >
                End Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="booking-end-date"
                  name="endDate"
                  type="date"
                  min={fields.startDate || todayStr}
                  value={fields.endDate}
                  onChange={handleChange}
                  disabled={bookingSubmitting}
                  className={`w-full h-11 px-3.5 rounded-lg border text-sm text-slate-900 bg-white outline-none transition-all ${
                    fieldErrors.endDate
                      ? "border-red-400 focus:ring-2 focus:ring-red-100"
                      : "border-slate-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                  } disabled:opacity-50 disabled:bg-slate-50`}
                />
              </div>
              {fieldErrors.endDate && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  {fieldErrors.endDate}
                </p>
              )}
            </div>
          </div>

          {/* Booking Purpose */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="booking-purpose"
                className="block text-sm font-semibold text-slate-800"
              >
                Booking Purpose <span className="text-red-500">*</span>
              </label>
              <span
                className={`text-xs ${
                  fields.purpose.length > 200
                    ? "text-red-600 font-semibold"
                    : "text-slate-400"
                }`}
              >
                {fields.purpose.length}/200 characters
              </span>
            </div>
            <textarea
              id="booking-purpose"
              name="purpose"
              rows={3}
              maxLength={200}
              value={fields.purpose}
              onChange={handleChange}
              disabled={bookingSubmitting}
              placeholder="e.g. Field testing with remote client equipment, training workshop demo."
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 bg-white resize-y outline-none transition-all ${
                fieldErrors.purpose
                  ? "border-red-400 focus:ring-2 focus:ring-red-100"
                  : "border-slate-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              } disabled:opacity-50 disabled:bg-slate-50`}
            />
            {fieldErrors.purpose && (
              <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                {fieldErrors.purpose}
              </p>
            )}
            <p className="mt-1 text-[11px] text-slate-400">
              Briefly describe why this asset is needed and where it will be operated.
            </p>
          </div>

          {/* Guidelines info card */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
            <p className="font-semibold text-slate-800">
              Reservation Process:
            </p>
            <p>
              Your request will be submitted in <strong>Pending</strong> status and forwarded to an Asset Manager or Administrator for review. You will receive an update once approved.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-6 border-t border-slate-100 justify-end">
            <Link
              to="/bookings"
              className="inline-flex items-center justify-center h-10 px-4 rounded-lg text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={bookingSubmitting || assetsLoading}
              className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-2xs disabled:opacity-60"
            >
              {bookingSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting Request...
                </>
              ) : (
                <>
                  <CalendarPlus className="w-4 h-4" />
                  Submit Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBookingPage;