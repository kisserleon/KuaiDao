"use client";

import { useEffect, useState, useCallback } from "react";

type FetchedItem = {
  id: string;
  name: string;
  nameZh: string;
  source: string;
  type: string;
  status: string;
  rating: number;
  address: string;
  city: string;
  fetchedAt: string;
};

type Pagination = {
  page: number;
  totalPages: number;
  total: number;
};

export default function FetchedClient() {
  const [items, setItems] = useState<FetchedItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [updating, setUpdating] = useState(false);

  const loadItems = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page: String(page), limit: "20" });
        if (statusFilter) params.set("status", statusFilter);
        if (sourceFilter) params.set("source", sourceFilter);
        if (typeFilter) params.set("type", typeFilter);

        const res = await fetch(`/kuaidao/api/admin/fetched?${params}`);
        const data = await res.json();
        setItems(data.items ?? []);
        setPagination({
          page: data.page ?? 1,
          totalPages: data.totalPages ?? 1,
          total: data.total ?? 0,
        });
      } catch (err) {
        console.error("Failed to load fetched listings:", err);
      } finally {
        setLoading(false);
      }
    },
    [statusFilter, sourceFilter, typeFilter],
  );

  useEffect(() => {
    loadItems(1);
  }, [loadItems]);

  async function updateStatus(ids: string[], status: string) {
    setUpdating(true);
    try {
      const res = await fetch("/kuaidao/api/admin/fetched", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, status }),
      });
      if (res.ok) {
        setSelected(new Set());
        loadItems(pagination.page);
      }
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setUpdating(false);
    }
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selected.size === items.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(items.map((i) => i.id)));
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        📋 Fetched Listings
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm"
        >
          <option value="">All Sources</option>
          <option value="overpass">Overpass</option>
          <option value="google">Google</option>
          <option value="rednote">RedNote</option>
          <option value="duckduckgo">DuckDuckGo</option>
          <option value="manual">Manual</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm"
        >
          <option value="">All Types</option>
          <option value="restaurant">Restaurant</option>
          <option value="grocery">Grocery</option>
          <option value="service">Service</option>
          <option value="event">Event</option>
        </select>

        <span className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
          {pagination.total} total
        </span>
      </div>

      {/* Bulk Actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 mb-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
            {selected.size} selected
          </span>
          <button
            onClick={() => updateStatus([...selected], "approved")}
            disabled={updating}
            className="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-md text-sm font-medium transition-colors"
          >
            ✅ Approve
          </button>
          <button
            onClick={() => updateStatus([...selected], "rejected")}
            disabled={updating}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-md text-sm font-medium transition-colors"
          >
            ❌ Reject
          </button>
          <button
            onClick={() => setSelected(new Set())}
            className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm"
          >
            Clear
          </button>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="animate-pulse space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          No listings found with current filters.
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 text-left">
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.size === items.length && items.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded"
                  />
                </th>
                <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">
                  Name
                </th>
                <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">
                  Source
                </th>
                <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">
                  Type
                </th>
                <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">
                  Status
                </th>
                <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">
                  Rating
                </th>
                <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">
                  Address
                </th>
                <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">
                  Fetched
                </th>
                <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr
                  key={item.id}
                  className={`border-b border-gray-50 dark:border-gray-800/50 ${i % 2 === 0 ? "bg-gray-50/50 dark:bg-gray-800/30" : ""}`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(item.id)}
                      onChange={() => toggleSelect(item.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100 font-medium">
                    <div>{item.name}</div>
                    {item.nameZh && (
                      <div className="text-xs text-gray-400 dark:text-gray-500">
                        {item.nameZh}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                    {item.source}
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                    {item.type}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                    {item.rating > 0 ? `⭐ ${item.rating.toFixed(1)}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 max-w-[200px] truncate">
                    {item.address || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-400 dark:text-gray-500 whitespace-nowrap">
                    {new Date(item.fetchedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {item.status !== "approved" && (
                        <button
                          onClick={() => updateStatus([item.id], "approved")}
                          disabled={updating}
                          className="px-2 py-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded text-xs font-medium transition-colors"
                        >
                          Approve
                        </button>
                      )}
                      {item.status !== "rejected" && (
                        <button
                          onClick={() => updateStatus([item.id], "rejected")}
                          disabled={updating}
                          className="px-2 py-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded text-xs font-medium transition-colors"
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => loadItems(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
          >
            ← Previous
          </button>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => loadItems(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400",
    approved: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400",
    rejected: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] ?? "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"}`}
    >
      {status}
    </span>
  );
}
