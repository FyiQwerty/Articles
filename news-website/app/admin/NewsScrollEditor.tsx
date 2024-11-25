import { useState, useEffect } from 'react'
import { Article, categories } from '../utils/demoData'

interface NewsScrollEditorProps {
  onSave: (articles: Article[], count: number) => void
}

export default function NewsScrollEditor({ onSave }: NewsScrollEditorProps) {
  const [newsScrollArticles, setNewsScrollArticles] = useState<Article[]>([])
  const [articleCount, setArticleCount] = useState(7)

  useEffect(() => {
    const fetchNewsScrollArticles = async () => {
      const response = await fetch('/api/news-scroll')
      const data = await response.json()
      setNewsScrollArticles(data)
    }
    fetchNewsScrollArticles()
  }, [])

  const handleArticleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArticleCount(Number(e.target.value))
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
  }

  const handleSaveChanges = () => {
    onSave(newsScrollArticles, articleCount)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Edit NewsScroll</h2>
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
    </div>
  )
}

