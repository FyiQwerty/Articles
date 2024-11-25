'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function NewsScrollTab() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="fixed left-0 z-50 flex items-center"
      style={{ top: 'var(--header-height)' }}
      initial="hidden"
      animate={isHovered ? "visible" : "hidden"}
      variants={{
        visible: { x: 0 },
        hidden: { x: '-100%' }
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link 
        href="/news-scroll" 
        className="bg-primary text-primary-foreground px-6 py-3 text-lg font-semibold rounded-r-xl shadow-lg hover:bg-primary/90 transition-colors inline-block"
      >
        NewsScroll
      </Link>
      <div 
        className="w-2 h-16 bg-primary rounded-r-full cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
      />
    </motion.div>
  )
}

