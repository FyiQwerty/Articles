import { NextApiRequest, NextApiResponse } from 'next'
import { articles } from '../../app/utils/demoData'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { featured, category } = req.query

    try {
      if (featured === 'true') {
        // Return the first 3 articles as featured
        const featuredArticles = articles.slice(0, 3)
        res.status(200).json(featuredArticles)
      } else if (category) {
        // Filter articles by category
        const categoryArticles = articles.filter(article => article.category.toLowerCase() === category.toString().toLowerCase())
        res.status(200).json(categoryArticles)
      } else {
        // Return all articles
        res.status(200).json(articles)
      }
    } catch (error) {
      console.error('Error fetching articles:', error)
      res.status(500).json({ error: 'Failed to fetch articles' })
    }
  } else if (req.method === 'POST') {
    // For now, we'll keep this as is. In a real application, you'd implement proper article creation.
    const article = req.body
    res.status(201).json({ message: 'Article added successfully' })
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

