'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react'

interface FooterData {
  companyName: string
  companyDescription: string
  categories: string[]
  quickLinks: { title: string, url: string }[]
  copyrightText: string
  copyrightYear: number
}

export default function Footer() {
  const [footerData, setFooterData] = useState<FooterData | null>(null)

  useEffect(() => {
    const fetchFooterData = async () => {
      const [footerResponse, categoriesResponse] = await Promise.all([
        fetch('/api/footer-content'),
        fetch('/api/categories/manage')
      ])
      const footerContent = await footerResponse.json()
      const categories = await categoriesResponse.json()
      setFooterData({ ...footerContent, categories })
    }

    fetchFooterData()
  }, [])

  if (!footerData) {
    return null // or a loading spinner
  }

  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">{footerData.companyName}</h3>
            <p className="mb-4">{footerData.companyDescription}</p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary transition-colors"><Facebook /></a>
              <a href="#" className="hover:text-primary transition-colors"><Twitter /></a>
              <a href="#" className="hover:text-primary transition-colors"><Instagram /></a>
              <a href="#" className="hover:text-primary transition-colors"><Linkedin /></a>
              <a href="#" className="hover:text-primary transition-colors"><Youtube /></a>
            </div>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              {footerData.categories.slice(0, 5).map((category) => (
                <li key={category}>
                  <Link href={`/category/${category.toLowerCase()}`} className="hover:text-primary transition-colors">
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-4">More Categories</h4>
            <ul className="space-y-2">
              {footerData.categories.slice(5).map((category) => (
                <li key={category}>
                  <Link href={`/category/${category.toLowerCase()}`} className="hover:text-primary transition-colors">
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {footerData.quickLinks.map((link) => (
                <li key={link.title}>
                  <Link href={link.url} className="hover:text-primary transition-colors">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-700 text-center">
          <p>&copy; {footerData.copyrightYear} {footerData.companyName}. {footerData.copyrightText}</p>
        </div>
      </div>
    </footer>
  )
}

