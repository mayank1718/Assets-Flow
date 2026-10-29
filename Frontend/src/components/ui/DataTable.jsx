import React from "react";
import LoadingState from "./LoadingState";
import EmptyState from "./EmptyState";

export const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  emptyTitle = "No records found",
  emptyDescription = "There are no records matching your query.",
  emptyIcon,
  emptyAction,
  keyExtractor = (item, index) => item._id || item.id || index,
  className = "",
  headerClassName = "",
}) => {
  return (
    <div className={`bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-700">
          <thead className={`bg-slate-50/75 border-b border-slate-200/80 ${headerClassName}`}>
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={col.key || idx}
                  className={`px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider ${
                    col.align === "right"
                      ? "text-right"
                      : col.align === "center"
                      ? "text-center"
                      : "text-left"
                  } ${col.className || ""}`}
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="p-0">
                  <LoadingState variant="table-skeleton" rows={4} />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-0">
                  <EmptyState
                    icon={emptyIcon}
                    title={emptyTitle}
                    description={emptyDescription}
                    action={emptyAction}
                  />
                </td>
              </tr>
            ) : (
              data.map((item, rowIdx) => (
                <tr
                  key={keyExtractor(item, rowIdx)}
                  className="hover:bg-slate-50/70 transition-colors duration-100"
                >
                  {columns.map((col, colIdx) => {
                    const content = col.render
                      ? col.render(item, rowIdx)
                      : item[col.dataIndex || col.key];

                    return (
                      <td
                        key={col.key || colIdx}
                        className={`px-5 py-3.5 text-sm ${
                          col.align === "right"
                            ? "text-right"
                            : col.align === "center"
                            ? "text-center"
                            : "text-left"
                        } ${col.cellClassName || ""}`}
                      >
                        {content ?? "—"}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
