"use client"

import { useState, useEffect } from "react"

interface Quote {
  text: string
  author: string
}

export default function QuoteGenerator() {
  const [quote, setQuote] = useState<Quote | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isFlipping, setIsFlipping] = useState(false)

  const fetchQuote = async () => {
    setIsFlipping(true)
    setIsLoading(true)
    setError("")
    try {
      const response = await fetch("/api/quote")
      if (!response.ok) throw new Error("Failed to fetch quote")
      const data = await response.json()
      setQuote(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching quote")
    } finally {
      setIsLoading(false)
      setTimeout(() => setIsFlipping(false), 600)
    }
  }

  useEffect(() => {
    fetchQuote()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-white border-r-white animate-spin"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 rounded-xl bg-red-500/20 border border-red-400/50 text-red-200 animate-in shake duration-500">
        <p className="font-semibold">⚠️ Error: {error}</p>
      </div>
    )
  }

  if (!quote) return null

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
      <div
        className={`text-center space-y-5 transition-all duration-600 transform ${isFlipping ? "scale-95 opacity-50" : "scale-100 opacity-100"}`}
      >
        <div className="text-5xl animate-in zoom-in duration-500">✨</div>
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20 hover:border-white/30 transition-all duration-300 hover:shadow-lg hover:shadow-white/10">
          <blockquote className="text-2xl md:text-3xl font-bold text-white italic leading-relaxed drop-shadow-lg animate-in slide-in-from-top duration-500">
            "{quote.text}"
          </blockquote>
        </div>
        <p className="text-lg text-white/80 font-semibold drop-shadow-md animate-in slide-in-from-bottom duration-500 animation-delay-200">
          — {quote.author}
        </p>
      </div>

      <button
        onClick={fetchQuote}
        disabled={isFlipping}
        className="group w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/30 transform hover:-translate-y-1 drop-shadow-md animate-in fade-in slide-in-from-bottom duration-500 animation-delay-300"
      >
        <span className="group-hover:scale-110 transition-transform duration-300 inline-block mr-2">
          {isFlipping ? "🔄" : "✨"}
        </span>
        {isFlipping ? "Loading..." : "Get Another Quote"}
      </button>
    </div>
  )
}
