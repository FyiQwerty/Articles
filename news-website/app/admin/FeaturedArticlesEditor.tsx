'use client'

import { useState, useEffect } from 'react'
import { Article } from '../utils/demoData'

export default function FeaturedArticlesEditor() {
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([])
  const [allArticles, setAllArticles] = useState<Article[]>([])

  useEffect(() => {
    const fetchArticles = async () => {
      const [featuredResponse, allResponse] = await Promise.all([
        fetch('/api/featured-articles'),
        fetch('/api/articles')
      ])
      const featuredData = await featuredResponse.json()
      const allData = await allResponse.json()
      setFeaturedArticles(featuredData)
      setAllArticles(allData)
    }
    fetchArticles()
  }, [])

  const handleAddFeatured = (article: Article) => {
    setFeaturedArticles(prev => [...prev, article])
  }

  const handleRemoveFeatured = (articleId: string) => {
    setFeaturedArticles(prev => prev.filter(article => article.id !== articleId))
  }

  const handleSaveChanges = async () => {
    const response = await fetch('/api/featured-articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(featuredArticles),
    })
    if (response.ok) {
      alert('Featured articles updated successfully')
    } else {
      alert('Failed to update featured articles')
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Edit Featured Articles</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">Featured Articles</h3>
          <ul className="space-y-2">
            {featuredArticles.map(article => (
              <li key={article.id} className="flex justify-between items-center">
                <span>{article.title}</span>
                <button
                  onClick={() => handleRemoveFeatured(article.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">All Articles</h3>
          <ul className="space-y-2">
            {allArticles
              .filter(article => !featuredArticles.some(featured => featured.id === article.id))
              .map(article => (
                <li key={article.id} className="flex justify-between items-center">
                  <span>{article.title}</span>
                  <button
                    onClick={() => handleAddFeatured(article)}
                    className="text-green-500 hover:text-green-700"
                  >
                    Add
                  </button>
                </li>
              ))}
          </ul>
        </div>
      </div>
      <button
        onClick={handleSaveChanges}
        className="bg-primary text-primary-foreground px-4 py-2 rounded mt-4"
      >
        Save Changes
      </button>
    </div>
  )
}

