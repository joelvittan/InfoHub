"use client"

import type React from "react"
import { useEffect, useState } from "react"

interface ConversionResult {
  amount: number
  sourceCurrency: string
  convertedAmount: number
  targetCurrency: string
  rate: number
}

interface CurrencyOption {
  code: string
  name: string
}

export default function CurrencyConverter() {
  const [amount, setAmount] = useState("100")
  const [result, setResult] = useState<ConversionResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [targetCurrency, setTargetCurrency] = useState("USD")
  const [availableCurrencies, setAvailableCurrencies] = useState<CurrencyOption[]>([])

  const handleConvert = async () => {
    if (!amount || Number.parseFloat(amount) <= 0) {
      setError("Please enter a valid amount")
      return
    }

    setIsLoading(true)
    setError("")
    try {
      const response = await fetch(`/api/currency?amount=${amount}&currency=${targetCurrency}`)
      if (!response.ok) throw new Error("Failed to convert currency")
      const data = await response.json()
      setResult(data)
      if (data.availableCurrencies) {
        setAvailableCurrencies(data.availableCurrencies)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error converting currency")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleConvert()
  }

  useEffect(() => {
    handleConvert()
  }, [targetCurrency])

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
      <div className="space-y-4 animate-in slide-in-from-top duration-500">
        <div>
          <label className="block text-sm font-semibold text-white/90 mb-3 drop-shadow-md">Amount in INR</label>
          <div className="flex gap-3">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter amount"
              className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300 font-medium"
            />
            <button
              onClick={handleConvert}
              disabled={isLoading}
              className="group px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-amber-500/30 transform hover:-translate-y-1 drop-shadow-md"
            >
              <span className="group-hover:scale-110 transition-transform duration-300 inline-block">
                {isLoading ? "Loading" : ""}
              </span>
              {isLoading ? "..." : "Convert"}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-white/90 mb-3 drop-shadow-md">Convert To</label>
          <select
            value={targetCurrency}
            onChange={(e) => setTargetCurrency(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300 font-medium"
          >
            {availableCurrencies.length > 0 ? (
              availableCurrencies.map((curr) => (
                <option key={curr.code} value={curr.code} className="bg-slate-900 text-white">
                  {curr.code} - {curr.name}
                </option>
              ))
            ) : (
              <option value="USD" className="bg-slate-900 text-white">
                USD - US Dollar
              </option>
            )}
          </select>
        </div>
      </div>

      {error && (
        <div className="p-5 rounded-xl bg-red-500/20 border border-red-400/50 text-red-200 animate-in shake duration-500 font-medium">
          <p>⚠️ {error}</p>
        </div>
      )}

      {result && (
        <div className="space-y-3 animate-in fade-in duration-500">
          <p className="text-white/70 text-sm font-semibold drop-shadow-md">Conversion Result:</p>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 hover:border-white/40 hover:bg-white/15 transition-all duration-300 hover:shadow-lg hover:shadow-white/10 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium mb-1">
                  {result.amount} {result.sourceCurrency}
                </p>
                <p className="text-4xl font-bold text-white drop-shadow-md">
                  {result.convertedAmount} {result.targetCurrency}
                </p>
              </div>
              <div className="text-right">
                <p className="text-white/60 text-xs mb-1">Exchange Rate</p>
                <p className="text-2xl font-bold text-amber-300">
                  1 INR = {result.rate} {result.targetCurrency}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
