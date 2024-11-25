import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { categories } from '../../../utils/demoData'

let currentCategories = categories

export async function GET() {
  return NextResponse.json(currentCategories)
}

export async function POST(request: Request) {
  const { category, action } = await request.json()

  if (action === 'add') {
    if (!currentCategories.includes(category)) {
      currentCategories.push(category)
      await createCategoryPage(category)
    }
  } else if (action === 'remove') {
    currentCategories = currentCategories.filter(c => c !== category)
    await deleteCategoryPage(category)
  }

  return NextResponse.json({ message: 'Categories updated successfully', categories: currentCategories })
}

async function createCategoryPage(category: string) {
  const template = `
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
    className="bg-card text-card-foreground rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
  >
    <Image
      src={article.imageUrl}
      alt={article.title}
      width={400}
      height={200}
      objectFit="cover"
    />
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
      <p className="text-muted-foreground mb-4">{article.excerpt}</p>
      <Link
        href={\`/article/\${article.id}\`}
        className="text-primary hover:text-primary/90 transition-colors"
      >
        Read More
      </Link>
    </div>
  </motion.div>
)
}

export default function ${category}Page() {
const [sortBy, setSortBy] = useState('date')
const [categoryArticles, setCategoryArticles] = useState([])

useEffect(() => {
  const filteredArticles = articles.filter(
    (article) => article.category.toLowerCase() === '${category.toLowerCase()}'
  )
  setCategoryArticles(filteredArticles)
}, [])

const sortedArticles = [...categoryArticles].sort((a, b) => {
  if (sortBy === 'date') {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  } else if (sortBy === 'title') {
    return a.title.localeCompare(b.title)
  }
  return 0
})

return (
  <div className="container mx-auto px-4 py-8">
    <motion.h1
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-4xl font-bold mb-8 capitalize"
    >
      ${category} News
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
`

  const filePath = path.join(process.cwd(), 'app', 'category', category.toLowerCase(), 'page.tsx')
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, template)
}

async function deleteCategoryPage(category: string) {
  const filePath = path.join(process.cwd(), 'app', 'category', category.toLowerCase(), 'page.tsx')
  await fs.unlink(filePath)
}

