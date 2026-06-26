"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Trash2 } from "lucide-react";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: { id: string; name: string; price: number };
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  email: string | null;
  address: string;
  notes: string | null;
  subtotal: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
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

const statusOptions = ["pending", "processing", "completed", "cancelled"];

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  async function fetchOrders() {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch("/api/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setOrders(data);
    } catch {
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  async function handleStatusChange(orderId: string, newStatus: string) {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update");
      await fetchOrders();
    } catch {
      setError("Failed to update order status");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`/api/admin/orders?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete");
      await fetchOrders();
    } catch {
      setError("Failed to delete order");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-green-600 text-sm">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center gap-2">
        <ShoppingCart className="w-6 h-6 text-green-600" />
        <h1 className="text-xl font-bold text-brown-800">Orders</h1>
        <span className="text-sm text-green-500 bg-green-50 px-2 py-0.5 rounded-full">
          {orders.length} total
        </span>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-green-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-green-50 border-b border-green-200">
                <th className="text-left px-4 py-3 font-semibold text-green-800">
                  Order
                </th>
                <th className="text-left px-4 py-3 font-semibold text-green-800">
                  Customer
                </th>
                <th className="text-left px-4 py-3 font-semibold text-green-800">
                  Phone
                </th>
                <th className="text-left px-4 py-3 font-semibold text-green-800">
                  Items
                </th>
                <th className="text-right px-4 py-3 font-semibold text-green-800">
                  Total
                </th>
                <th className="text-center px-4 py-3 font-semibold text-green-800">
                  Status
                </th>
                <th className="text-left px-4 py-3 font-semibold text-green-800">
                  Date
                </th>
                <th className="text-center px-4 py-3 font-semibold text-green-800">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-green-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-green-500">
                    <ShoppingCart className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p>No orders yet</p>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-green-50/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-brown-800 font-medium">
                        {order.orderNumber}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-brown-800 font-medium">
                        {order.customerName}
                      </p>
                      {order.email && (
                        <p className="text-[10px] text-green-400">
                          {order.email}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-green-600">{order.phone}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() =>
                          setSelectedOrder(
                            selectedOrder?.id === order.id ? null : order,
                          )
                        }
                        className="text-green-600 hover:text-green-800 underline text-xs"
                      >
                        {order.items.length} item(s)
                      </button>
                      {selectedOrder?.id === order.id && (
                        <div className="mt-2 bg-green-50 rounded-lg p-3 border border-green-200 space-y-1">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex justify-between text-xs"
                            >
                              <span className="text-brown-700">
                                {item.product.name} x{item.quantity}
                              </span>
                              <span className="text-green-700">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-brown-700">
                      {formatPrice(order.subtotal)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        className={`inline-block px-2 py-1 rounded text-xs font-medium border cursor-pointer ${
                          statusColors[order.status] ||
                          "bg-gray-100 text-gray-700 border-gray-300"
                        }`}
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-green-500 text-xs whitespace-nowrap">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
