"use client"

import { useState, useEffect, useRef } from "react"
import WeatherModule from "@/components/weather-module"
import CurrencyConverter from "@/components/currency-converter"
import QuoteGenerator from "@/components/quote-generator"

type TabType = "weather" | "currency" | "quote"

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("weather")
  const sectionRefs = useRef<(HTMLElement | null)[]>([])

  const tabs: { id: TabType; label: string; bgGradient: string; description: string }[] = [
    {
      id: "weather",
      label: "Weather",
      bgGradient: "from-blue-600 via-indigo-600 to-purple-600",
      description: "Get the latest weather information from around the world.",
    },
    {
      id: "currency",
      label: "Currency Converter",
      bgGradient: "from-amber-500 via-orange-600 to-red-600",
      description: "Convert currencies in real-time instantly.",
    },
    {
      id: "quote",
      label: "Quotes",
      bgGradient: "from-fuchsia-600 via-pink-600 to-sky-600",
      description: "Get motivational quotes from famous people.",
    },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          console.log(entry)
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-id") as TabType
            if (id) setActiveTab(id)
          }
        })
      },
      { threshold: 0.6 }
    )

    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section)
    })

    return () => {
      sectionRefs.current.forEach((section) => {
        if (section) observer.unobserve(section)
      })
    }
  }, [])

  const scrollToSection = (index: number) => {
    const section = sectionRefs.current[index]
    if (section) section.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="relative snap-y snap-mandatory h-screen overflow-y-scroll scroll-smooth">
      <nav className="fixed top-3 left-1/2 -translate-x-1/2 z-50 flex gap-2 md:gap-4 lg:gap-6 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full px-3 py-2 md:px-6 shadow-lg overflow-x-auto whitespace-nowrap max-w-[90vw] md:max-w-none">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => scrollToSection(index)}
            className={`px-3 py-1.5 md:px-4 md:py-1.5 rounded-full font-semibold text-xs sm:text-sm md:text-base transition-all duration-300 
              ${activeTab === tab.id
                ? "bg-white text-gray-800 shadow-lg scale-105"
                : "text-white/80 hover:text-white hover:bg-white/20"}`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Sections */}
      {tabs.map((tab, index) => (
        <section
          key={tab.id}
          ref={(el) => (sectionRefs.current[index] = el)}
          data-id={tab.id}
          className={`snap-start min-h-screen flex flex-col justify-center items-center bg-gradient-to-br ${tab.bgGradient} transition-all duration-700 px-4 sm:px-6 md:px-10`}
        >
          <main className="relative flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-10 py-12 md:py-20 w-full">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white mb-3 tracking-tight drop-shadow-lg">
              {tab.label}
            </h1>
            <p className="text-white/80 mb-8 sm:mb-10 text-sm sm:text-base md:text-lg max-w-md sm:max-w-lg md:max-w-xl leading-relaxed">
              {tab.description}
            </p>

            <div className="bg-white/15 backdrop-blur-2xl rounded-2xl shadow-2xl p-4 sm:p-6 md:p-10 border border-white/20 w-full max-w-sm sm:max-w-md md:max-w-xl hover:border-white/40 transition-all duration-300">
              {tab.id === "weather" && <WeatherModule />}
              {tab.id === "currency" && <CurrencyConverter />}
              {tab.id === "quote" && <QuoteGenerator />}
            </div>

            {/* Scroll Hint */}
            {index < tabs.length - 1 && (
              <div className="absolute bottom-6 sm:bottom-10 animate-bounce text-white/80 text-xs sm:text-sm">
                Scroll down to explore more
              </div>
            )}
          </main>
        </section>
      ))}
    </div>
  )
}