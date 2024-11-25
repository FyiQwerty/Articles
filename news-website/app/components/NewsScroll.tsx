'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export default function NewsScroll({ articles }) {
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0)
  const containerRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current
        const scrollPercentage = scrollTop / (scrollHeight - clientHeight)
        const newIndex = Math.floor(scrollPercentage * articles.length)
        setCurrentArticleIndex(newIndex)
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [articles.length])

  return (
    <div className="mt-16 mb-8">
      <h2 className="text-3xl font-bold mb-6">NewsScroll</h2>
      <div
        ref={containerRef}
        className="h-[50vh] overflow-y-scroll scrollbar-hide"
      >
        <div style={{ height: `${articles.length * 100}%` }}>
          <AnimatePresence>
            <motion.div
              key={currentArticleIndex}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="h-full flex items-center justify-center"
            >
              <div className="max-w-2xl mx-auto text-center">
                <h3 className="text-2xl font-bold mb-4">{articles[currentArticleIndex].title}</h3>
                <p className="text-lg mb-6">{articles[currentArticleIndex].excerpt}</p>
                <Link
                  href={`/article/${articles[currentArticleIndex].id}`}
                  className="bg-primary text-primary-foreground px-6 py-3 rounded-full text-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  Read Full Article
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

