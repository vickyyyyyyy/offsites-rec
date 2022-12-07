const axios = require("axios")

const badError = (missing) => ({
    statusCode: 400,
    body: `No ${missing} given.`
})

exports.handler = async (event) => {
    const { origin, destination, departureDate, returnDate } = event?.queryStringParameters || {}
    if (!origin) return badError("origin")
    if (!destination) return badError("destination")
    if (!departureDate) return badError("departure date")
    if (!returnDate) return badError("return date")
    
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
    }
    
    try {
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
            duration: Math.round(best.map(b => b.durations).map(d => d.reduce((a,b) => a+b, 0)).reduce((a,b) => a+b, 0) / best.length / 2),
            stops: Math.round((best.map(b => b.stops).map(d => d.reduce((a,b) => a+b, 0)).reduce((a,b) => a+b, 0) / best.length / 2) * 10) / 10,
        }
        
        return {
          statusCode: 200,
          body: JSON.stringify(avg)
        }
    } catch (error) {
        if (error.response) {
          return {
              statusCode: error.response.status,
              body: error.response.data.message
          }
        }
        
        return {
            statusCode: 400,
            body: error.message
        }
    }
}