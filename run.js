const { getFlight: getFlightCall, getFlightEstimations: getFlightEstimationsCall } = require("./script")

const getFlight = () => {
  const args = process.argv.slice(2);
  args.shift()

  getFlightCall(...args)
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