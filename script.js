require("dotenv").config()
const axios = require("axios");
const { memoize } = require("./util")

const getFlight = async (origin, destination, departureDate, returnDate) => {
  if (!origin) throw new Error("no origin given")
  if (!destination) throw new Error("no destination given")
  if (!departureDate) throw new Error("no departure date given")
  if (!returnDate) throw new Error("no return date given")

  const options = {
    method: "GET",
    url: "https://skyscanner44.p.rapidapi.com/search",
    params: {
      adults: "1",
      origin,
      destination,
      departureDate,
      returnDate,
      currency: "USD"
    },
    headers: {
      "X-RapidAPI-Key": process.env.API_KEY,
      "X-RapidAPI-Host": "skyscanner44.p.rapidapi.com"
    }
  };

  const response = await axios.request(options)

  const buckets = response.data.itineraries.buckets
  const best = buckets.find(e => e.id === "Best").items.map(e => ({
    price: e.price.raw,
    durations: e.legs.map(l => l.durationInMinutes),
    stops: e.legs.map(l => l.stopCount)
  }))

  const avg = {
    origin,
    price: Math.ceil(best.map(b => b.price).reduce((a,b) => a+b, 0) / best.length),
    durations: Math.round(best.map(b => b.durations).map(d => d.reduce((a,b) => a+b, 0)).reduce((a,b) => a+b, 0) / best.length / 2),
    stops: best.map(b => b.stops).map(d => d.reduce((a,b) => a+b, 0)).reduce((a,b) => a+b, 0) / best.length / 2,
  }

  return avg
}

const getFlightEstimations = async (origins, destination, departureDate, returnDate) => {
  if (!origins) throw new Error("no origins given")
  if (!destination) throw new Error("no destination given")
  if (!departureDate) throw new Error("no departure date given")
  if (!returnDate) throw new Error("no return date given")

  const memoizedGetFlight = memoize(getFlight);

  const avgs = await Promise.all(origins.map((o) => memoizedGetFlight(o, destination, departureDate, returnDate)))

  const totalPrice = avgs.map(f => f.price).reduce((a,b) => a+b, 0)

  return {
    avgs,
    totalPrice
  }
}

module.exports = {
  getFlight,
  getFlightEstimations
}

require("make-runnable")