import Link from 'next/link'
import { motion } from 'framer-motion'
import { Article } from '../utils/demoData'

interface CategoryPreviewProps {
  category: string
  articles: Article[]
}

export default function CategoryPreview({ category, articles }: CategoryPreviewProps) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-4">
        <Link href={`/category/${category.toLowerCase()}`} className="hover:text-primary transition-colors">
          {category}
        </Link>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Link href={`/article/${article.id}`} className="block">
              <div className="bg-card text-card-foreground rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow p-4">
                <h3 className="text-lg font-semibold mb-2 line-clamp-2">{article.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-3">{article.excerpt}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

