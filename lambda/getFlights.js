const axios = require("axios")

const badError = (missing) => ({
    statusCode: 400,
    body: `No ${missing} given.`
})

const memoize = (func) => {
  const cache = {}

  return (...args) => {
    const params = JSON.stringify(args)

    if (!cache[params]) {
      cache[params] = func(...args)
    }

    return cache[params]
  }
}

const getFlight = async (origin, destination, departureDate, returnDate, lambdaFn) => {
    // for local
    if (lambdaFn) {
      return JSON.parse((await lambdaFn({
        queryStringParameters: {
          origin,
          destination,
          departureDate,
          returnDate
        }
      })).body)
    }

    const options = {
        method: "GET",
        url: process.env.FLIGHT_URL,
        params: {
            origin,
            destination,
            departureDate,
            returnDate
        }
    }
    
    try {
        const response = await axios.request(options)
        return response.data
    } catch (error) {
        console.log(error)
    }
}

exports.handler = async (event) => {
    const { origins } = event?.multiValueQueryStringParameters || {}
    const { destination, departureDate, returnDate } = event?.queryStringParameters || {}
    if (!origins) return badError("origins")
    if (!destination) return badError("destination")
    if (!departureDate) return badError("departure date")
    if (!returnDate) return badError("return date")
    
    const memoizedGetFlight = memoize(getFlight);
    
    const avgs = await Promise.all(origins.map((o) => memoizedGetFlight(o, destination, departureDate, returnDate, event?.lambdaFn)))
    
    const totalPrice = avgs.map(f => f.price).reduce((a,b) => a+b, 0)
    
    return {
        statusCode: 200,
        body: JSON.stringify({
            destination,
            avgs,
            totalPrice
        })
    }
}