'use client'

import { usePathname } from 'next/navigation'
import NewsScrollTab from './NewsScrollTab'

export default function ConditionalNewsScrollTab() {
  const pathname = usePathname()

  // Don't render the NewsScrollTab on the homepage
  if (pathname === '/') {
    return null
  }

  return <NewsScrollTab />
}

