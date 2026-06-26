"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Package, Plus, Search, Edit3, Trash2, X } from "lucide-react";
import { slugify } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  weight: string | null;
  origin: string | null;
  stock: number;
  status: string;
  categoryId: string;
  sku: string | null;
  category: { id: string; name: string };
}

interface ProductForm {
  name: string;
  slug: string;
  description: string;
  price: string;
  weight: string;
  origin: string;
  benefits: string;
  stock: string;
  status: string;
  categoryId: string;
}

const emptyForm: ProductForm = {
  name: "",
  slug: "",
  description: "",
  price: "",
  weight: "",
  origin: "",
  benefits: "",
  stock: "0",
  status: "active",
  categoryId: "",
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

const statusStyles: Record<string, string> = {
  active: "bg-green-100 text-green-700 border-green-300",
  inactive: "bg-gray-100 text-gray-600 border-gray-300",
  discontinued: "bg-red-100 text-red-700 border-red-300",
};

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function fetchProducts() {
    try {
      const token = localStorage.getItem("admin_token");
      const params = search ? `?search=${encodeURIComponent(search)}` : "";
      const res = await fetch(`/api/admin/products${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setProducts(data);
    } catch {
      setError("Failed to load products");
    }
  }

  async function fetchCategories() {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch("/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setCategories(data);
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    Promise.all([fetchProducts(), fetchCategories()]).finally(() =>
      setLoading(false),
    );
  }, []);

  async function handleSearch() {
    setLoading(true);
    await fetchProducts();
    setLoading(false);
  }

  function openAddModal() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  }

  function openEditModal(product: Product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: String(product.price),
      weight: product.weight || "",
      origin: product.origin || "",
      benefits: "",
      stock: String(product.stock),
      status: product.status,
      categoryId: product.categoryId,
    });
    setError("");
    setModalOpen(true);
  }

  async function handleSave() {
    if (
      !form.name ||
      !form.slug ||
      !form.description ||
      !form.price ||
      !form.categoryId
    ) {
      setError("Please fill in all required fields");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const token = localStorage.getItem("admin_token");
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { ...form, id: editingId } : form;

      const res = await fetch("/api/admin/products", {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...body,
          price: Number(form.price),
          stock: Number(form.stock),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      setModalOpen(false);
      await fetchProducts();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete");
      await fetchProducts();
    } catch {
      setError("Failed to delete product");
    }
  }

  function updateFormField(field: keyof ProductForm, value: string) {
    const updated = { ...form, [field]: value };
    if (field === "name" && !editingId) {
      updated.slug = slugify(value);
    }
    setForm(updated);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-green-600 text-sm">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Package className="w-6 h-6 text-green-600" />
          <h1 className="text-xl font-bold text-brown-800">Products</h1>
          <span className="text-sm text-green-500 bg-green-50 px-2 py-0.5 rounded-full">
            {products.length} total
          </span>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors shadow-sm text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-green-300 bg-white text-green-900 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
        >
          Search
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-green-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-green-50 border-b border-green-200">
                <th className="text-left px-4 py-3 font-semibold text-green-800">
                  Name
                </th>
                <th className="text-left px-4 py-3 font-semibold text-green-800">
                  Category
                </th>
                <th className="text-right px-4 py-3 font-semibold text-green-800">
                  Price
                </th>
                <th className="text-right px-4 py-3 font-semibold text-green-800">
                  Stock
                </th>
                <th className="text-center px-4 py-3 font-semibold text-green-800">
                  Status
                </th>
                <th className="text-center px-4 py-3 font-semibold text-green-800">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-green-100">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-green-500">
                    <Package className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p>No products found</p>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-green-50/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-brown-800">
                        {product.name}
                      </p>
                      {product.sku && (
                        <p className="text-[10px] text-green-400">
                          SKU: {product.sku}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-green-600">
                      {product.category.name}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-brown-700">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={
                          product.stock <= 10
                            ? "text-red-600 font-medium"
                            : "text-green-700"
                        }
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-medium border ${
                          statusStyles[product.status] ||
                          "bg-gray-100 text-gray-700 border-gray-300"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setModalOpen(false)}
          />
          <div className="relative bg-white rounded-xl border border-green-200 shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="px-5 py-4 border-b border-green-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-brown-800">
                {editingId ? "Edit Product" : "Add Product"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg hover:bg-green-50 text-green-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-green-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => updateFormField("name", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-green-300 bg-white text-green-900 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-green-700 mb-1">
                    Slug *
                  </label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => updateFormField("slug", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-green-300 bg-white text-green-900 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-green-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      updateFormField("description", e.target.value)
                    }
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-green-300 bg-white text-green-900 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm resize-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">
                    Price *
                  </label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => updateFormField("price", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-green-300 bg-white text-green-900 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => updateFormField("stock", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-green-300 bg-white text-green-900 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">
                    Weight
                  </label>
                  <input
                    type="text"
                    value={form.weight}
                    onChange={(e) => updateFormField("weight", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-green-300 bg-white text-green-900 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                    placeholder="e.g. 100g"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">
                    Origin
                  </label>
                  <input
                    type="text"
                    value={form.origin}
                    onChange={(e) => updateFormField("origin", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-green-300 bg-white text-green-900 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={form.categoryId}
                    onChange={(e) =>
                      updateFormField("categoryId", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-lg border border-green-300 bg-white text-green-900 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => updateFormField("status", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-green-300 bg-white text-green-900 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="discontinued">Discontinued</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-green-700 mb-1">
                    Benefits
                  </label>
                  <textarea
                    value={form.benefits}
                    onChange={(e) =>
                      updateFormField("benefits", e.target.value)
                    }
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-green-300 bg-white text-green-900 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm resize-none"
                  />
                </div>
              </div>
            </div>
            <div className="px-5 py-4 border-t border-green-100 flex justify-end gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-sm text-green-700 hover:bg-green-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 text-sm bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : editingId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
