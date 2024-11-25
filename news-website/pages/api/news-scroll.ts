import { NextApiRequest, NextApiResponse } from 'next'
import { fetchAllCategoryArticles } from '../../app/lib/newsApi'

let newsScrollArticles: any[] = []
let newsScrollCount = 7

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    if (newsScrollArticles.length === 0) {
      newsScrollArticles = await fetchAllCategoryArticles()
    }
    res.status(200).json(newsScrollArticles.slice(0, newsScrollCount))
  } else if (req.method === 'POST') {
    const data = req.body
    newsScrollArticles = data.articles
    newsScrollCount = data.count
    res.status(200).json({ message: 'NewsScroll content updated successfully' })
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

