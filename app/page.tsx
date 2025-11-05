"use client"

import { useState } from "react"
import WeatherModule from "@/components/weather-module"
import CurrencyConverter from "@/components/currency-converter"
import QuoteGenerator from "@/components/quote-generator"

type TabType = "weather" | "currency" | "quote"

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("weather")

  const tabs: { id: TabType; label: string; icon: string; bgGradient: string }[] = [
    { id: "weather", label: "Weather", icon: "🌤", bgGradient: "from-blue-600 via-purple-600 to-pink-600" },
    { id: "currency", label: "Currency", icon: "💱", bgGradient: "from-amber-600 via-orange-600 to-red-600" },
    { id: "quote", label: "Quotes", icon: "💭", bgGradient: "from-purple-600 via-pink-600 to-blue-600" },
  ]

  const backgroundGradient =
    tabs.find((tab) => tab.id === activeTab)?.bgGradient || "from-blue-600 via-purple-600 to-pink-600"

  return (
    <div className={`min-h-screen bg-gradient-to-br ${backgroundGradient} transition-all duration-1000 ease-out`}>
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
      </div>

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <main className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-3 tracking-tight drop-shadow-lg">InfoHub</h1>
            <p className="text-white/80 text-lg drop-shadow-md">Your daily utility companion</p>
          </div>

          <div className="flex gap-3 mb-10 justify-center flex-wrap animate-in fade-in slide-in-from-top-6 duration-700 animation-delay-100">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${activeTab === tab.id
                    ? "bg-white/20 text-white shadow-2xl shadow-white/20 backdrop-blur-md border border-white/30 scale-105"
                    : "bg-white/10 text-white/80 hover:bg-white/15 backdrop-blur-sm border border-white/10 hover:border-white/20"
                  }`}
                style={{
                  animation: `slideIn 0.5s ease-out ${index * 100}ms backwards`,
                }}
              >
                <span className="mr-2 text-xl group-hover:scale-125 transition-transform duration-300 inline-block">
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="animate-in fade-in duration-500 animation-delay-200">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 md:p-10 border border-white/20 hover:border-white/30 transition-all duration-300 hover:shadow-2xl hover:shadow-white/10">
              <div className="animate-in fade-in zoom-in duration-500">
                {activeTab === "weather" && <WeatherModule />}
                {activeTab === "currency" && <CurrencyConverter />}
                {activeTab === "quote" && <QuoteGenerator />}
              </div>
            </div>
          </div>

        </div>
      </main>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-100 {
          animation-delay: 100ms;
        }
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        .animation-delay-300 {
          animation-delay: 300ms;
        }
      `}</style>
    </div>
  )
}
