import { Article } from '../utils/demoData'

interface ArticleListProps {
  articles: Article[]
  onSelectArticle: (article: Article) => void
  onCreateNew: () => void
}

export default function ArticleList({ articles, onSelectArticle, onCreateNew }: ArticleListProps) {
  const groupedArticles = articles.reduce((acc, article) => {
    if (!acc[article.category]) {
      acc[article.category] = []
    }
    acc[article.category].push(article)
    return acc
  }, {} as Record<string, Article[]>)

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Articles</h2>
      <button onClick={onCreateNew} className="bg-accent text-accent-foreground px-4 py-2 rounded mb-4">
        Create New Article
      </button>
      {Object.entries(groupedArticles).map(([category, categoryArticles]) => (
        <div key={category} className="mb-6">
          <h3 className="text-lg font-semibold mb-2">{category}</h3>
          <ul className="space-y-2">
            {categoryArticles.map((article) => (
              <li
                key={article.id}
                onClick={() => onSelectArticle(article)}
                className="cursor-pointer hover:bg-accent p-2 rounded"
              >
                {article.title}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

