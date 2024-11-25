import { useState, useEffect } from 'react'

interface CategoryManagerProps {
  onSave: (updatedCategories: string[]) => void
}

export default function CategoryManager({ onSave }: CategoryManagerProps) {
  const [currentCategories, setCurrentCategories] = useState<string[]>([])
  const [newCategory, setNewCategory] = useState('')

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch('/api/categories/manage')
      const data = await response.json()
      setCurrentCategories(data)
    }
    fetchCategories()
  }, [])

  const handleAddCategory = async () => {
    if (newCategory && !currentCategories.includes(newCategory)) {
      const response = await fetch('/api/categories/manage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category: newCategory, action: 'add' }),
      })
      const data = await response.json()
      setCurrentCategories(data.categories)
      setNewCategory('')
    }
  }

  const handleRemoveCategory = async (category: string) => {
    const response = await fetch('/api/categories/manage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ category, action: 'remove' }),
    })
    const data = await response.json()
    setCurrentCategories(data.categories)
  }

  const handleSave = () => {
    onSave(currentCategories)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Manage Categories</h2>
      <div className="flex space-x-2">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category name"
          className="flex-grow px-3 py-2 border rounded"
        />
        <button
          onClick={handleAddCategory}
          className="bg-primary text-primary-foreground px-4 py-2 rounded"
        >
          Add Category
        </button>
      </div>
      <ul className="space-y-2">
        {currentCategories.map((category) => (
          <li key={category} className="flex justify-between items-center bg-card p-2 rounded">
            <span>{category}</span>
            <button
              onClick={() => handleRemoveCategory(category)}
              className="text-destructive hover:text-destructive/90"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={handleSave}
        className="bg-accent text-accent-foreground px-4 py-2 rounded mt-4"
      >
        Save Changes
      </button>
    </div>
  )
}

