const NYCAToOPOFlights = require("./__fixtures__/NYCATOOPO.fixture.json")
const LGWToOPOFlights = require("./__fixtures__/LGWTOOPO.fixture.json")
const MADToOPOFlights = require("./__fixtures__/MADTOOPO.fixture.json")
const { getFlight, getFlightEstimations } = require("./script")
const axios = require("axios");

describe("offsites-rec", () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  describe("getFlight", () => {
    it("with no origin returns no origin error", async () => {
      await expect(getFlight()).rejects.toThrow("no origin given")
    })
  
    it("with origin but no destination returns no destination error", async () => {
      await expect(getFlight("NYCA")).rejects.toThrow("no destination given")
    })

    it("with origin, destination, but no departure date returns no departure date error", async () => {
      await expect(getFlight("NYCA", "OPO")).rejects.toThrow("no departure date given")
    })
  
    it("with origin, destination, departure date but no return date returns no return date error", async () => {
      await expect(getFlight("NYCA", "OPO", "2023-05-15")).rejects.toThrow("no return date given")
    })
  
    it("with origin, destination, departure date and return date returns flight averages", async () => {
      jest.spyOn(axios, "request").mockResolvedValue({ data: NYCAToOPOFlights })
    
      const results = await getFlight("NYCA", "OPO", "2023-05-15", "2023-05-19")
      expect(results).toEqual({
        "origin": "NYCA",
        "durations": 642,
        "price": 427,
        "stops": 1
      })
    })
  })

  describe("getFlightEstimations", () => {
    it("with no origins returns no origin error", async () => {
      await expect(getFlightEstimations()).rejects.toThrow("no origins given")
    })
  
    it("with origin but no destination returns no destination error", async () => {
      await expect(getFlightEstimations(["NYCA"])).rejects.toThrow("no destination given")
    })
  
    it("with origin, destination but no departure date returns no departure date error", async () => {
      await expect(getFlightEstimations(["NYCA"], "OPO")).rejects.toThrow("no departure date given")
    })
  
    it("with origin, destination, departure date but no return date returns no return date error", async () => {
      await expect(getFlightEstimations(["NYCA"], "OPO", "2023-05-15")).rejects.toThrow("no return date given")
    })

    it("with origin, destination, departure date and return date returns flight averages and total", async () => {
      jest.spyOn(axios, "request")
        .mockResolvedValueOnce({ data: NYCAToOPOFlights })
        .mockResolvedValueOnce({ data: LGWToOPOFlights })
        .mockResolvedValueOnce({ data: MADToOPOFlights })
    
      const results = await getFlightEstimations(["NYCA", "LGW", "MAD"], "OPO", "2023-05-15", "2023-05-19")
      expect(results).toEqual({
        avgs: [
          {"origin": "NYCA", "durations": 642, "price": 427, "stops": 1},
          {"origin": "LGW", "durations": 143, "price": 83, "stops": 0},
          {"origin": "MAD", "durations": 76, "price": 68, "stops": 0},
        ],
        totalPrice: 578
      })
    })
  
    it("with multiple duplicate origins returns flight averages and total", async () => {
      jest.spyOn(axios, "request")
        .mockResolvedValueOnce({ data: NYCAToOPOFlights })
        .mockResolvedValueOnce({ data: LGWToOPOFlights })
        .mockResolvedValueOnce({ data: MADToOPOFlights })
    
      const results = await getFlightEstimations(["NYCA", "NYCA"], "OPO", "2023-05-15", "2023-05-19")
      expect(results).toEqual({
        avgs: [
          {"origin": "NYCA", "durations": 642, "price": 427, "stops": 1},
          {"origin": "NYCA", "durations": 642, "price": 427, "stops": 1},
        ],
        totalPrice: 854
      })
    })

    it("with multiple duplicate and distinct origins returns flight averages and total", async () => {
      jest.spyOn(axios, "request")
        .mockResolvedValueOnce({ data: NYCAToOPOFlights })
        .mockResolvedValueOnce({ data: LGWToOPOFlights })
        .mockResolvedValueOnce({ data: MADToOPOFlights })
    
      const results = await getFlightEstimations(["NYCA", "NYCA", "LGW", "MAD"], "OPO", "2023-05-15", "2023-05-19")
      expect(results).toEqual({
        avgs: [
          {"origin": "NYCA", "durations": 642, "price": 427, "stops": 1},
          {"origin": "NYCA", "durations": 642, "price": 427, "stops": 1},
          {"origin": "LGW", "durations": 143, "price": 83, "stops": 0},
          {"origin": "MAD", "durations": 76, "price": 68, "stops": 0},
        ],
        totalPrice: 1005
      })
    })

    it("with multiple duplicate origins returns flight averages and total without calling API for same origin multiple times", async () => {
      const spy = jest.spyOn(axios, "request").mockResolvedValue({ data: NYCAToOPOFlights })

      await getFlightEstimations(["NYCA", "NYCA"], "OPO", "2023-05-15", "2023-05-19")
      expect(spy).toHaveBeenCalledTimes(1)
    })
  })
})