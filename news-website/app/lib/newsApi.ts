import { Article } from '../utils/demoData'

const API_KEY = process.env.NEWS_API_KEY
const BASE_URL = 'https://newsapi.org/v2'

export async function fetchNewsArticles(category: string = ''): Promise<Article[]> {
  const url = `${BASE_URL}/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`
  
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    
    return data.articles.map((article: any) => ({
      id: article.url,
      title: article.title,
      excerpt: article.description || '',
      content: article.content || '',
      category: category || 'General',
      author: article.author || 'Unknown',
      date: new Date(article.publishedAt).toISOString(),
    }))
  } catch (error) {
    console.error('Error fetching news articles:', error)
    return []
  }
}

export async function fetchAllCategoryArticles(): Promise<Article[]> {
  const categories = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology']
  const articlePromises = categories.map(category => fetchNewsArticles(category))
  const articlesByCategory = await Promise.all(articlePromises)
  return articlesByCategory.flat()
}

