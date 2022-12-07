const getFlight = require("./getFlights")
const axios = require("axios")

describe("getFlights", () => {
  const inputEvent = () => ({
    queryStringParameters: {
      origins: ["NYCA", "LGW", "MAD"],
      destination: "OPO",
      departureDate: "2023-05-15",
      returnDate: "2023-05-19",
    }
  })

  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it("returns data on success", async () => {
    jest.spyOn(axios, "request")
      .mockResolvedValueOnce({ 
        data: {
          "origin": "NYCA",
          "price": 427,
          "duration": 642,
          "stops": 1
        }})
      .mockResolvedValueOnce({
        data: {
          "origin": "LGW",
          "price": 83,
          "duration": 143,
          "stops": 0
        }})
      .mockResolvedValueOnce({
        data: {
          "origin": "MAD",
          "price": 68,
          "duration": 76,
          "stops": 0
        }})
  
    expect(await getFlight.handler(inputEvent())).toEqual({
      statusCode: 200,
      body: JSON.stringify({
        avgs: [
          {"origin": "NYCA", "price": 427, "duration": 642, "stops": 1},
          {"origin": "LGW", "price": 83, "duration": 143, "stops": 0},
          {"origin": "MAD", "price": 68, "duration": 76, "stops": 0},
        ],
        totalPrice: 578
      })})
  })

  it("with multiple duplicate and distinct origins returns flight averages and total", async () => {
    const inputEv = inputEvent()
    inputEv.queryStringParameters.origins = ["NYCA", "NYCA", "LGW", "MAD"]

    jest.spyOn(axios, "request")
      .mockResolvedValueOnce({ 
        data: {
          "origin": "NYCA",
          "price": 427,
          "duration": 642,
          "stops": 1
        }})
      .mockResolvedValueOnce({
        data: {
          "origin": "LGW",
          "price": 83,
          "duration": 143,
          "stops": 0
        }})
      .mockResolvedValueOnce({
        data: {
          "origin": "MAD",
          "price": 68,
          "duration": 76,
          "stops": 0
        }})

    expect(await getFlight.handler(inputEv)).toEqual({
      statusCode: 200,
      body: JSON.stringify({
        avgs: [
          {"origin": "NYCA", "price": 427, "duration": 642, "stops": 1},
          {"origin": "NYCA", "price": 427, "duration": 642, "stops": 1},
          {"origin": "LGW", "price": 83, "duration": 143, "stops": 0},
          {"origin": "MAD", "price": 68, "duration": 76, "stops": 0},
        ],
        totalPrice: 1005
      })})
  })

  it("with multiple duplicate origins returns flight averages and total without calling API for same origin multiple times", async () => {
    const inputEv = inputEvent()
    inputEv.queryStringParameters.origins = ["NYCA", "NYCA"]
  
    const spy = jest.spyOn(axios, "request")
      .mockResolvedValueOnce({ 
        data: {
          "origin": "NYCA",
          "price": 427,
          "duration": 642,
          "stops": 1
        }})

    await getFlight.handler(inputEv)
    expect(spy).toHaveBeenCalledTimes(1)
  })

  describe("errors", () => {
    it("returns no origins error with no query params", async () => {
      const inputEv = inputEvent()
      delete inputEv.queryStringParameters
  
      expect(await getFlight.handler(inputEv)).toEqual({
        statusCode: 400,
        body: "No origins given."
      })
    })
  
    it("returns no origins error with no origin", async () => {
      const inputEv = inputEvent()
      delete inputEv.queryStringParameters.origins
  
      expect(await getFlight.handler(inputEv)).toEqual({
        statusCode: 400,
        body: "No origins given."
      })
    })

    it("returns no destination error with no destination", async () => {
      const inputEv = inputEvent()
      delete inputEv.queryStringParameters.destination
  
      expect(await getFlight.handler(inputEv)).toEqual({
        statusCode: 400,
        body: "No destination given."
      })
    })

    it("returns no departure date error with no departure date", async () => {
      const inputEv = inputEvent()
      delete inputEv.queryStringParameters.departureDate
  
      expect(await getFlight.handler(inputEv)).toEqual({
        statusCode: 400,
        body: "No departure date given."
      })
    })

    it("returns no return date error with no return date", async () => {
      const inputEv = inputEvent()
      delete inputEv.queryStringParameters.returnDate
  
      expect(await getFlight.handler(inputEv)).toEqual({
        statusCode: 400,
        body: "No return date given."
      })
    })
  })
})