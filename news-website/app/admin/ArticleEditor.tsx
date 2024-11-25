import { useState, useEffect, useRef } from 'react'
import { Article } from '../utils/demoData'

interface ArticleEditorProps {
  article: Article | null
  onSave: (article: Article) => void
  categories: string[]
}

export default function ArticleEditor({ article, onSave, categories }: ArticleEditorProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (article) {
      setTitle(article.title)
      setContent(article.content)
      setCategory(article.category)
      setImageUrl(article.imageUrl)
      setExcerpt(article.excerpt)
    } else {
      setTitle('')
      setContent('')
      setCategory('')
      setImageUrl('')
      setExcerpt('')
    }
  }, [article])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (article) {
      onSave({
        ...article,
        title,
        content,
        category,
        imageUrl,
        excerpt,
      })
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsUploading(true)
      const formData = new FormData()
      formData.append('image', file)

      try {
        const response = await fetch('/api/upload-image', {
          method: 'POST',
          body: formData,
        })

        if (response.ok) {
          const data = await response.json()
          setImageUrl(data.imageUrl)
        } else {
          console.error('Image upload failed')
        }
      } catch (error) {
        console.error('Error uploading image:', error)
      } finally {
        setIsUploading(false)
      }
    }
  }

  if (!article) {
    return <div>Select an article to edit or create a new one.</div>
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-4">{article.id === 'new' ? 'Create New Article' : 'Edit Article'}</h2>
      <div className="mb-4">
        <label htmlFor="title" className="block mb-2">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="excerpt" className="block mb-2">Excerpt</label>
        <textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          rows={3}
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="content" className="block mb-2">Content</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          rows={10}
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="category" className="block mb-2">Category</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="imageUrl" className="block mb-2">Image URL</label>
        <input
          type="text"
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="imageUpload" className="block mb-2">Upload Image</label>
        <input
          type="file"
          id="imageUpload"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="bg-secondary text-secondary-foreground px-4 py-2 rounded mr-2"
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : 'Choose File'}
        </button>
        {imageUrl && (
          <img src={imageUrl} alt="Uploaded" className="mt-2 max-w-xs h-auto" />
        )}
      </div>
      <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded">
        {article.id === 'new' ? 'Create Article' : 'Update Article'}
      </button>
    </form>
  )
}

