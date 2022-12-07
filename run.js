const { getFlightEstimations: getFlightEstimationsCall } = require("./script")
const getFlightCall = require("./lambda/getFlight")

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

const getFlightEstimations = () => {
  const args = process.argv.slice(2);
  args.shift()

  const origins = args[0].replace("[", "").replace("]", "").split(",")
  args.shift()

  getFlightEstimationsCall(origins, ...args)
}

module.exports = {
  getFlight,
  getFlightEstimations
}

require("make-runnable")