'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Settings, Save, Building2, Phone, Mail, MapPin, MessageCircle } from 'lucide-react'

interface SettingsData {
  settings: Record<string, string>
  companyProfile: {
    id: string
    companyName: string
    tagline: string
    description: string
    vision: string | null
    mission: string | null
    address: string | null
    phone: string | null
    email: string | null
    whatsapp: string | null
  } | null
}

export default function AdminSettingsPage() {
  const router = useRouter()
  const [data, setData] = useState<SettingsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Company form
  const [companyName, setCompanyName] = useState('')
  const [tagline, setTagline] = useState('')
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')

  // WhatsApp number setting
  const [whatsappNumber, setWhatsappNumber] = useState('')

  useEffect(() => {
    async function fetchSettings() {
      try {
        const token = localStorage.getItem('admin_token')
        const res = await fetch('/api/admin/settings', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error('Failed')
        const json: SettingsData = await res.json()
        setData(json)

        if (json.companyProfile) {
          setCompanyName(json.companyProfile.companyName || '')
          setTagline(json.companyProfile.tagline || '')
          setDescription(json.companyProfile.description || '')
          setAddress(json.companyProfile.address || '')
          setPhone(json.companyProfile.phone || '')
          setEmail(json.companyProfile.email || '')
          setWhatsapp(json.companyProfile.whatsapp || '')
        }
        setWhatsappNumber(json.settings.whatsapp_number || json.companyProfile?.whatsapp || '')
      } catch {
        setError('Failed to load settings')
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  async function handleSaveCompany(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          companyProfile: {
            companyName,
            tagline,
            description,
            address,
            phone,
            email,
            whatsapp,
          },
        }),
      })
      if (!res.ok) throw new Error('Failed to save')
      setSuccess('Company information updated successfully')
    } catch {
      setError('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  async function handleSaveWhatsapp() {
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ key: 'whatsapp_number', value: whatsappNumber }),
      })
      if (!res.ok) throw new Error('Failed to save')
      setSuccess('WhatsApp number updated successfully')
    } catch {
      setError('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-green-600 text-sm">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div className="flex items-center gap-2">
        <Settings className="w-6 h-6 text-green-600" />
        <h1 className="text-xl font-bold text-brown-800">Settings</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">{success}</div>
      )}

      {/* WhatsApp Number */}
      <div className="bg-white rounded-xl border border-green-200 shadow-sm">
        <div className="px-5 py-4 border-b border-green-100 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-green-600" />
          <h2 className="font-semibold text-brown-800">WhatsApp Number</h2>
        </div>
        <div className="p-5">
          <p className="text-sm text-green-600 mb-3">
            This number is used for order notifications and customer inquiries.
          </p>
          <div className="flex gap-3">
            <input
              type="text"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg border border-green-300 bg-white text-green-900 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
              placeholder="e.g. 6281234567890"
            />
            <button
              onClick={handleSaveWhatsapp}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors text-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Company Profile */}
      <div className="bg-white rounded-xl border border-green-200 shadow-sm">
        <div className="px-5 py-4 border-b border-green-100 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-green-600" />
          <h2 className="font-semibold text-brown-800">Company Information</h2>
        </div>
        <form onSubmit={handleSaveCompany} className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-green-700 mb-1">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-green-300 bg-white text-green-900 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-green-700 mb-1">Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-green-300 bg-white text-green-900 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-green-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-green-300 bg-white text-green-900 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm resize-none"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-green-700 mb-1 flex items-center gap-1">
                <Phone className="w-3 h-3" /> Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-green-300 bg-white text-green-900 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-green-700 mb-1 flex items-center gap-1">
                <Mail className="w-3 h-3" /> Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-green-300 bg-white text-green-900 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-green-700 mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Address
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-green-300 bg-white text-green-900 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm resize-none"
            />
          </div>
          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors text-sm font-medium disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
