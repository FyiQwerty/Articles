import { NextApiRequest, NextApiResponse } from 'next'
import { fetchAllCategoryArticles } from '../../app/lib/newsApi'

let featuredArticles: any[] = []

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    if (featuredArticles.length === 0) {
      const allArticles = await fetchAllCategoryArticles()
      featuredArticles = allArticles.slice(0, 3)
    }
    res.status(200).json(featuredArticles)
  } else if (req.method === 'POST') {
    const newFeaturedArticles = req.body
    featuredArticles = newFeaturedArticles
    res.status(200).json({ message: 'Featured articles updated successfully' })
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

