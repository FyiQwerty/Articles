import { NextResponse } from 'next/server'

// In a real application, you would store this data in a database
let footerData = {
  companyName: "NextGen News",
  companyDescription: "Your source for high-quality news and current affairs.",
  categories: ['World', 'India', 'Business', 'Technology', 'Science'],
  quickLinks: [
    { title: "About Us", url: "/about" },
    { title: "Contact", url: "/contact" },
    { title: "Privacy Policy", url: "/privacy" },
    { title: "Terms of Service", url: "/terms" },
  ],
  copyrightText: "All rights reserved.",
  copyrightYear: new Date().getFullYear()
}

export async function GET() {
  return NextResponse.json(footerData)
}

export async function POST(request: Request) {
  const data = await request.json()
  footerData = data
  return NextResponse.json({ message: 'Footer content updated successfully' })
}

