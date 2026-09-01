"use client";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Plus, Search, Trash2, type LucideIcon } from "lucide-react";

export interface CollectionColumn<T> {
  key: string;
  label: string;
  render: (item: T) => React.ReactNode;
  className?: string;
}

export interface CollectionPagination {
  page: number;
  totalPages: number;
  total: number;
}

interface CollectionListProps<T> {
  items: T[];
  getId: (item: T) => string | number;
  columns: CollectionColumn<T>[];
  loading?: boolean;

  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;

  /**
   * Navigates to the item's own full-page editor — never a drawer or a modal.
   * Omit entirely for collections with nothing to edit (a moderation queue, an
   * inbox of third-party submissions) — rows render as plain cells instead.
   */
  getRowHref?: (item: T) => string;
  /** For collections with a read-only inspector (a modal) instead of a full edit page — e.g. an inbox. */
  onRowClick?: (item: T) => void;
  createHref?: string;
  createLabel?: string;

  onDeleteRequest?: (item: T) => void;

  emptyIcon: LucideIcon;
  emptyTitle: string;
  emptySub?: string;

  pagination?: CollectionPagination;
  onPageChange?: (page: number) => void;
}

function SkeletonRow({ columns }: { columns: number }) {
  return (
    <tr>
      {Array.from({ length: columns + 1 }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 animate-pulse rounded-lg bg-calma-border" />
        </td>
      ))}
    </tr>
  );
}

/**
 * The generic "Payload-like" list view every admin collection is built on:
 * real search, a real create route (never a create modal), rows that link to
 * their own edit page (never a drawer), and a named delete action.
 */
export function CollectionList<T>({
  items,
  getId,
  columns,
  loading = false,
  searchTerm,
  onSearchChange,
  searchPlaceholder,
  getRowHref,
  onRowClick,
  createHref,
  createLabel,
  onDeleteRequest,
  emptyIcon: EmptyIcon,
  emptyTitle,
  emptySub,
  pagination,
  onPageChange,
}: CollectionListProps<T>) {
  return (
    <div className="space-y-4">
      {(onSearchChange || createHref) && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {onSearchChange && (
            <div className="relative flex-1 sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-calma-taupe" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full rounded-xl border border-calma-border py-2.5 pl-10 pr-4 text-sm focus:border-admin-gold focus:outline-none"
              />
            </div>
          )}
          {createHref && (
            <Link
              href={createHref}
              className="flex items-center justify-center gap-2 rounded-xl bg-admin-navy px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-admin-navy-deep"
            >
              <Plus className="h-4 w-4" />
              {createLabel}
            </Link>
          )}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-calma-border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-calma-border bg-calma-sand/60">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-calma-taupe"
                  >
                    {col.label}
                  </th>
                ))}
                {onDeleteRequest && <th className="w-12 px-6 py-3.5" />}
              </tr>
            </thead>
            <tbody className="divide-y divide-calma-border">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonRow key={i} columns={columns.length} />
                ))
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (onDeleteRequest ? 1 : 0)}>
                    <div className="py-16 text-center">
                      <EmptyIcon className="mx-auto mb-3 h-10 w-10 text-calma-border" />
                      <p className="font-medium text-calma-ink">{emptyTitle}</p>
                      {emptySub && <p className="mt-1 text-sm text-calma-taupe">{emptySub}</p>}
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr
                    key={getId(item)}
                    onClick={onRowClick ? () => onRowClick(item) : undefined}
                    className={`group transition-colors hover:bg-calma-sand/40 ${onRowClick ? "cursor-pointer" : ""}`}
                  >
                    {columns.map((col) =>
                      getRowHref ? (
                        <td key={col.key} className={`px-6 py-4 ${col.className ?? ""}`}>
                          <Link href={getRowHref(item)} className="block no-underline">
                            {col.render(item)}
                          </Link>
                        </td>
                      ) : (
                        <td key={col.key} className={`px-6 py-4 ${col.className ?? ""}`}>
                          {col.render(item)}
                        </td>
                      ),
                    )}
                    {onDeleteRequest && (
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteRequest(item);
                          }}
                          aria-label="Supprimer"
                          className="rounded-lg p-2 text-calma-taupe opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination && pagination.totalPages > 1 && onPageChange && (
          <div className="flex items-center justify-between border-t border-calma-border px-6 py-4">
            <p className="text-sm text-calma-taupe">
              {items.length} / {pagination.total}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => onPageChange(Math.max(1, pagination.page - 1))}
                disabled={pagination.page === 1}
                aria-label="Page précédente"
                className="rounded-lg border border-calma-border p-2 transition-colors hover:bg-calma-sand disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => onPageChange(Math.min(pagination.totalPages, pagination.page + 1))}
                disabled={pagination.page === pagination.totalPages}
                aria-label="Page suivante"
                className="rounded-lg border border-calma-border p-2 transition-colors hover:bg-calma-sand disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
