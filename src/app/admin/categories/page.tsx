'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ListTree, Plus, Edit3, Trash2, X } from 'lucide-react'
import { slugify } from '@/lib/utils'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  _count: { products: number }
}

interface CategoryForm {
  name: string
  slug: string
  description: string
}

const emptyForm: CategoryForm = { name: '', slug: '', description: '' }

export default function AdminCategoriesPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<CategoryForm>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function fetchCategories() {
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch('/api/admin/categories', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setCategories(data)
    } catch {
      setError('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  function openAddModal() {
    setEditingId(null)
    setForm(emptyForm)
    setError('')
    setModalOpen(true)
  }

  function openEditModal(cat: Category) {
    setEditingId(cat.id)
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
    })
    setError('')
    setModalOpen(true)
  }

  async function handleSave() {
    if (!form.name || !form.slug) {
      setError('Name and slug are required')
      return
    }

    setSaving(true)
    setError('')

    try {
      const token = localStorage.getItem('admin_token')
      const method = editingId ? 'PUT' : 'POST'
      const body = editingId ? { ...form, id: editingId } : form

      const res = await fetch('/api/admin/categories', {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save')
      }

      setModalOpen(false)
      await fetchCategories()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save category')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this category?')) return

    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch(`/api/admin/categories?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to delete')
      }
      await fetchCategories()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete category')
    }
  }

  function updateFormField(field: keyof CategoryForm, value: string) {
    const updated = { ...form, [field]: value }
    if (field === 'name' && !editingId) {
      updated.slug = slugify(value)
    }
    setForm(updated)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-green-600 text-sm">Loading categories...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListTree className="w-6 h-6 text-green-600" />
          <h1 className="text-xl font-bold text-brown-800">Categories</h1>
          <span className="text-sm text-green-500 bg-green-50 px-2 py-0.5 rounded-full">
            {categories.length} total
          </span>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors shadow-sm text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl border border-green-200 shadow-sm p-12 text-center">
            <ListTree className="w-12 h-12 mx-auto mb-3 text-green-300" />
            <p className="text-green-500">No categories yet.</p>
          </div>
        ) : (
          categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-xl border border-green-200 shadow-sm hover:shadow-md transition-shadow p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-brown-800">{cat.name}</h3>
                  <p className="text-xs text-green-500 mt-0.5">{cat.slug}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                    title="Edit"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              {cat.description && (
                <p className="text-xs text-green-600 mb-3 line-clamp-2">{cat.description}</p>
              )}
              <div className="text-xs text-green-500 bg-green-50 rounded-lg px-2 py-1 inline-block">
                {cat._count.products} product(s)
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-xl border border-green-200 shadow-xl w-full max-w-md animate-scale-in">
            <div className="px-5 py-4 border-b border-green-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-brown-800">
                {editingId ? 'Edit Category' : 'Add Category'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded-lg hover:bg-green-50 text-green-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">{error}</div>
              )}
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateFormField('name', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-green-300 bg-white text-green-900 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Slug *</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => updateFormField('slug', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-green-300 bg-white text-green-900 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => updateFormField('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-green-300 bg-white text-green-900 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm resize-none"
                />
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
                {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
