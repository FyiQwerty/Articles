import { useState, useEffect } from 'react'
import { categories } from '../utils/demoData'

interface FooterEditorProps {
  onSave: (footerData: FooterData) => void
}

interface FooterData {
  companyName: string
  companyDescription: string
  categories: string[]
  quickLinks: { title: string, url: string }[]
  copyrightText: string
  copyrightYear: number
}

export default function FooterEditor({ onSave }: FooterEditorProps) {
  const [footerData, setFooterData] = useState<FooterData>({
    companyName: '',
    companyDescription: '',
    categories: [],
    quickLinks: [],
    copyrightText: '',
    copyrightYear: new Date().getFullYear()
  })

  useEffect(() => {
    const fetchFooterData = async () => {
      const response = await fetch('/api/footer-content')
      const data = await response.json()
      setFooterData(data)
    }

    fetchFooterData()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFooterData(prev => ({ ...prev, [name]: value }))
  }

  const handleCategoryToggle = (category: string) => {
    setFooterData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }))
  }

  const handleQuickLinkChange = (index: number, field: 'title' | 'url', value: string) => {
    setFooterData(prev => ({
      ...prev,
      quickLinks: prev.quickLinks.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }))
  }

  const handleAddQuickLink = () => {
    setFooterData(prev => ({
      ...prev,
      quickLinks: [...prev.quickLinks, { title: '', url: '' }]
    }))
  }

  const handleRemoveQuickLink = (index: number) => {
    setFooterData(prev => ({
      ...prev,
      quickLinks: prev.quickLinks.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(footerData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Edit Footer Content</h2>
      
      <div>
        <label htmlFor="companyName" className="block mb-2 font-semibold">Company Name</label>
        <input
          type="text"
          id="companyName"
          name="companyName"
          value={footerData.companyName}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>

      <div>
        <label htmlFor="companyDescription" className="block mb-2 font-semibold">Company Description</label>
        <textarea
          id="companyDescription"
          name="companyDescription"
          value={footerData.companyDescription}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border rounded"
          rows={3}
          required
        />
      </div>

      <div>
        <label className="block mb-2 font-semibold">Categories</label>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => handleCategoryToggle(category)}
              className={`px-3 py-1 rounded ${
                footerData.categories.includes(category)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block mb-2 font-semibold">Quick Links</label>
        {footerData.quickLinks.map((link, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={link.title}
              onChange={(e) => handleQuickLinkChange(index, 'title', e.target.value)}
              placeholder="Link Title"
              className="flex-1 px-3 py-2 border rounded"
            />
            <input
              type="text"
              value={link.url}
              onChange={(e) => handleQuickLinkChange(index, 'url', e.target.value)}
              placeholder="Link URL"
              className="flex-1 px-3 py-2 border rounded"
            />
            <button
              type="button"
              onClick={() => handleRemoveQuickLink(index)}
              className="px-3 py-2 bg-red-500 text-white rounded"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddQuickLink}
          className="px-3 py-2 bg-green-500 text-white rounded"
        >
          Add Quick Link
        </button>
      </div>

      <div>
        <label htmlFor="copyrightText" className="block mb-2 font-semibold">Copyright Text</label>
        <input
          type="text"
          id="copyrightText"
          name="copyrightText"
          value={footerData.copyrightText}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>

      <div>
        <label htmlFor="copyrightYear" className="block mb-2 font-semibold">Copyright Year</label>
        <input
          type="number"
          id="copyrightYear"
          name="copyrightYear"
          value={footerData.copyrightYear}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>

      <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded">
        Save Footer Changes
      </button>
    </form>
  )
}

