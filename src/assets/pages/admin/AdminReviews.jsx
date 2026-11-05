import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import Tooltip from "@mui/material/Tooltip";
import { toast } from "react-toastify";
import {
  getAdminReviews,
  toggleReviewVisibility,
} from "../../../actions/reviewActions";
import { adminDataGridSx } from "../../../utils/adminDataGridTheme";

const formatDate = (value) => {
  if (!value) return "";
  try {
    return new Date(value).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
};

export const AdminReviews = () => {
  const dispatch = useDispatch();
  const [filterMode, setFilterMode] = useState("all"); // "all", "public", "hidden"
  const [ratingFilter, setRatingFilter] = useState("all");

  const { loading, reviews: rawReviews } = useSelector(
    (state) => state.adminReviews || {}
  );
  const { loading: moderating } = useSelector(
    (state) => state.reviewModeration || {}
  );

  useEffect(() => {
    dispatch(getAdminReviews());
  }, [dispatch]);

  // Map backend shape to DataGrid row shape
  const reviews = useMemo(
    () =>
      (rawReviews || []).map((r) => {
        const author = r.user
          ? `${r.user.firstName || ""} ${r.user.lastName || ""}`.trim()
          : "Customer";
        return {
          id: r._id,
          customer: author || "Customer",
          email: r.user?.email || "",
          product: r.product?.name || "Deleted product",
          rating: r.rating,
          title: r.title,
          body: r.comment,
          createdAt: formatDate(r.createdAt),
          isVerifiedPurchase: r.isVerifiedPurchase,
          isHidden: r.isHidden,
        };
      }),
    [rawReviews]
  );

  const publicCount = reviews.filter((r) => !r.isHidden).length;
  const hiddenCount = reviews.filter((r) => r.isHidden).length;

  const handleToggleHide = useCallback(
    async (reviewId) => {
      const result = await dispatch(toggleReviewVisibility(reviewId));
      if (result?.type?.endsWith?.("SUCCESS")) {
        toast.success("Review visibility updated.");
      }
      dispatch(getAdminReviews());
    },
    [dispatch]
  );

  const filteredReviews = reviews.filter((r) => {
    const matchesVisibility =
      filterMode === "all" ||
      (filterMode === "public" && !r.isHidden) ||
      (filterMode === "hidden" && r.isHidden);
    const matchesRating =
      ratingFilter === "all" || String(r.rating) === ratingFilter;

    return matchesVisibility && matchesRating;
  });

  const columns = useMemo(
    () => [
      {
        field: "id",
        headerName: "ID",
        width: 110,
        renderCell: (params) => (
          <span className="font-mono font-bold text-zinc-900 text-xs">
            {params.row.id}
          </span>
        ),
      },
      {
        field: "customer",
        headerName: "Customer",
        flex: 1.2,
        minWidth: 200,
        renderCell: (params) => {
          const r = params.row;
          return (
            <div className="flex min-w-0 w-full flex-col justify-center leading-tight">
              <div className="flex min-w-0 w-full items-center gap-1.5">
                <span
                  className="min-w-0 flex-1 truncate font-semibold text-zinc-900 text-xs"
                  title={r.customer}
                >
                  {r.customer}
                </span>
                {r.isVerifiedPurchase ? (
                  <span className="admin-table-badge shrink-0 whitespace-nowrap gap-1 text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <svg
                      className="w-3 h-3 text-emerald-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      aria-hidden="true"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Verified
                  </span>
                ) : (
                  <span className="admin-table-badge shrink-0 whitespace-nowrap text-[11px] text-zinc-500 bg-zinc-100">
                    Unverified
                  </span>
                )}
              </div>
              <span className="min-w-0 max-w-full text-[11px] text-zinc-500 font-mono truncate mt-1" title={r.email}>
                {r.email}
              </span>
            </div>
          );
        },
      },
      {
        field: "product",
        headerName: "Product",
        flex: 1.1,
        minWidth: 160,
        renderCell: (params) => (
          <span className="font-medium text-zinc-900 text-xs truncate">
            {params.row.product}
          </span>
        ),
      },
      {
        field: "rating",
        headerName: "Rating",
        width: 120,
        type: "number",
        headerAlign: "left",
        align: "left",
        renderCell: (params) => {
          const rating = params.row.rating;
          return (
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < rating
                        ? "text-amber-400 fill-amber-400"
                        : "text-zinc-200 fill-zinc-200"
                    }`}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <span className="font-mono text-xs font-semibold text-zinc-600">
                {rating}
                <span className="sr-only"> out of 5</span>
              </span>
            </div>
          );
        },
      },
      {
        field: "body",
        headerName: "Review",
        flex: 2.2,
        minWidth: 320,
        renderCell: (params) => {
          const r = params.row;
          return (
            <div className="flex flex-col justify-center max-w-md leading-tight">
              <p className="font-semibold text-zinc-900 text-xs truncate">
                {r.title}
              </p>
              <Tooltip
                arrow
                placement="top-start"
                enterDelay={250}
                title={
                  <span className="block max-w-xs whitespace-normal text-xs leading-relaxed">
                    {r.body}
                  </span>
                }
              >
                <p className="text-zinc-600 text-xs mt-1 line-clamp-1 cursor-help">
                  {r.body}
                </p>
              </Tooltip>
              <span className="text-[11px] font-mono text-zinc-500 mt-1">
                Submitted {r.createdAt}
              </span>
            </div>
          );
        },
      },
      {
        field: "isHidden",
        headerName: "Status",
        width: 130,
        headerAlign: "center",
        align: "center",
        renderCell: (params) => {
          return (
            <div className="flex items-center justify-center w-full">
              {params.row.isHidden ? (
                <span className="admin-table-badge gap-1 text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
                  <span className="admin-table-badge__dot w-1.5 h-1.5 rounded-full bg-rose-500" />
                  Hidden
                </span>
              ) : (
                <span className="admin-table-badge gap-1 text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="admin-table-badge__dot w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Public
                </span>
              )}
            </div>
          );
        },
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 100,
        headerAlign: "right",
        align: "right",
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => {
          const r = params.row;
          return (
            <div className="flex items-center justify-end gap-2 w-full">
              <button
                type="button"
                onClick={() => handleToggleHide(r.id)}
                className={`inline-flex items-center justify-center w-8 h-8 rounded border transition-colors cursor-pointer ${
                  r.isHidden
                    ? "bg-white border-zinc-300 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900"
                    : "bg-white border-rose-200 text-rose-700 hover:bg-rose-50 hover:border-rose-300"
                }`}
                title={r.isHidden ? "Show this review" : "Hide this review"}
                aria-label={r.isHidden ? "Show this review" : "Hide this review"}
              >
                {r.isHidden ? (
                  <>
                    <svg
                      className="w-3.5 h-3.5 text-emerald-600 shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-3.5 h-3.5 text-rose-600 shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          );
        },
      },
    ],
    [handleToggleHide]
  );

  return (
    <div className="space-y-6">
      {/* Title row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 text-balance">
            Reviews
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Audit customer reviews and control what shoppers can see.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap items-center justify-end gap-2">
          <label className="sr-only" htmlFor="review-rating-filter">
            Filter by rating
          </label>
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 z-10 h-3.5 w-3.5 -translate-y-1/2 fill-amber-400 text-amber-400"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <select
              id="review-rating-filter"
              value={ratingFilter}
              onChange={(event) => setRatingFilter(event.target.value)}
              className="h-10 min-w-40 appearance-none rounded border border-zinc-300 bg-white py-2 pl-9 pr-10 text-xs font-semibold text-zinc-700 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="all">All ratings</option>
              {[5, 4, 3, 2, 1].map((rating) => (
                <option key={rating} value={rating}>
                  {rating} {rating === 1 ? "star" : "stars"}
                </option>
              ))}
            </select>
            <svg
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>

          <div className="flex items-center gap-1 text-xs bg-zinc-100 p-1 rounded">
          <button
            type="button"
            onClick={() => setFilterMode("all")}
            className={`px-3 py-2 rounded font-semibold transition-colors cursor-pointer ${
              filterMode === "all"
                ? "bg-white text-zinc-900 border border-zinc-300"
                : "text-zinc-600 hover:text-zinc-900 border border-transparent"
            }`}
          >
            All ({reviews.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode("public")}
            className={`px-3 py-2 rounded font-semibold transition-colors cursor-pointer ${
              filterMode === "public"
                ? "bg-white text-emerald-700 border border-emerald-300"
                : "text-zinc-600 hover:text-zinc-900 border border-transparent"
            }`}
          >
            Public ({publicCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode("hidden")}
            className={`px-3 py-2 rounded font-semibold transition-colors cursor-pointer ${
              filterMode === "hidden"
                ? "bg-white text-amber-700 border border-amber-300"
                : "text-zinc-600 hover:text-zinc-900 border border-transparent"
            }`}
          >
            Hidden ({hiddenCount})
          </button>
        </div>
      </div>
      </div>

      {/* Reviews grid */}
      <div className="border border-zinc-200 bg-white rounded overflow-hidden">
        <DataGrid
          rows={filteredReviews}
          columns={columns}
          loading={loading || moderating}
          getRowId={(row) => row.id}
          rowHeight={64}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          autoHeight
          sx={adminDataGridSx}
        />
      </div>
    </div>
  );
};
