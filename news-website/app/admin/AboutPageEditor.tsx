import { useState, useEffect } from 'react'

interface AboutPageEditorProps {
  onSave: (aboutContent: string, contactContent: string) => void
}

export default function AboutPageEditor({ onSave }: AboutPageEditorProps) {
  const [aboutContent, setAboutContent] = useState('')
  const [contactContent, setContactContent] = useState('')

  useEffect(() => {
    // In a real application, you would fetch this content from your API
    const fetchAboutContent = async () => {
      // Simulating API call
      const response = await fetch('/api/about-content')
      const data = await response.json()
      setAboutContent(data.aboutContent)
      setContactContent(data.contactContent)
    }

    fetchAboutContent()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(aboutContent, contactContent)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Edit About Page Content</h2>
      <div>
        <label htmlFor="aboutContent" className="block mb-2 font-semibold">About Us Content</label>
        <textarea
          id="aboutContent"
          value={aboutContent}
          onChange={(e) => setAboutContent(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          rows={6}
          required
        />
      </div>
      <div>
        <label htmlFor="contactContent" className="block mb-2 font-semibold">Contact Us Content</label>
        <textarea
          id="contactContent"
          value={contactContent}
          onChange={(e) => setContactContent(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          rows={6}
          required
        />
      </div>
      <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded">
        Save Changes
      </button>
    </form>
  )
}

