'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { articles } from '../../utils/demoData'

export default function ArticlePage({ params }) {
  const { id } = params
  const article = articles.find((a) => a.id === id)
  const [fontSize, setFontSize] = useState('base')

  if (!article) {
    return <div>Article not found</div>
  }

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const fontSizes = {
    small: 'text-sm',
    base: 'text-base',
    large: 'text-lg',
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-4xl font-bold mb-4"
      >
        {article.title}
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-4 text-muted-foreground"
      >
        By {article.author} | {article.date}
      </motion.div>
      <div className="mb-4">
        <label htmlFor="fontSize" className="mr-2">Font Size:</label>
        <select
          id="fontSize"
          value={fontSize}
          onChange={(e) => setFontSize(e.target.value)}
          className="bg-background border border-input rounded px-2 py-1"
        >
          <option value="small">Small</option>
          <option value="base">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.5 }}
        className={`prose prose-invert max-w-none ${fontSizes[fontSize]}`}
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </motion.div>
  )
}

