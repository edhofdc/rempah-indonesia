'use client'

import { useState, useEffect, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard, Package, ListTree, ShoppingCart,
  Settings, HelpCircle, LogOut, Leaf,
  ChevronLeft, ChevronRight, Menu,
} from 'lucide-react'

const sidebarItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Categories', href: '/admin/categories', icon: ListTree },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
  { label: 'FAQ', href: '/admin/faq', icon: HelpCircle },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Halaman login tidak perlu auth check — render langsung
    if (pathname === '/admin/login') {
      setIsAuthenticated(true)
      return
    }

    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.replace('/admin/login')
      return
    }

    fetch('/api/auth', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) {
          localStorage.removeItem('admin_token')
          localStorage.removeItem('admin_user')
          router.replace('/admin/login')
          return
        }
        setIsAuthenticated(true)
      })
      .catch(() => {
        router.replace('/admin/login')
      })
  }, [pathname, router])

  function handleLogout() {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    router.replace('/admin/login')
  }

  // 🔥 FIX: Selalu render children untuk login page
  // Biar server kasih HTML form, bukan loading spinner
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  // Loading hanya untuk halaman protected (bukan login)
  if (!mounted || isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-brown-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Leaf className="w-12 h-12 text-green-400 animate-pulse" />
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-green-50">
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}
      <aside className={`fixed top-0 left-0 z-50 h-full bg-gradient-to-b from-green-900 via-green-800 to-green-950 text-white transition-all duration-300 shadow-2xl ${sidebarOpen ? 'w-64' : 'w-16'} ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center gap-3 px-4 h-16 border-b border-green-700/50">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
            <Leaf className="w-5 h-5 text-cream-100" />
          </div>
          <div className={`overflow-hidden transition-all duration-300 ${sidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
            <h1 className="text-sm font-bold text-cream-100 whitespace-nowrap">Rempah Indonesia</h1>
            <p className="text-[10px] text-green-400 whitespace-nowrap">Admin Panel</p>
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="ml-auto hidden lg:flex items-center justify-center w-6 h-6 rounded-md hover:bg-green-700/50 transition-colors">
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
        <nav className="p-3 space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive ? 'bg-green-600/60 text-cream-100 shadow-md border border-green-500/30' : 'text-green-300 hover:text-cream-100 hover:bg-green-700/40'}`}>
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className={`overflow-hidden transition-all duration-300 ${sidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>{item.label}</span>
              </Link>
            )
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-green-700/50">
          <button onClick={handleLogout}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-300 hover:text-red-200 hover:bg-red-500/20 transition-all duration-200 w-full ${!sidebarOpen && 'justify-center'}`}>
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className={`overflow-hidden transition-all duration-300 ${sidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>Logout</span>
          </button>
        </div>
      </aside>
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'}`}>
        <header className="h-16 bg-white border-b border-green-200 shadow-sm flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-green-50 text-green-700">
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold text-brown-800">
              {sidebarItems.find((i) => i.href === pathname)?.label || 'Dashboard'}
            </h2>
          </div>
        </header>
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
