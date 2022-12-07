const NYCAToOPOFlights = require("../__fixtures__/NYCATOOPO.fixture.json")
const getFlight = require("./getFlight")
const axios = require("axios")

describe("getFlight", () => {
  const inputEvent = () => ({
    origin: "NYCA",
    destination: "OPO",
    departureDate: "2023-05-15",
    returnDate: "2023-05-19",
  })

  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it("returns data on success", async () => {
    jest.spyOn(axios, "request").mockResolvedValue({ data: NYCAToOPOFlights })
  
    expect(await getFlight.handler(inputEvent())).toEqual({
      statusCode: 200,
      body: {
        "origin": "NYCA",
        "duration": 642,
        "price": 427,
        "stops": 1
      }})
  })

  describe("errors", () => {
    it("returns no origin error with no origin", async () => {
      const inputEv = inputEvent()
      delete inputEv.origin
  
      expect(await getFlight.handler(inputEv)).toEqual({
        statusCode: 400,
        body: "No origin given."
      })
    })

    it("returns no destination error with no destination", async () => {
      const inputEv = inputEvent()
      delete inputEv.destination
  
      expect(await getFlight.handler(inputEv)).toEqual({
        statusCode: 400,
        body: "No destination given."
      })
    })

    it("returns no departure date error with no departure date", async () => {
      const inputEv = inputEvent()
      delete inputEv.departureDate
  
      expect(await getFlight.handler(inputEv)).toEqual({
        statusCode: 400,
        body: "No departure date given."
      })
    })

    it("returns no return date error with no return date", async () => {
      const inputEv = inputEvent()
      delete inputEv.returnDate
  
      expect(await getFlight.handler(inputEv)).toEqual({
        statusCode: 400,
        body: "No return date given."
      })
    })

    it("returns error with axios response", async () => {
      const axiosError = 
      jest.spyOn(axios, "request").mockRejectedValue({ 
        response: {
          status: 400,
          data: {
            message: "Some error."
          }
        },
       })
  
      expect(await getFlight.handler(inputEvent())).toEqual({
        statusCode: 400,
        body: "Some error."
      })
    })

    it("returns error with no axios response", async () => {
      jest.spyOn(axios, "request").mockRejectedValue({ message: "Some other error."})
  
      expect(await getFlight.handler(inputEvent())).toEqual({
        statusCode: 400,
        body: "Some other error."
      })
    })
  })
})