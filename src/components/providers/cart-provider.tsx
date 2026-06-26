'use client'

import * as React from 'react'

/**
 * CartProvider hydrates the persisted cart state on mount.
 * Without this, Zustand persist may not rehydrate until the user interacts.
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = React.useState(false)

  React.useEffect(() => {
    setHydrated(true)
  }, [])

  // Render nothing (or a thin placeholder) on the server to avoid hydration mismatch
  if (!hydrated) {
    return <>{children}</>
  }

  return <>{children}</>
}
