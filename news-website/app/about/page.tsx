'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function AboutPage() {
  const [aboutContent, setAboutContent] = useState("Welcome to NextGen News, your trusted source for high-quality news and current affairs. Our mission is to deliver accurate, timely, and insightful reporting on events shaping our world.")
  const [contactContent, setContactContent] = useState("We value your feedback and inquiries. Please feel free to reach out to us at contact@nextgennews.com or call us at +1 (555) 123-4567.")

  useEffect(() => {
    // In a real application, you would fetch this content from your API
    const fetchAboutContent = async () => {
      // Simulating API call
      const response = await fetch('/api/about-content')
      const data = await response.json()
      setAboutContent(data.aboutContent)
      setContactContent(data.contactContent)
    }

    fetchAboutContent()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-8 text-center"
      >
        About NextGen News
      </motion.h1>

      <div className="grid gap-12 md:grid-cols-2">
        <motion.section 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-card text-card-foreground p-6 rounded-lg shadow-lg"
        >
          <h2 className="text-2xl font-semibold mb-4">About Us</h2>
          <p className="text-muted-foreground mb-4">{aboutContent}</p>
        </motion.section>

        <motion.section 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-card text-card-foreground p-6 rounded-lg shadow-lg"
        >
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="text-muted-foreground mb-4">{contactContent}</p>
        </motion.section>
      </div>
    </div>
  )
}

