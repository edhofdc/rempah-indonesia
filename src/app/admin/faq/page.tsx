"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HelpCircle, Plus, Edit3, Trash2, X } from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
  createdAt: string;
}

interface FAQForm {
  question: string;
  answer: string;
  order: string;
  isActive: boolean;
}

const emptyForm: FAQForm = {
  question: "",
  answer: "",
  order: "0",
  isActive: true,
};

export default function AdminFAQPage() {
  const router = useRouter();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FAQForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function fetchFaqs() {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch("/api/admin/faq", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setFaqs(data);
    } catch {
      setError("Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFaqs();
  }, []);

  function openAddModal() {
    setEditingId(null);
    setForm({
      question: "",
      answer: "",
      order: String(faqs.length + 1),
      isActive: true,
    });
    setError("");
    setModalOpen(true);
  }

  function openEditModal(faq: FAQ) {
    setEditingId(faq.id);
    setForm({
      question: faq.question,
      answer: faq.answer,
      order: String(faq.order),
      isActive: faq.isActive,
    });
    setError("");
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.question || !form.answer) {
      setError("Question and answer are required");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const token = localStorage.getItem("admin_token");
      const method = editingId ? "PUT" : "POST";
      const body = editingId
        ? { ...form, id: editingId, order: Number(form.order) }
        : { ...form, order: Number(form.order) };

      const res = await fetch("/api/admin/faq", {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      setModalOpen(false);
      await fetchFaqs();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save FAQ");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;

    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`/api/admin/faq?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete");
      await fetchFaqs();
    } catch {
      setError("Failed to delete FAQ");
    }
  }

  async function handleToggleActive(faq: FAQ) {
    try {
      const token = localStorage.getItem("admin_token");
      await fetch("/api/admin/faq", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: faq.id, isActive: !faq.isActive }),
      });
      await fetchFaqs();
    } catch {
      setError("Failed to update FAQ");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-green-600 text-sm">Loading FAQs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-green-600" />
          <h1 className="text-xl font-bold text-brown-800">FAQ Management</h1>
          <span className="text-sm text-green-500 bg-green-50 px-2 py-0.5 rounded-full">
            {faqs.length} total
          </span>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors shadow-sm text-sm"
        >
          <Plus className="w-4 h-4" />
          Add FAQ
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* FAQ List */}
      <div className="space-y-3">
        {faqs.length === 0 ? (
          <div className="bg-white rounded-xl border border-green-200 shadow-sm p-12 text-center">
            <HelpCircle className="w-12 h-12 mx-auto mb-3 text-green-300" />
            <p className="text-green-500">
              No FAQs yet. Create your first one!
            </p>
          </div>
        ) : (
          faqs.map((faq, index) => (
            <div
              key={faq.id}
              className="bg-white rounded-xl border border-green-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="px-5 py-4 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-green-400 font-mono">
                      #{faq.order}
                    </span>
                    <button
                      onClick={() => handleToggleActive(faq)}
                      className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                        faq.isActive
                          ? "bg-green-100 text-green-700 border-green-300"
                          : "bg-gray-100 text-gray-500 border-gray-300"
                      }`}
                    >
                      {faq.isActive ? "Active" : "Inactive"}
                    </button>
                  </div>
                  <h3 className="font-medium text-brown-800">{faq.question}</h3>
                  <p className="text-sm text-green-600 mt-1 line-clamp-2">
                    {faq.answer}
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => openEditModal(faq)}
                    className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                    title="Edit"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(faq.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setModalOpen(false)}
          />
          <div className="relative bg-white rounded-xl border border-green-200 shadow-xl w-full max-w-lg animate-scale-in">
            <div className="px-5 py-4 border-b border-green-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-brown-800">
                {editingId ? "Edit FAQ" : "Add FAQ"}
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
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">
                  Order
                </label>
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-green-300 bg-white text-green-900 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">
                  Question *
                </label>
                <input
                  type="text"
                  value={form.question}
                  onChange={(e) =>
                    setForm({ ...form, question: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-green-300 bg-white text-green-900 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">
                  Answer *
                </label>
                <textarea
                  value={form.answer}
                  onChange={(e) => setForm({ ...form, answer: e.target.value })}
                  rows={5}
                  className="w-full px-3 py-2 rounded-lg border border-green-300 bg-white text-green-900 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm resize-none"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm({ ...form, isActive: e.target.checked })
                  }
                  className="rounded border-green-300 text-green-600 focus:ring-green-600"
                />
                <label htmlFor="isActive" className="text-sm text-green-700">
                  Active
                </label>
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
