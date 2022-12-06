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

module.exports = {
  memoize
}