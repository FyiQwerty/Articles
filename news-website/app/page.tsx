'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import DateRangePicker from './components/DateRangePicker'
import FeaturedArticle from './components/FeaturedArticle'
import CategoryPreview from './components/CategoryPreview'
import SearchBar from './components/SearchBar'
import { Article, categories as initialCategories } from './utils/demoData'

export default function Home() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategories)
  const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null)
  const [categoryPreviews, setCategoryPreviews] = useState<{ category: string, articles: Article[] }[]>([])
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null })
  const [sortBy, setSortBy] = useState('date')
  const [categories, setCategories] = useState<string[]>(initialCategories); // Added categories state

  useEffect(() => {
    const fetchData = async () => {
      const [featuredResponse, categoriesResponse] = await Promise.all([
        fetch('/api/articles?featured=true'),
        fetch('/api/categories')
      ])
      const featuredArticles: Article[] = await featuredResponse.json()
      const fetchedCategories: string[] = await categoriesResponse.json()
    
      setFeaturedArticle(featuredArticles[0])
      setCategories(fetchedCategories)
      setSelectedCategories(fetchedCategories)

      const previews = await Promise.all(fetchedCategories.map(async (category) => {
        const response = await fetch(`/api/articles?category=${category}`)
        const articles: Article[] = await response.json()
        return {
          category,
          articles: articles.slice(0, 10)
        }
      }))
      setCategoryPreviews(previews)
    }

    fetchData()
  }, [])

  useEffect(() => {
    const sortedCategoryPreviews = categoryPreviews.map(({ category, articles }) => ({
      category,
      articles: articles.sort((a, b) => {
        if (sortBy === 'date') {
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        } else if (sortBy === 'title') {
          return a.title.localeCompare(b.title)
        }
        return 0
      }).filter((article) => {
        const articleDate = new Date(article.date)
        return (
          (!dateRange.startDate || articleDate >= dateRange.startDate) &&
          (!dateRange.endDate || articleDate <= dateRange.endDate)
        )
      })
    }))

    setCategoryPreviews(sortedCategoryPreviews)
  }, [dateRange, sortBy, categoryPreviews])


  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-5xl font-bold mb-8 text-center"
      >
        NextGen News
      </motion.h1>
      {featuredArticle && <FeaturedArticle article={featuredArticle} />}
      <div className="mt-12 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Select Your Favorite Categories</h2>
          <SearchBar />
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => toggleCategory(category)}
              className={`px-4 py-2 rounded-full ${
                selectedCategories.includes(category)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </div>
        <Link href="/news-scroll" className="mt-4 inline-block bg-accent text-accent-foreground px-4 py-2 rounded-full font-semibold hover:bg-accent/90 transition-colors">
          Try NewsScroll - Our Exclusive Feature!
        </Link>
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
      <AnimatePresence>
        {categoryPreviews.map(({ category, articles }) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <CategoryPreview category={category} articles={articles} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

