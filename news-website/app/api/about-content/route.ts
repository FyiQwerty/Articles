import { NextResponse } from 'next/server'

// In a real application, you would store this data in a database
let aboutContent = "Welcome to NextGen News, your trusted source for high-quality news and current affairs. Our mission is to deliver accurate, timely, and insightful reporting on events shaping our world."
let contactContent = "We value your feedback and inquiries. Please feel free to reach out to us at contact@nextgennews.com or call us at +1 (555) 123-4567."

export async function GET() {
  return NextResponse.json({ aboutContent, contactContent })
}

export async function POST(request: Request) {
  const data = await request.json()
  aboutContent = data.aboutContent
  contactContent = data.contactContent
  return NextResponse.json({ message: 'About page content updated successfully' })
}

