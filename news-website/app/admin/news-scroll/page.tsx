'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Article, categories } from '../../utils/demoData'
import ArticleEditor from '../ArticleEditor'

export default function AdminNewsScrollPage() {
  const [newsScrollArticles, setNewsScrollArticles] = useState<Article[]>([])
  const [articleCount, setArticleCount] = useState(7)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)

  useEffect(() => {
    // Fetch NewsScroll articles
    const fetchNewsScrollArticles = async () => {
      // In a real application, you would fetch this data from your API
      const response = await fetch('/api/news-scroll')
      const data = await response.json()
      setNewsScrollArticles(data)
    }
    fetchNewsScrollArticles()
  }, [])

  const handleArticleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArticleCount(Number(e.target.value))
  }

  const handleArticleUpdate = (updatedArticle: Article) => {
    setNewsScrollArticles(prevArticles => 
      prevArticles.map(article => 
        article.id === updatedArticle.id ? updatedArticle : article
      )
    )
    setEditingArticle(null)
  }

  const handleArticleRemove = (articleId: string) => {
    setNewsScrollArticles(prevArticles => 
      prevArticles.filter(article => article.id !== articleId)
    )
  }

  const handleArticleAdd = () => {
    const newArticle: Article = {
      id: `new-${Date.now()}`,
      title: 'New Article',
      content: '',
      excerpt: '',
      category: '',
      author: '',
      date: new Date().toISOString(),
      imageUrl: '',
    }
    setNewsScrollArticles(prevArticles => [...prevArticles, newArticle])
    setEditingArticle(newArticle)
  }

  const handleSaveChanges = () => {
    // In a real application, you would send the updated articles and count to your API
    console.log('Saving changes', { articles: newsScrollArticles, count: articleCount })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Admin NewsScroll Editor</h1>
      <Link href="/admin" className="bg-secondary text-secondary-foreground px-4 py-2 rounded mb-4 inline-block">
        Back to Dashboard
      </Link>
      <div className="mb-4">
        <label htmlFor="articleCount" className="block mb-2">Number of articles to display in NewsScroll:</label>
        <input
          type="number"
          id="articleCount"
          value={articleCount}
          onChange={handleArticleCountChange}
          min="1"
          className="w-24 px-3 py-2 border rounded"
        />
      </div>
      <p className="mb-4">Currently displaying {Math.min(articleCount, newsScrollArticles.length)} articles in NewsScroll feed</p>
      <ul className="space-y-4">
        {newsScrollArticles.slice(0, articleCount).map((article, index) => (
          <li key={article.id} className="border p-4 rounded">
            <h3 className="text-xl font-semibold mb-2">{index + 1}. {article.title}</h3>
            <p className="mb-2">{article.excerpt}</p>
            <p className="mb-2 text-sm text-gray-500">Category: {article.category}</p>
            {article.imageUrl && (
              <img src={article.imageUrl} alt={article.title} className="mb-2 max-w-xs h-auto" />
            )}
            <button onClick={() => setEditingArticle(article)} className="bg-primary text-primary-foreground px-3 py-1 rounded mr-2">
              Edit
            </button>
            <button onClick={() => handleArticleRemove(article.id)} className="bg-destructive text-destructive-foreground px-3 py-1 rounded">
              Remove
            </button>
          </li>
        ))}
      </ul>
      <button onClick={handleArticleAdd} className="bg-accent text-accent-foreground px-4 py-2 rounded mt-4 mr-4">
        Add New Article
      </button>
      <button onClick={handleSaveChanges} className="bg-primary text-primary-foreground px-4 py-2 rounded mt-4">
        Save Changes
      </button>

      {editingArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-background p-6 rounded-lg w-full max-w-2xl overflow-y-auto max-h-screen">
            <h2 className="text-2xl font-bold mb-4">{editingArticle.id.startsWith('new-') ? 'Add New Article' : 'Edit Article'}</h2>
            <ArticleEditor
              article={editingArticle}
              onSave={(updatedArticle) => {
                handleArticleUpdate(updatedArticle)
                setEditingArticle(null)
              }}
            />
            <button
              onClick={() => setEditingArticle(null)}
              className="mt-4 bg-secondary text-secondary-foreground px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

