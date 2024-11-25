'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { articles } from '../../utils/demoData'

const ArticleCard = ({ article }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
      className="bg-card text-card-foreground rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow p-4"
    >
      <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
      <p className="text-muted-foreground mb-4">{article.excerpt}</p>
      <Link
        href={`/article/${article.id}`}
        className="text-primary hover:text-primary/90 transition-colors"
      >
        Read More
      </Link>
    </motion.div>
  )
}

export default function CategoryPage({ params }) {
  const { slug } = params
  const [sortBy, setSortBy] = useState('date')
  const [categoryArticles, setCategoryArticles] = useState([])
  const [categoryExists, setCategoryExists] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch('/api/categories')
      const categories = await response.json()
      if (!categories.map(c => c.toLowerCase()).includes(slug.toLowerCase())) {
        setCategoryExists(false)
      } else {
        const filteredArticles = articles.filter(
          (article) => article.category.toLowerCase() === slug.toLowerCase()
        )
        setCategoryArticles(filteredArticles)
      }
    }
    fetchCategories()
  }, [slug])

  const sortedArticles = [...categoryArticles].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    } else if (sortBy === 'title') {
      return a.title.localeCompare(b.title)
    }
    return 0
  })

  if (!categoryExists) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Category not found</h1>
        <p>The category you're looking for doesn't exist.</p>
        <Link href="/" className="text-primary hover:text-primary/90 transition-colors">
          Go back to homepage
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-8 capitalize"
      >
        {slug} News
      </motion.h1>
      <div className="mb-8">
        <label htmlFor="sort" className="mr-2">Sort by:</label>
        <select
          id="sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-background border border-input rounded px-2 py-1"
        >
          <option value="date">Date</option>
          <option value="title">Title</option>
        </select>
      </div>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {sortedArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

