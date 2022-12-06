const NYCAToOPOFlights = require("./__fixtures__/NYCATOOPO.fixture.json")
const LGWToOPOFlights = require("./__fixtures__/LGWTOOPO.fixture.json")
const MADToOPOFlights = require("./__fixtures__/MADTOOPO.fixture.json")
const { getFlight, getFlightEstimations } = require("./script")
const axios = require('axios');

describe("offsites-rec", () => {
  describe("getFlight", () => {
    it("with no origin or destination returns no origin error", async () => {
      await expect(getFlight()).rejects.toThrow("no origin given")
    })
  
    it("with origin but not destination returns no destination error", async () => {
      await expect(getFlight("NYCA")).rejects.toThrow("no destination given")
    })
  
    it("with origin and destination returns flight averages", async () => {
      jest.spyOn(axios, 'request').mockResolvedValue({ data: NYCAToOPOFlights })
    
      const results = await getFlight("NYCA", "OPO")
      expect(results).toEqual({
        'origin': 'NYCA',
        'durations': 642,
        'price': 427,
        'stops': 1
      })
    })
  })

  describe("getFlightEstimations", () => {
    it("with no origins or destination returns no origin error", async () => {
      await expect(getFlightEstimations()).rejects.toThrow("no origins given")
    })
  
    it("with origin but not destination returns no destination error", async () => {
      await expect(getFlightEstimations(["NYCA"])).rejects.toThrow("no destination given")
    })

    it("with origin and destination returns flight averages", async () => {
      jest.spyOn(axios, 'request')
        .mockResolvedValueOnce({ data: NYCAToOPOFlights })
        .mockResolvedValueOnce({ data: LGWToOPOFlights })
        .mockResolvedValueOnce({ data: MADToOPOFlights })
    
      const results = await getFlightEstimations(["NYCA", "LGW", "MAD"], "OPO")
      expect(results).toEqual({
        avgs: [
          {'origin': 'NYCA', 'durations': 642, 'price': 427, 'stops': 1},
          {'origin': 'LGW', 'durations': 143, 'price': 83, 'stops': 0},
          {'origin': 'MAD', 'durations': 76, 'price': 68, 'stops': 0},
        ],
        totalPrice: 578
      })
    })
  })
})