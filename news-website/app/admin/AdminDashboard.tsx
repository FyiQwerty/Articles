import { useState, useEffect } from 'react'
import Link from 'next/link'
import ArticleEditor from './ArticleEditor'
import ArticleList from './ArticleList'
import AboutPageEditor from './AboutPageEditor'
import FooterEditor from './FooterEditor'
import CategoryManager from './CategoryManager'
import FeaturedArticlesEditor from './FeaturedArticlesEditor'
import { Article, categories } from '../utils/demoData'

interface AdminDashboardProps {
  onLogout: () => void
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [articles, setArticles] = useState<Article[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all')
  const [showAboutEditor, setShowAboutEditor] = useState(false)
  const [showFooterEditor, setShowFooterEditor] = useState(false)
  const [showCategoryManager, setShowCategoryManager] = useState(false)
  const [availableCategories, setAvailableCategories] = useState(categories)
  const [showFeaturedArticlesEditor, setShowFeaturedArticlesEditor] = useState(false)

  useEffect(() => {
    const fetchArticles = async () => {
      const response = await fetch('/api/articles?displayed=true')
      const data = await response.json()
      setArticles(data)
    }
    fetchArticles()

    const fetchCategories = async () => {
      const response = await fetch('/api/categories')
      const data = await response.json()
      setAvailableCategories(data)
    }
    fetchCategories()
  }, [])

  const handleArticleUpdate = (updatedArticle: Article) => {
    setArticles(prevArticles => 
      prevArticles.map(article => 
        article.id === updatedArticle.id ? updatedArticle : article
      )
    )
    setSelectedArticle(null)
  }

  const handleArticleCreate = (newArticle: Article) => {
    setArticles(prevArticles => [...prevArticles, newArticle])
    setSelectedArticle(null)
  }

  const handleAboutPageSave = async (aboutContent: string, contactContent: string) => {
    try {
      const response = await fetch('/api/about-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ aboutContent, contactContent }),
      })
      if (response.ok) {
        alert('About page content updated successfully')
        setShowAboutEditor(false)
      } else {
        throw new Error('Failed to update About page content')
      }
    } catch (error) {
      console.error('Error updating About page content:', error)
      alert('Failed to update About page content')
    }
  }

  const handleFooterSave = async (footerData: any) => {
    try {
      const response = await fetch('/api/footer-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(footerData),
      })
      if (response.ok) {
        alert('Footer content updated successfully')
        setShowFooterEditor(false)
      } else {
        throw new Error('Failed to update Footer content')
      }
    } catch (error) {
      console.error('Error updating Footer content:', error)
      alert('Failed to update Footer content')
    }
  }

  const handleCategorySave = async (updatedCategories: string[]) => {
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCategories),
      })
      if (response.ok) {
        alert('Categories updated successfully')
        setAvailableCategories(updatedCategories)
        setShowCategoryManager(false)
      } else {
        throw new Error('Failed to update categories')
      }
    } catch (error) {
      console.error('Error updating categories:', error)
      alert('Failed to update categories')
    }
  }

  const filteredArticles = selectedCategory === 'all' 
    ? articles 
    : articles.filter(article => article.category === selectedCategory)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="flex flex-wrap gap-4 mb-8">
        <button onClick={onLogout} className="bg-secondary text-secondary-foreground px-4 py-2 rounded">
          Logout
        </button>
        <Link href="/admin/news-scroll" className="bg-primary text-primary-foreground px-4 py-2 rounded">
          Edit NewsScroll
        </Link>
        <button 
          onClick={() => setShowAboutEditor(!showAboutEditor)} 
          className="bg-accent text-accent-foreground px-4 py-2 rounded"
        >
          {showAboutEditor ? 'Hide About Page Editor' : 'Edit About Page'}
        </button>
        <button 
          onClick={() => setShowFooterEditor(!showFooterEditor)} 
          className="bg-accent text-accent-foreground px-4 py-2 rounded"
        >
          {showFooterEditor ? 'Hide Footer Editor' : 'Edit Footer'}
        </button>
        <button 
          onClick={() => setShowCategoryManager(!showCategoryManager)} 
          className="bg-accent text-accent-foreground px-4 py-2 rounded"
        >
          {showCategoryManager ? 'Hide Category Manager' : 'Manage Categories'}
        </button>
        <button 
          onClick={() => setShowFeaturedArticlesEditor(!showFeaturedArticlesEditor)} 
          className="bg-accent text-accent-foreground px-4 py-2 rounded"
        >
          {showFeaturedArticlesEditor ? 'Hide Featured Articles Editor' : 'Edit Featured Articles'}
        </button>
      </div>

      {showAboutEditor && (
        <div className="mb-8">
          <AboutPageEditor onSave={handleAboutPageSave} />
        </div>
      )}

      {showFooterEditor && (
        <div className="mb-8">
          <FooterEditor onSave={handleFooterSave} />
        </div>
      )}

      {showCategoryManager && (
        <div className="mb-8">
          <CategoryManager onSave={handleCategorySave} />
        </div>
      )}

      {showFeaturedArticlesEditor && (
        <div className="mb-8">
          <FeaturedArticlesEditor />
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Manage Articles</h2>
        <label htmlFor="category-filter" className="mr-2">Filter by category:</label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="all">All Categories</option>
          {availableCategories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ArticleList 
          articles={filteredArticles} 
          onSelectArticle={setSelectedArticle} 
          onCreateNew={() => setSelectedArticle({ id: 'new', title: '', content: '', category: '', imageUrl: '', author: '', date: new Date().toISOString(), excerpt: '' })}
        />
        <ArticleEditor 
          article={selectedArticle} 
          onSave={selectedArticle?.id === 'new' ? handleArticleCreate : handleArticleUpdate} 
          categories={availableCategories}
        />
      </div>
    </div>
  )
}

