"use client"

import { useState, useEffect } from "react"

interface ForecastDay {
  date: string
  maxTemp: number
  minTemp: number
  condition: string
  precipitation: number
  precipitationProbability: number
}

interface WeatherData {
  temperature: number
  apparentTemperature: number
  condition: string
  humidity: number
  windSpeed: string
  location: string
  sunrise: string
  sunset: string
  daylightDuration: string
  forecast: ForecastDay[]
}

export default function WeatherModule() {
  const [data, setData] = useState<WeatherData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedCity, setSelectedCity] = useState("London")
  const [selectedDays, setSelectedDays] = useState(5)

  useEffect(() => {
    const fetchWeather = async () => {
      setIsLoading(true)
      setError("")
      try {
        const response = await fetch(`/api/weather?city=${encodeURIComponent(selectedCity)}&days=${selectedDays}`)
        if (!response.ok) throw new Error("Failed to fetch weather")
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching weather data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchWeather()
  }, [selectedCity, selectedDays])

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

  if (!data) return null

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00")
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
  }

  const getWeatherEmoji = (condition: string) => {
    const conditionLower = condition.toLowerCase()
    if (conditionLower.includes("clear") || conditionLower.includes("mainly")) return "☀️"
    if (conditionLower.includes("cloud")) return "☁️"
    if (conditionLower.includes("rain")) return "🌧️"
    if (conditionLower.includes("snow")) return "❄️"
    if (conditionLower.includes("thunder")) return "⛈️"
    if (conditionLower.includes("fog")) return "🌫️"
    return "🌤️"
  }

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
      <div className="grid grid-cols-2 gap-4 mb-6 animate-in slide-in-from-top duration-500">
        <div>
          <label className="block text-sm font-semibold text-white/90 mb-2 drop-shadow-md">City</label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300 font-medium"
          >
            {[
              "London",
              "New York",
              "Tokyo",
              "Paris",
              "Sydney",
              "Dubai",
              "Singapore",
              "Mumbai",
              "Bangkok",
              "Toronto",
            ].map((city) => (
              <option key={city} value={city} className="bg-slate-900 text-white">
                {city}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-white/90 mb-2 drop-shadow-md">Days</label>
          <select
            value={selectedDays}
            onChange={(e) => setSelectedDays(Number.parseInt(e.target.value))}
            className="w-full px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300 font-medium"
          >
            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
              <option key={day} value={day} className="bg-slate-900 text-white">
                {day} Day{day > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold text-white drop-shadow-lg animate-in slide-in-from-top duration-500">
          {data.location}
        </h2>
        <div className="inline-block">
          <div className="text-7xl md:text-8xl font-black bg-gradient-to-br from-blue-200 via-blue-100 to-cyan-200 bg-clip-text text-transparent drop-shadow-lg animate-in zoom-in duration-700 animation-delay-200">
            {data.temperature}°
          </div>
        </div>
        <p className="text-xl text-white/90 capitalize drop-shadow-md font-semibold animate-in slide-in-from-bottom duration-500 animation-delay-300">
          {data.condition}
        </p>
        <p className="text-sm text-white/70">Feels like {data.apparentTemperature}°</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Humidity", value: `${data.humidity}%`, icon: "💧" },
          { label: "Wind Speed", value: `${data.windSpeed} m/s`, icon: "💨" },
          { label: "Sunrise", value: data.sunrise.split("T")[1]?.substring(0, 5) || "--:--", icon: "🌅" },
          { label: "Sunset", value: data.sunset.split("T")[1]?.substring(0, 5) || "--:--", icon: "🌅" },
        ].map((item, index) => (
          <div
            key={item.label}
            className="group bg-white/10 backdrop-blur-md p-5 rounded-xl border border-white/20 hover:border-white/40 hover:bg-white/15 transition-all duration-300 hover:shadow-lg hover:shadow-white/10 transform hover:-translate-y-1 cursor-default animate-in fade-in slide-in-from-bottom-2 duration-500"
            style={{ animationDelay: `${(index + 1) * 150}ms` }}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/70 text-sm font-medium">{item.label}</p>
              <span className="text-xl group-hover:scale-125 transition-transform duration-300">{item.icon}</span>
            </div>
            <p className="text-2xl font-bold text-white drop-shadow-md">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold text-white mb-4 animate-in slide-in-from-left duration-500">7-Day Forecast</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 overflow-x-auto pb-2">
          {data.forecast.map((day, index) => (
            <div
              key={day.date}
              className="flex-shrink-0 bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/20 hover:border-white/40 hover:bg-white/15 transition-all duration-300 hover:shadow-lg hover:shadow-white/10 transform hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-2 duration-500"
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
            >
              <p className="text-white/70 text-sm font-medium mb-2">{formatDate(day.date)}</p>
              <div className="text-2xl mb-2">{getWeatherEmoji(day.condition)}</div>
              <p className="text-white/80 text-xs mb-3 line-clamp-2 capitalize">{day.condition}</p>
              <div className="flex items-center justify-between mb-2">
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-white">{day.maxTemp}°</span>
                  <span className="text-sm text-white/60">{day.minTemp}°</span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/70">{day.precipitationProbability}%</p>
                  <p className="text-xs text-white/60">rain</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
