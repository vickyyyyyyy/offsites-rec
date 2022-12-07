require("dotenv").config()
const getFlightCall = require("./lambda/getFlight")
const getFlightsCall = require("./lambda/getFlights")

const getFlight = async () => {
  const args = process.argv.slice(2);
  args.shift()

  return await getFlightCall.handler({
    queryStringParameters: {
      origin: args[0],
      destination: args[1],
      departureDate: args[2],
      returnDate: args[3]
    }
  })
}

const getFlights = async () => {
  const args = process.argv.slice(2);
  args.shift()

  const origins = args[0].replace("[", "").replace("]", "").split(",")
  args.shift()

  return await getFlightsCall.handler({
    queryStringParameters: {
      origins,
      destination: args[0],
      departureDate: args[1],
      returnDate: args[2]
    },
    // for local
    lambdaFn: getFlightCall.handler
  })
}

module.exports = {
  getFlight,
  getFlights
}

require("make-runnable")