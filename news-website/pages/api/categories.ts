import { NextApiRequest, NextApiResponse } from 'next'

const categories = ['Business', 'Entertainment', 'General', 'Health', 'Science', 'Sports', 'Technology']

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json(categories)
  } else if (req.method === 'POST') {
    // For now, we'll keep this as is. In a real application, you might want to implement category management.
    const updatedCategories = req.body
    res.status(200).json({ message: 'Categories updated successfully' })
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

