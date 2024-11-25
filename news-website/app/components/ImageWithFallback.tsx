import { useState } from 'react'
import Image from 'next/image'

interface ImageWithFallbackProps {
  src: string
  alt: string
  width: number
  height: number
  category: string
}

export default function ImageWithFallback({ src, alt, width, height, category }: ImageWithFallbackProps) {
  const [error, setError] = useState(false)

  return (
    <div className="relative w-full h-full">
      {error ? (
        <div className="absolute inset-0 bg-black flex items-center justify-center text-white text-lg font-bold">
          {category}
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          layout="fill"
          objectFit="cover"
          onError={() => setError(true)}
        />
      )}
    </div>
  )
}

