import React, { useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Box,
  User,
  Building2,
  Mail,
  BadgeCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Ban,
  Check,
  Shield,
  FileText,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { useBooking } from "../hooks/useBooking";
import { useAuth } from "../../auth/hooks/useAuth";
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

const formatDateTime = (dateStr) => {
  if (!dateStr) return "—";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
};

export const BookingDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const {
    handleGetBookingById,
    handleCancelBooking,
    handleCompleteBooking,
  } = useBooking();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dialogs
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const isManagerOrAdmin =
    user?.role === "admin" ||
    user?.role === "assetManager" ||
    user?.role === "approver";

  useEffect(() => {
    const loadBooking = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await handleGetBookingById(id);
        if (res?.data) {
          setBooking(res.data);
        } else {
          setError("Booking request could not be loaded.");
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Booking record not found or you may not have permission to view it."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadBooking();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Check if current user can cancel
  const canCancel = useMemo(() => {
    if (!booking) return false;
    if (booking.status?.toLowerCase() !== "pending") return false;

    if (isManagerOrAdmin) return true;

    const requesterId =
      typeof booking.requestedBy === "object"
        ? booking.requestedBy?._id
        : booking.requestedBy;

    return user && (requesterId === user._id || requesterId === user.id);
  }, [booking, user, isManagerOrAdmin]);

  // Check if user can complete (Admin / Asset Manager when status is approved)
  const canComplete = useMemo(() => {
    if (!booking) return false;
    if (booking.status?.toLowerCase() !== "approved") return false;
    return isManagerOrAdmin;
  }, [booking, isManagerOrAdmin]);

  // Check if user can review (Admin / Asset Manager / Approver when pending)
  const canReview = useMemo(() => {
    if (!booking) return false;
    if (booking.status?.toLowerCase() !== "pending") return false;
    return isManagerOrAdmin;
  }, [booking, isManagerOrAdmin]);

  const handleConfirmCancel = async () => {
    setActionLoading(true);
    setFeedback(null);
    try {
      await handleCancelBooking(id);
      setBooking((prev) => ({ ...prev, status: "cancelled" }));
      setFeedback({
        type: "success",
        message: "The booking has been cancelled successfully.",
      });
      setCancelModalOpen(false);
    } catch (err) {
      setFeedback({
        type: "error",
        message: err.response?.data?.message || "Failed to cancel booking.",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmComplete = async () => {
    setActionLoading(true);
    setFeedback(null);
    try {
      await handleCompleteBooking(id);
      setBooking((prev) => ({ ...prev, status: "completed" }));
      setFeedback({
        type: "success",
        message: "The asset booking has been marked as completed.",
      });
      setCompleteModalOpen(false);
    } catch (err) {
      setFeedback({
        type: "error",
        message: err.response?.data?.message || "Failed to complete booking.",
      });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <LoadingState message="Loading booking details..." />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white border border-red-200 rounded-xl p-8 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 border border-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            {error || "Booking Not Found"}
          </h2>
          <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
            The requested booking reservation does not exist or may have been deleted.
          </p>
          <div className="mt-6">
            <Link
              to="/bookings"
              className="inline-flex items-center gap-2 h-9 px-4 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Bookings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const asset = typeof booking.asset === "object" ? booking.asset : null;
  const assetId = asset ? asset._id : booking.asset;
  const assetName = asset?.name || asset?.assetName || "Asset Record";
  const requestedBy =
    typeof booking.requestedBy === "object" ? booking.requestedBy : null;
  const reviewedBy =
    typeof booking.reviewedBy === "object" ? booking.reviewedBy : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Booking Details
            </h1>
            <StatusBadge status={booking.status || "pending"} />
          </div>
          <p className="mt-1 text-xs text-slate-500 font-mono">
            Booking ID: {booking._id}
          </p>
        </div>

        {/* Action Buttons based on Role & Status */}
        <div className="flex items-center gap-2.5 flex-wrap flex-shrink-0">
          {canReview && (
            <Link
              to="/bookings/review"
              className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-2xs"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              Go to Review Page
            </Link>
          )}

          {canComplete && (
            <button
              type="button"
              onClick={() => setCompleteModalOpen(true)}
              className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-2xs"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              Mark as Completed
            </button>
          )}

          {canCancel && (
            <button
              type="button"
              onClick={() => setCancelModalOpen(true)}
              className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-xs font-medium text-red-600 bg-red-50 border border-red-200 hover:bg-red-100/70 transition-colors"
            >
              <Ban className="w-3.5 h-3.5" />
              Cancel Booking
            </button>
          )}
        </div>
      </div>

      {/* Feedback Banner */}
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
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
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

      {/* Rejection notice banner if rejected */}
      {booking.status?.toLowerCase() === "rejected" && (
        <div className="mb-6 p-4 rounded-xl border border-red-200 bg-red-50 text-red-900">
          <div className="flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-bold text-red-900">
                Booking Request Rejected
              </h3>
              <p className="mt-1 text-xs text-red-800">
                <strong>Reason:</strong>{" "}
                {booking.rejectionReason || "No specific reason was provided."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Details Grid */}
      <div className="space-y-6">
        {/* Section 1: Reserved Asset */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Box className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                Reserved Asset
              </h2>
            </div>
            {assetId && (
              <Link
                to={`/assets/${assetId}`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
              >
                View Asset Details
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Asset Name
              </p>
              <p className="font-semibold text-slate-900 mt-0.5">{assetName}</p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Asset Tag
              </p>
              <p className="font-mono text-xs font-semibold text-slate-800 mt-1">
                {asset?.assetTag ? (
                  <span className="bg-slate-100 px-2 py-0.5 rounded">
                    {asset.assetTag}
                  </span>
                ) : (
                  "—"
                )}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Category
              </p>
              <p className="font-medium text-slate-700 mt-0.5 capitalize">
                {asset?.category || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Reservation Schedule & Purpose */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4 mb-4">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              Schedule & Purpose
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-5">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Reservation Period
              </p>
              <p className="font-semibold text-slate-900 mt-1 flex items-center gap-1.5">
                <span>{formatDate(booking.startDate)}</span>
                <span className="text-slate-400">→</span>
                <span>{formatDate(booking.endDate)}</span>
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Request Submitted
              </p>
              <p className="font-semibold text-slate-900 mt-1">
                {formatDateTime(booking.createdAt)}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
              Booking Purpose
            </p>
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 text-sm text-slate-700 leading-relaxed">
              {booking.purpose || "No specific purpose provided."}
            </div>
          </div>
        </div>

        {/* Section 3: Requester Information */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4 mb-4">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              Requester Profile
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Employee Name
              </p>
              <p className="font-semibold text-slate-900 mt-0.5">
                {requestedBy?.fullName ||
                  requestedBy?.name ||
                  (typeof booking.requestedBy === "string"
                    ? booking.requestedBy
                    : "—")}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Email
              </p>
              <p className="font-medium text-slate-700 mt-0.5">
                {requestedBy?.email || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Employee ID
              </p>
              <p className="font-mono text-xs font-semibold text-slate-800 mt-1">
                {requestedBy?.employeeId ? (
                  <span className="bg-slate-100 px-2 py-0.5 rounded">
                    {requestedBy.employeeId}
                  </span>
                ) : (
                  "—"
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: Review Audit Trail (if reviewed) */}
        {(reviewedBy || booking.reviewedAt || booking.reviewDate) && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                Review Audit Information
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Reviewed By
                </p>
                <p className="font-semibold text-slate-900 mt-0.5">
                  {reviewedBy?.fullName ||
                    reviewedBy?.name ||
                    (typeof booking.reviewedBy === "string"
                      ? booking.reviewedBy
                      : "Administrator")}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Reviewer Email
                </p>
                <p className="font-medium text-slate-700 mt-0.5">
                  {reviewedBy?.email || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Review Date
                </p>
                <p className="font-medium text-slate-700 mt-0.5">
                  {formatDateTime(booking.reviewedAt || booking.reviewDate || booking.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        open={cancelModalOpen}
        title="Cancel Booking Request"
        message={`Are you sure you want to cancel the booking for "${assetName}"?`}
        confirmLabel="Yes, Cancel Booking"
        danger
        loading={actionLoading}
        onConfirm={handleConfirmCancel}
        onCancel={() => setCancelModalOpen(false)}
      />

      {/* Complete Confirmation Dialog */}
      <ConfirmDialog
        open={completeModalOpen}
        title="Complete Asset Booking"
        message={`Mark booking session for "${assetName}" as completed? This indicates the asset has been returned or session finished.`}
        confirmLabel="Mark as Completed"
        loading={actionLoading}
        onConfirm={handleConfirmComplete}
        onCancel={() => setCompleteModalOpen(false)}
      />
    </div>
  );
};

export default BookingDetailsPage;