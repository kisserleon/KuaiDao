"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Stats = {
  restaurants: number;
  groceries: number;
  services: number;
  events: number;
  pending: number;
  users: number;
};

type FetchLogEntry = {
  id: string;
  source: string;
  type: string;
  status: string;
  count: number;
  message: string;
  duration: number;
  createdAt: string;
};

export default function AdminClient() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [logs, setLogs] = useState<FetchLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const [restaurantRes, groceryRes, serviceRes, eventRes, pendingRes, userRes] =
        await Promise.all([
          fetch("/kuaidao/api/admin/fetched?type=restaurant&limit=1"),
          fetch("/kuaidao/api/admin/fetched?type=grocery&limit=1"),
          fetch("/kuaidao/api/admin/fetched?type=service&limit=1"),
          fetch("/kuaidao/api/admin/fetched?type=event&limit=1"),
          fetch("/kuaidao/api/admin/fetched?status=pending&limit=1"),
          fetch("/kuaidao/api/admin/users?limit=1"),
        ]);

      const [restaurants, groceries, services, events, pending, users] = await Promise.all(
        [restaurantRes, groceryRes, serviceRes, eventRes, pendingRes, userRes].map((r) =>
          r.json(),
        ),
      );

      setStats({
        restaurants: restaurants.total ?? 0,
        groceries: groceries.total ?? 0,
        services: services.total ?? 0,
        events: events.total ?? 0,
        pending: pending.total ?? 0,
        users: users.total ?? 0,
      });

      // Fetch recent logs via a simple inline API call
      const logRes = await fetch("/kuaidao/api/admin/fetched?limit=5");
      const logData = await logRes.json();
      setLogs(logData.items?.slice(0, 5) ?? []);
    } catch (err) {
      console.error("Failed to load dashboard:", err);
    } finally {
      setLoading(false);
    }
  }

  async function triggerFetch() {
    setFetching(true);
    try {
      const res = await fetch("/kuaidao/api/fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "free" }),
      });
      if (res.ok) {
        loadDashboard();
      }
    } catch (err) {
      console.error("Fetch trigger failed:", err);
    } finally {
      setFetching(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-28 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const cards = [
    {
      label: "Restaurants",
      value: stats?.restaurants ?? 0,
      emoji: "🍜",
      bg: "bg-red-50 dark:bg-red-950/40",
      href: "fetched?type=restaurant",
    },
    {
      label: "Groceries",
      value: stats?.groceries ?? 0,
      emoji: "🛒",
      bg: "bg-green-50 dark:bg-green-950/40",
      href: "fetched?type=grocery",
    },
    {
      label: "Services",
      value: stats?.services ?? 0,
      emoji: "🔧",
      bg: "bg-blue-50 dark:bg-blue-950/40",
      href: "fetched?type=service",
    },
    {
      label: "Events",
      value: stats?.events ?? 0,
      emoji: "🎉",
      bg: "bg-purple-50 dark:bg-purple-950/40",
      href: "fetched?type=event",
    },
    {
      label: "Pending",
      value: stats?.pending ?? 0,
      emoji: "⏳",
      bg: "bg-yellow-50 dark:bg-yellow-950/40",
      href: "fetched?status=pending",
    },
    {
      label: "Users",
      value: stats?.users ?? 0,
      emoji: "👥",
      bg: "bg-gray-50 dark:bg-gray-800/40",
      href: "users",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          📊 Admin Dashboard
        </h1>
        <button
          onClick={triggerFetch}
          disabled={fetching}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {fetching ? "Fetching..." : "🔄 Trigger Fetch Now"}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
        {cards.map((card) => (
          <button
            key={card.label}
            onClick={() => router.push(card.href)}
            className={`${card.bg} rounded-xl p-4 text-center border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all cursor-pointer`}
          >
            <div className="text-2xl mb-1">{card.emoji}</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {card.value}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{card.label}</div>
          </button>
        ))}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <button
          onClick={() => router.push("fetched")}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6 hover:shadow-md transition-all text-left"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            📋 Manage Listings
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Approve, reject, and filter fetched listings from all sources.
          </p>
        </button>
        <button
          onClick={() => router.push("users")}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6 hover:shadow-md transition-all text-left"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            👥 Manage Users
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            View users, review counts, and manage roles.
          </p>
        </button>
        <button
          onClick={() => router.push("fetched?type=restaurant")}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6 hover:shadow-md transition-all text-left"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            🍜 Restaurants
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Browse and manage restaurant listings specifically.
          </p>
        </button>
      </div>

      {/* Recent Activity */}
      {logs.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            📝 Recent Listings
          </h2>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 text-left">
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
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log: Record<string, unknown>, i: number) => (
                  <tr
                    key={log.id as string}
                    className={`border-b border-gray-50 dark:border-gray-800/50 ${i % 2 === 0 ? "bg-gray-50/50 dark:bg-gray-800/30" : ""}`}
                  >
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                      {(log.name as string) || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                      {log.source as string}
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                      {log.type as string}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={log.status as string} />
                    </td>
                    <td className="px-4 py-3 text-gray-400 dark:text-gray-500">
                      {new Date(log.fetchedAt as string).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
