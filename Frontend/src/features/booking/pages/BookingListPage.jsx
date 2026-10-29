import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  CalendarPlus,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  RefreshCw,
  Ban,
  Check,
  AlertCircle,
  CheckCircle,
  Layers,
  ArrowRight,
} from "lucide-react";
import { useBooking } from "../hooks/useBooking";
import { useAuth } from "../../auth/hooks/useAuth";
import PageHeader from "../../../components/layout/PageHeader";
import StatCard from "../../../components/ui/StatCard";
import DataTable from "../../../components/ui/DataTable";
import StatusBadge from "../../../components/ui/StatusBadge";
import SearchInput from "../../../components/ui/SearchInput";
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

export const BookingListPage = () => {
  const { user } = useAuth();
  const {
    bookings,
    loading,
    error,
    handleGetBookings,
    handleCancelBooking,
  } = useBooking();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [cancelDialog, setCancelDialog] = useState(null); // { id, assetName }
  const [cancelLoading, setCancelLoading] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: string }

  const isEmployee = user?.role === "employee";
  const isManagerOrAdmin =
    user?.role === "admin" ||
    user?.role === "assetManager" ||
    user?.role === "approver";

  useEffect(() => {
    handleGetBookings().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = () => {
    handleGetBookings().catch(() => {});
  };

  // Status counts for overview cards
  const stats = useMemo(() => {
    const list = Array.isArray(bookings) ? bookings : [];
    return {
      total: list.length,
      pending: list.filter((b) => b.status?.toLowerCase() === "pending").length,
      approved: list.filter((b) => b.status?.toLowerCase() === "approved").length,
      completed: list.filter((b) => b.status?.toLowerCase() === "completed").length,
    };
  }, [bookings]);

  // Filter bookings
  const filteredBookings = useMemo(() => {
    const list = Array.isArray(bookings) ? bookings : [];
    return list.filter((item) => {
      // Status filter
      if (
        statusFilter !== "all" &&
        item.status?.toLowerCase() !== statusFilter.toLowerCase()
      ) {
        return false;
      }

      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const assetName = getAssetName(item.asset).toLowerCase();
        const assetTag = (getAssetTag(item.asset) || "").toLowerCase();
        const requester = getRequesterName(item.requestedBy).toLowerCase();
        const purpose = (item.purpose || "").toLowerCase();

        return (
          assetName.includes(query) ||
          assetTag.includes(query) ||
          requester.includes(query) ||
          purpose.includes(query)
        );
      }

      return true;
    });
  }, [bookings, statusFilter, searchTerm]);

  const canCancelBooking = useCallback(
    (item) => {
      if (item.status?.toLowerCase() !== "pending") return false;
      if (isManagerOrAdmin) return true;

      const requesterId =
        typeof item.requestedBy === "object"
          ? item.requestedBy?._id
          : item.requestedBy;

      return user && (requesterId === user._id || requesterId === user.id);
    },
    [user, isManagerOrAdmin]
  );

  const openCancelConfirm = (item) => {
    setCancelDialog({
      id: item._id,
      assetName: getAssetName(item.asset),
    });
  };

  const handleConfirmCancel = async () => {
    if (!cancelDialog) return;
    setCancelLoading(true);
    setFeedback(null);

    try {
      await handleCancelBooking(cancelDialog.id);
      setFeedback({
        type: "success",
        message: `Booking for "${cancelDialog.assetName}" was cancelled.`,
      });
      setTimeout(() => setFeedback(null), 4000);
      setCancelDialog(null);
    } catch (err) {
      setFeedback({
        type: "error",
        message:
          err.response?.data?.message ||
          "Failed to cancel booking. Please try again.",
      });
    } finally {
      setCancelLoading(false);
    }
  };

  const columns = [
    {
      title: "Asset",
      key: "asset",
      render: (item) => {
        const tag = getAssetTag(item.asset);
        return (
          <div>
            <span className="font-semibold text-slate-900 block leading-tight">
              {getAssetName(item.asset)}
            </span>
            {tag && (
              <span className="inline-block mt-0.5 font-mono text-[11px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                {tag}
              </span>
            )}
          </div>
        );
      },
    },
    {
      title: "Requested By",
      key: "requestedBy",
      render: (item) => {
        const name = getRequesterName(item.requestedBy);
        const email = getRequesterEmail(item.requestedBy);
        return (
          <div>
            <span className="font-medium text-slate-900 text-xs block">
              {name}
            </span>
            {email && (
              <span className="text-[11px] text-slate-500 block truncate max-w-[180px]">
                {email}
              </span>
            )}
          </div>
        );
      },
    },
    {
      title: "Start Date",
      key: "startDate",
      render: (item) => (
        <span className="text-xs text-slate-700 whitespace-nowrap">
          {formatDate(item.startDate)}
        </span>
      ),
    },
    {
      title: "End Date",
      key: "endDate",
      render: (item) => (
        <span className="text-xs text-slate-700 whitespace-nowrap">
          {formatDate(item.endDate)}
        </span>
      ),
    },
    {
      title: "Purpose",
      key: "purpose",
      render: (item) => (
        <span
          className="text-xs text-slate-600 block max-w-xs truncate"
          title={item.purpose}
        >
          {item.purpose || "—"}
        </span>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (item) => <StatusBadge status={item.status || "pending"} />,
    },
    {
      title: "Actions",
      key: "actions",
      align: "right",
      render: (item) => {
        const cancelable = canCancelBooking(item);
        return (
          <div className="flex items-center justify-end gap-1.5">
            <Link
              to={`/bookings/${item._id}`}
              className="inline-flex items-center gap-1 h-7 px-2.5 rounded text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              View
            </Link>

            {cancelable && (
              <button
                type="button"
                onClick={() => openCancelConfirm(item)}
                title="Cancel Booking"
                className="inline-flex items-center gap-1 h-7 px-2.5 rounded text-xs font-medium text-red-600 bg-red-50/60 border border-red-200 hover:bg-red-100/60 transition-colors"
              >
                <Ban className="w-3.5 h-3.5" />
                Cancel
              </button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <PageHeader
        title="Bookings"
        description={
          isEmployee
            ? "Manage your asset reservation requests and view scheduling status."
            : "Review, approve, and track all workplace asset bookings."
        }
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

            {isEmployee && (
              <Link
                to="/bookings/create"
                className="inline-flex items-center gap-2 h-9 px-4 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-2xs"
              >
                <CalendarPlus className="w-4 h-4 stroke-[2.25]" />
                Request Booking
              </Link>
            )}

            {isManagerOrAdmin && (
              <Link
                to="/bookings/review"
                className="inline-flex items-center gap-2 h-9 px-3.5 rounded-lg text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100/70 transition-colors"
              >
                <Check className="w-4 h-4" />
                Review Requests ({stats.pending})
              </Link>
            )}
          </div>
        }
      />

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Bookings"
          value={loading ? "—" : stats.total}
          subtitle={isEmployee ? "Your total requests" : "All registered reservations"}
          icon={CalendarDays}
          iconColor="text-blue-600 bg-blue-50 border-blue-100"
        />
        <StatCard
          title="Pending Approval"
          value={loading ? "—" : stats.pending}
          subtitle="Awaiting decision"
          icon={Clock}
          iconColor="text-amber-600 bg-amber-50 border-amber-100"
        />
        <StatCard
          title="Approved"
          value={loading ? "—" : stats.approved}
          subtitle="Ready / in-use"
          icon={CheckCircle2}
          iconColor="text-emerald-600 bg-emerald-50 border-emerald-100"
        />
        <StatCard
          title="Completed"
          value={loading ? "—" : stats.completed}
          subtitle="Finished sessions"
          icon={Check}
          iconColor="text-emerald-600 bg-emerald-50 border-emerald-100"
        />
      </div>

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
            onClick={onRefresh}
            className="text-xs font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="w-full sm:max-w-md">
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by asset, requester, purpose..."
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { key: "all", label: "All" },
            { key: "pending", label: "Pending" },
            { key: "approved", label: "Approved" },
            { key: "completed", label: "Completed" },
            { key: "rejected", label: "Rejected" },
            { key: "cancelled", label: "Cancelled" },
          ].map((statusTab) => (
            <button
              key={statusTab.key}
              type="button"
              onClick={() => setStatusFilter(statusTab.key)}
              className={[
                "h-8 px-3 rounded-lg text-xs font-medium transition-colors whitespace-nowrap",
                statusFilter === statusTab.key
                  ? "bg-slate-900 text-white font-semibold"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80",
              ].join(" ")}
            >
              {statusTab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <DataTable
        columns={columns}
        data={filteredBookings}
        loading={loading}
        emptyTitle={
          searchTerm || statusFilter !== "all"
            ? "No matching bookings"
            : "No bookings found"
        }
        emptyDescription={
          searchTerm || statusFilter !== "all"
            ? "Try resetting your search or filter criteria."
            : isEmployee
            ? "You haven't requested any asset bookings yet. Click below to make a reservation."
            : "No asset reservation requests have been submitted yet."
        }
        emptyIcon={CalendarDays}
        emptyAction={
          isEmployee ? (
            <Link
              to="/bookings/create"
              className="inline-flex items-center gap-2 h-9 px-4 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-2xs"
            >
              <CalendarPlus className="w-3.5 h-3.5" />
              Request a Booking
            </Link>
          ) : undefined
        }
      />

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        open={!!cancelDialog}
        title="Cancel Asset Booking"
        message={`Are you sure you want to cancel the pending booking for "${cancelDialog?.assetName}"? This action cannot be reversed.`}
        confirmLabel="Cancel Booking"
        danger
        loading={cancelLoading}
        onConfirm={handleConfirmCancel}
        onCancel={() => setCancelDialog(null)}
      />
    </div>
  );
};

export default BookingListPage;