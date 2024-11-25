'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import DateRangePicker from '../components/DateRangePicker'
import { Article, categories } from '../utils/demoData'

export default function NewsScrollPage() {
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categories)
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null })
  const [sortBy, setSortBy] = useState('date')
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([])

  const containerRef = useRef<HTMLDivElement>(null)
  const articleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchArticles = async () => {
      const response = await fetch('/api/articles')
      const articles: Article[] = await response.json()
      setFilteredArticles(articles)
    }
    fetchArticles()
  }, [])

  useEffect(() => {
    const filtered = filteredArticles.filter((article) => {
      const inSelectedCategory = selectedCategories.includes(article.category)
      const articleDate = new Date(article.date)
      const inDateRange = 
        (!dateRange.startDate || articleDate >= dateRange.startDate) &&
        (!dateRange.endDate || articleDate <= dateRange.endDate)
      return inSelectedCategory && inDateRange
    })

    const sorted = filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title)
      }
      return 0
    })

    setFilteredArticles(sorted)
    setCurrentArticleIndex(0)
  }, [selectedCategories, dateRange, sortBy])

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      setCurrentArticleIndex((prev) => (prev + 1) % filteredArticles.length)
    } else if (e.key === 'ArrowUp') {
      setCurrentArticleIndex((prev) => (prev - 1 + filteredArticles.length) % filteredArticles.length)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [filteredArticles.length])

  const handleWheel = (e: WheelEvent) => {
    if (articleRef.current && articleRef.current.contains(e.target as Node)) {
      e.preventDefault()
      if (e.deltaY > 0) {
        setCurrentArticleIndex((prev) => (prev + 1) % filteredArticles.length)
      } else if (e.deltaY < 0) {
        setCurrentArticleIndex((prev) => (prev - 1 + filteredArticles.length) % filteredArticles.length)
      }
    }
  }

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false })
      return () => container.removeEventListener('wheel', handleWheel)
    }
  }, [filteredArticles.length])

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-4xl font-bold mb-8">NewsScroll</h1>
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Select Categories</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => toggleCategory(category)}
                className={`px-4 py-2 rounded-full ${
                  selectedCategories.includes(category)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8 flex flex-wrap items-center gap-4">
          <DateRangePicker onChange={setDateRange} />
          <div>
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
        </div>

        <div
          ref={containerRef}
          className="h-[calc(100vh-200px)] relative overflow-hidden"
        >
          <AnimatePresence initial={false}>
            {filteredArticles.length > 0 && (
              <motion.div
                ref={articleRef}
                key={currentArticleIndex}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="max-w-2xl mx-auto text-center">
                  <h3 className="text-2xl font-bold mb-4">{filteredArticles[currentArticleIndex].title}</h3>
                  <p className="text-lg mb-6">{filteredArticles[currentArticleIndex].excerpt}</p>
                  <Link
                    href={`/article/${filteredArticles[currentArticleIndex].id}`}
                    className="bg-primary text-primary-foreground px-6 py-3 rounded-full text-lg font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Read Full Article
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setCurrentArticleIndex((prev) => (prev - 1 + filteredArticles.length) % filteredArticles.length)}
            className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground p-2 rounded-full"
          >
            <ChevronUp size={24} />
          </button>
          <button
            onClick={() => setCurrentArticleIndex((prev) => (prev + 1) % filteredArticles.length)}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground p-2 rounded-full"
          >
            <ChevronDown size={24} />
          </button>
        </div>
      </div>
    </div>
)
}

