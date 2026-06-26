"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Package,
  ListTree,
  ShoppingCart,
  AlertTriangle,
  TrendingUp,
  Clock,
  Leaf,
} from "lucide-react";

interface DashboardData {
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  totalRevenue: number;
  lowStock: Array<{
    id: string;
    name: string;
    slug: string;
    stock: number;
    sku: string | null;
    category: { name: string };
  }>;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    customerName: string;
    phone: string;
    subtotal: number;
    status: string;
    createdAt: string;
    items: Array<{
      product: { name: string; price: number };
      quantity: number;
    }>;
  }>;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  processing: "bg-blue-100 text-blue-800 border-blue-300",
  completed: "bg-green-100 text-green-800 border-green-300",
  cancelled: "bg-red-100 text-red-800 border-red-300",
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("admin_token");
        const res = await fetch("/api/admin/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          if (res.status === 401) {
            router.push("/admin/login");
            return;
          }
          throw new Error("Failed to fetch");
        }
        const json = await res.json();
        setData(json);
      } catch {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-green-600 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
        {error}
      </div>
    );
  }

  const stats = [
    {
      label: "Total Products",
      value: data?.totalProducts ?? 0,
      icon: Package,
      color: "bg-green-500",
      bg: "bg-green-50",
    },
    {
      label: "Categories",
      value: data?.totalCategories ?? 0,
      icon: ListTree,
      color: "bg-brown-500",
      bg: "bg-brown-50",
    },
    {
      label: "Total Orders",
      value: data?.totalOrders ?? 0,
      icon: ShoppingCart,
      color: "bg-blue-500",
      bg: "bg-blue-50",
    },
    {
      label: "Total Revenue",
      value: formatPrice(data?.totalRevenue ?? 0),
      icon: TrendingUp,
      color: "bg-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-green-200 p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-green-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-brown-800">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.bg} p-3 rounded-lg`}>
                  <Icon
                    className={`w-5 h-5 ${stat.color.replace("bg-", "text-")}`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alerts */}
        <div className="bg-white rounded-xl border border-green-200 shadow-sm">
          <div className="px-5 py-4 border-b border-green-100 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="font-semibold text-brown-800">Low Stock Alerts</h3>
            {data?.lowStock && data.lowStock.length > 0 && (
              <span className="ml-auto text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                {data.lowStock.length} items
              </span>
            )}
          </div>
          <div className="p-5">
            {!data?.lowStock || data.lowStock.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-green-500">
                <Package className="w-10 h-10 mb-2 opacity-50" />
                <p className="text-sm">All products have sufficient stock</p>
              </div>
            ) : (
              <div className="space-y-2">
                {data.lowStock.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-amber-50 border border-amber-200"
                  >
                    <div>
                      <p className="text-sm font-medium text-brown-800">
                        {product.name}
                      </p>
                      <p className="text-xs text-green-600">
                        {product.category.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                          product.stock <= 5
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {product.stock} left
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-green-200 shadow-sm">
          <div className="px-5 py-4 border-b border-green-100 flex items-center gap-2">
            <Clock className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-brown-800">Recent Orders</h3>
          </div>
          <div className="p-5">
            {!data?.recentOrders || data.recentOrders.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-green-500">
                <ShoppingCart className="w-10 h-10 mb-2 opacity-50" />
                <p className="text-sm">No orders yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-100"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-brown-800 truncate">
                        {order.customerName}
                      </p>
                      <p className="text-xs text-green-600">
                        {order.orderNumber}
                      </p>
                      <p className="text-xs text-green-500 mt-0.5">
                        {order.items.length} item(s) &middot;{" "}
                        {formatPrice(order.subtotal)}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-medium border ${
                          statusColors[order.status] ||
                          "bg-gray-100 text-gray-700 border-gray-300"
                        }`}
                      >
                        {order.status}
                      </span>
                      <p className="text-[10px] text-green-400 mt-1">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer branding */}
      <div className="text-center py-4">
        <div className="inline-flex items-center gap-2 text-green-400 text-xs">
          <Leaf className="w-3 h-3" />
          Rempah Indonesia Admin Dashboard
        </div>
      </div>
    </div>
  );
}
