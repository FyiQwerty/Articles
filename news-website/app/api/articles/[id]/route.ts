import { NextResponse } from 'next/server'
import { articles } from '../../../utils/demoData'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id
  const article = articles.find(a => a.id === id)
  
  if (!article) {
    return NextResponse.json({ error: 'Article not found' }, { status: 404 })
  }

  return NextResponse.json(article)
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id
  const updatedArticle = await request.json()
  const index = articles.findIndex(a => a.id === id)

  if (index === -1) {
    return NextResponse.json({ error: 'Article not found' }, { status: 404 })
  }

  // In a real application, you would validate the input before updating
  articles[index] = { ...articles[index], ...updatedArticle }
  return NextResponse.json({ message: 'Article updated successfully' })
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id
  const index = articles.findIndex(a => a.id === id)

  if (index === -1) {
    return NextResponse.json({ error: 'Article not found' }, { status: 404 })
  }

  articles.splice(index, 1)
  return NextResponse.json({ message: 'Article deleted successfully' })
}

