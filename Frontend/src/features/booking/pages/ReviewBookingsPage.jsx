import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ClipboardCheck,
  Check,
  X,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  RefreshCw,
  Box,
  User,
  Calendar,
  FileText,
  Loader2,
  CalendarDays,
} from "lucide-react";
import { useBooking } from "../hooks/useBooking";
import PageHeader from "../../../components/layout/PageHeader";
import StatusBadge from "../../../components/ui/StatusBadge";
import EmptyState from "../../../components/ui/EmptyState";
import LoadingState from "../../../components/ui/LoadingState";

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

const getAssetName = (asset) => {
  if (!asset) return "Unknown Asset";
  if (typeof asset === "object") {
    return asset.name || asset.assetName || "Unnamed Asset";
  }
  return asset;
};

const getAssetTag = (asset) => {
  if (!asset || typeof asset !== "object") return null;
  return asset.assetTag || null;
};

const getRequesterName = (requestedBy) => {
  if (!requestedBy) return "—";
  if (typeof requestedBy === "object") {
    return requestedBy.fullName || requestedBy.name || requestedBy.email || "—";
  }
  return requestedBy;
};

const getRequesterEmail = (requestedBy) => {
  if (!requestedBy || typeof requestedBy !== "object") return null;
  return requestedBy.email || null;
};

export const ReviewBookingsPage = () => {
  const { bookings, loading, handleGetBookings, handleReviewBooking } =
    useBooking();

  const [activeTab, setActiveTab] = useState("pending"); // 'pending' | 'all'
  const [processingId, setProcessingId] = useState(null);
  const [rejectModal, setRejectModal] = useState(null); // { id, assetName, requesterName }
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionError, setRejectionError] = useState("");
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: string }

  useEffect(() => {
    handleGetBookings().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = () => {
    handleGetBookings().catch(() => {});
  };

  const pendingBookings = useMemo(() => {
    const list = Array.isArray(bookings) ? bookings : [];
    return list.filter((b) => b.status?.toLowerCase() === "pending");
  }, [bookings]);

  const allBookings = useMemo(() => {
    return Array.isArray(bookings) ? bookings : [];
  }, [bookings]);

  const displayedList = activeTab === "pending" ? pendingBookings : allBookings;

  // Handle Approve action
  const handleApprove = async (booking) => {
    if (processingId) return;
    setProcessingId(booking._id);
    setFeedback(null);

    try {
      await handleReviewBooking(booking._id, "approved");
      setFeedback({
        type: "success",
        message: `Booking request for "${getAssetName(booking.asset)}" was approved.`,
      });
      setTimeout(() => setFeedback(null), 4000);
    } catch (err) {
      setFeedback({
        type: "error",
        message:
          err.response?.data?.message ||
          "Failed to approve booking. Please try again.",
      });
    } finally {
      setProcessingId(null);
    }
  };

  // Open Reject Modal
  const openRejectModal = (booking) => {
    setRejectModal({
      id: booking._id,
      assetName: getAssetName(booking.asset),
      requesterName: getRequesterName(booking.requestedBy),
    });
    setRejectionReason("");
    setRejectionError("");
  };

  // Confirm Reject
  const handleConfirmReject = async (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      setRejectionError("Please provide a reason for rejecting this booking.");
      return;
    }
    setRejectionError("");

    if (!rejectModal || processingId) return;
    setProcessingId(rejectModal.id);
    setFeedback(null);

    try {
      await handleReviewBooking(
        rejectModal.id,
        "rejected",
        rejectionReason.trim()
      );
      setFeedback({
        type: "success",
        message: `Booking request for "${rejectModal.assetName}" was rejected.`,
      });
      setTimeout(() => setFeedback(null), 4000);
      setRejectModal(null);
    } catch (err) {
      setFeedback({
        type: "error",
        message:
          err.response?.data?.message ||
          "Failed to reject booking. Please try again.",
      });
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <PageHeader
        title="Review Booking Requests"
        description="Evaluate and approve or reject employee hardware and asset reservations."
        breadcrumbs={[
          { label: "Bookings", to: "/bookings" },
          { label: "Review Requests" },
        ]}
        action={
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onRefresh}
              disabled={loading}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
            <Link
              to="/bookings"
              className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <CalendarDays className="w-3.5 h-3.5" />
              All Bookings
            </Link>
          </div>
        }
      />

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

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("pending")}
          className={[
            "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors",
            activeTab === "pending"
              ? "bg-amber-50 text-amber-800 border border-amber-200"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
          ].join(" ")}
        >
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          Pending Approvals ({pendingBookings.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={[
            "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors",
            activeTab === "all"
              ? "bg-slate-900 text-white"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
          ].join(" ")}
        >
          All Requests History ({allBookings.length})
        </button>
      </div>

      {/* Main List */}
      {loading ? (
        <div className="bg-white border border-slate-200 rounded-xl p-8">
          <LoadingState
            variant="table-skeleton"
            rows={4}
            message="Loading booking requests..."
          />
        </div>
      ) : displayedList.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-8">
          <EmptyState
            icon={ClipboardCheck}
            title={
              activeTab === "pending"
                ? "All caught up! No pending requests"
                : "No booking requests recorded"
            }
            description={
              activeTab === "pending"
                ? "There are currently no employee booking requests awaiting approval."
                : "Once employees request equipment reservations, they will appear here."
            }
          />
        </div>
      ) : (
        <div className="space-y-4">
          {displayedList.map((item) => {
            const isPending = item.status?.toLowerCase() === "pending";
            const isItemProcessing = processingId === item._id;
            const assetName = getAssetName(item.asset);
            const assetTag = getAssetTag(item.asset);
            const requester = getRequesterName(item.requestedBy);
            const requesterEmail = getRequesterEmail(item.requestedBy);

            return (
              <div
                key={item._id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-slate-300 transition-all duration-150"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Column: Asset & Requester Information */}
                  <div className="flex-1 min-w-0 space-y-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-base font-bold text-slate-900 truncate">
                        {assetName}
                      </span>
                      {assetTag && (
                        <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                          {assetTag}
                        </span>
                      )}
                      <StatusBadge status={item.status || "pending"} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate">
                          <strong>Requested by:</strong> {requester}
                          {requesterEmail ? ` (${requesterEmail})` : ""}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span>
                          <strong>Period:</strong> {formatDate(item.startDate)} →{" "}
                          {formatDate(item.endDate)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span>
                          <strong>Submitted:</strong>{" "}
                          {formatDateTime(item.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Purpose note */}
                    {item.purpose && (
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60 text-xs text-slate-700">
                        <span className="font-semibold text-slate-800">
                          Purpose:
                        </span>{" "}
                        {item.purpose}
                      </div>
                    )}

                    {/* Rejection notice if rejected */}
                    {item.status?.toLowerCase() === "rejected" &&
                      item.rejectionReason && (
                        <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800">
                          <span className="font-semibold">Rejection reason:</span>{" "}
                          {item.rejectionReason}
                        </div>
                      )}
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 flex-shrink-0">
                    <Link
                      to={`/bookings/${item._id}`}
                      className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      Details
                    </Link>

                    {isPending && (
                      <>
                        <button
                          type="button"
                          disabled={isItemProcessing}
                          onClick={() => openRejectModal(item)}
                          className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-xs font-semibold text-red-700 bg-red-50 border border-red-200 hover:bg-red-100/70 transition-colors disabled:opacity-50"
                        >
                          <X className="w-3.5 h-3.5 stroke-[2.5]" />
                          Reject
                        </button>

                        <button
                          type="button"
                          disabled={isItemProcessing}
                          onClick={() => handleApprove(item)}
                          className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 transition-colors shadow-2xs disabled:opacity-50"
                        >
                          {isItemProcessing ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          )}
                          Approve
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Rejection Reason Modal */}
      {rejectModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => {
              if (!processingId) setRejectModal(null);
            }}
          />

          {/* Modal Panel */}
          <div className="relative bg-white rounded-xl border border-slate-200 shadow-xl p-6 w-full max-w-md z-10 animate-scale-in">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 border border-red-100 flex items-center justify-center flex-shrink-0">
                <X className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Reject Booking Request
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Provide an explanation for rejecting this request for{" "}
                  <strong>{rejectModal.assetName}</strong>.
                </p>
              </div>
            </div>

            <form onSubmit={handleConfirmReject} className="space-y-4">
              <div>
                <label
                  htmlFor="rejection-reason"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Rejection Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="rejection-reason"
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => {
                    setRejectionReason(e.target.value);
                    if (rejectionError) setRejectionError("");
                  }}
                  disabled={processingId !== null}
                  placeholder="e.g. Asset is scheduled for urgent hardware maintenance during this window."
                  className={`w-full px-3 py-2 rounded-lg border text-sm text-slate-900 outline-none transition-all resize-y ${
                    rejectionError
                      ? "border-red-400 focus:ring-2 focus:ring-red-100"
                      : "border-slate-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                  }`}
                  autoFocus
                />
                {rejectionError && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {rejectionError}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  disabled={processingId !== null}
                  onClick={() => setRejectModal(null)}
                  className="h-9 px-4 rounded-lg text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processingId !== null}
                  className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg text-xs font-semibold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 transition-colors shadow-2xs disabled:opacity-60"
                >
                  {processingId ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <X className="w-3.5 h-3.5 stroke-[2.5]" />
                  )}
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewBookingsPage;