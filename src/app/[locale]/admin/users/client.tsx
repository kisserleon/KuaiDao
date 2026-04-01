"use client";

import { useEffect, useState, useCallback } from "react";

type UserItem = {
  id: string;
  name: string;
  email: string;
  role: string;
  reviewCount: number;
  createdAt: string;
};

type Pagination = {
  page: number;
  totalPages: number;
  total: number;
};

export default function UsersClient() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const loadUsers = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      const res = await fetch(`/kuaidao/api/admin/users?${params}`);
      const data = await res.json();
      setUsers(data.items ?? []);
      setPagination({
        page: data.page ?? 1,
        totalPages: data.totalPages ?? 1,
        total: data.total ?? 0,
      });
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers(1);
  }, [loadUsers]);

  async function toggleRole(userId: string, currentRole: string) {
    const newRole = currentRole === "admin" ? "user" : "admin";
    setUpdating(userId);
    try {
      const res = await fetch("/kuaidao/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
        );
      }
    } catch (err) {
      console.error("Role update failed:", err);
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          👥 User Management
        </h1>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {pagination.total} total users
        </span>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          No users found.
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 text-left">
                <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">
                  Name
                </th>
                <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">
                  Email
                </th>
                <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">
                  Role
                </th>
                <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">
                  Reviews
                </th>
                <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">
                  Joined
                </th>
                <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr
                  key={user.id}
                  className={`border-b border-gray-50 dark:border-gray-800/50 ${i % 2 === 0 ? "bg-gray-50/50 dark:bg-gray-800/30" : ""}`}
                >
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100 font-medium">
                    {user.name}
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                    {user.email}
                  </td>
                  <td className="px-4 py-3">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                    {user.reviewCount}
                  </td>
                  <td className="px-4 py-3 text-gray-400 dark:text-gray-500 whitespace-nowrap">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleRole(user.id, user.role)}
                      disabled={updating === user.id}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors disabled:opacity-50 ${
                        user.role === "admin"
                          ? "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/60"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                    >
                      {updating === user.id
                        ? "..."
                        : user.role === "admin"
                          ? "Demote to User"
                          : "Promote to Admin"}
                    </button>
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
            onClick={() => loadUsers(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
          >
            ← Previous
          </button>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => loadUsers(pagination.page + 1)}
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

function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    admin: "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400",
    user: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[role] ?? styles.user}`}
    >
      {role}
    </span>
  );
}
