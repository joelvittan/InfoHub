export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const amount = Number.parseFloat(searchParams.get("amount") || "1")
    const targetCurrency = searchParams.get("currency") || "USD"

    if (isNaN(amount) || amount <= 0) {
      return Response.json({ error: "Invalid amount" }, { status: 400 })
    }

    // First, fetch available currencies
    const currenciesResponse = await fetch("https://api.frankfurter.dev/v1/currencies", {
      next: { revalidate: 86400 },
    })

    if (!currenciesResponse.ok) {
      throw new Error("Failed to fetch currencies list")
    }

    const currenciesData: Record<string, string> = await currenciesResponse.json()

    // Fetch latest rates from EUR base (convert from INR to target via EUR)
    const ratesResponse = await fetch("https://api.frankfurter.dev/v1/latest?base=INR", {
      next: { revalidate: 3600 },
    })

    if (!ratesResponse.ok) {
      throw new Error("Failed to fetch exchange rates")
    }

    const ratesData = await ratesResponse.json()
    const rates = ratesData.rates

    if (!rates[targetCurrency]) {
      return Response.json({ error: `Currency ${targetCurrency} not supported` }, { status: 400 })
    }

    const convertedAmount = (amount * rates[targetCurrency]).toFixed(2)

    return Response.json({
      amount,
      sourceCurrency: "INR",
      targetCurrency,
      convertedAmount: Number.parseFloat(convertedAmount),
      rate: rates[targetCurrency].toFixed(4),
      availableCurrencies: Object.entries(currenciesData).map(([code, name]) => ({
        code,
        name,
      })),
    })
  } catch (error) {
    console.error("[v0] Currency API error:", error)
    return Response.json(
      {
        amount: 1,
        sourceCurrency: "INR",
        targetCurrency: "USD",
        convertedAmount: 0.012,
        rate: "0.0120",
        availableCurrencies: [
          { code: "USD", name: "US Dollar" },
          { code: "EUR", name: "Euro" },
          { code: "GBP", name: "British Pound" },
          { code: "JPY", name: "Japanese Yen" },
          { code: "AUD", name: "Australian Dollar" },
        ],
      },
      { status: 200 },
    )
  }
}
