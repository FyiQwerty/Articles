import { format } from 'date-fns'

export const categories = [
  'World', 'India', 'Business', 'Technology', 'Science',
  'Sports', 'Politics', 'Health', 'Law', 'Entertainment'
]

export interface Article {
  id: string
  title: string
  excerpt: string
  content: string
  category: string
  author: string
  date: string
}

const loremIpsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?`

const generateArticle = (id: number, category: string): Article => ({
  id: `article-${id}`,
  title: `${category} Article ${id}`,
  excerpt: loremIpsum.slice(0, 150) + '...',
  content: loremIpsum.repeat(3),
  category,
  author: `Author ${id % 5 + 1}`,
  date: format(new Date(2023, 0, id % 30 + 1), 'MMMM dd, yyyy'),
})

export const generateArticles = (count: number): Article[] => {
  const articles: Article[] = []
  for (let i = 0; i < count; i++) {
    const category = categories[i % categories.length]
    articles.push(generateArticle(i + 1, category))
  }
  return articles
}

export const articles = generateArticles(100)

