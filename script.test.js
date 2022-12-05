const flights = require("./__fixtures__/nonDirectFlights.fixture.json")
const { getFlight, getFlightEstimations } = require("./script")
const axios = require('axios');

describe("offsites-rec", () => {
  it("getFlight", async () => {
    jest.spyOn(axios, 'request').mockResolvedValue({ data: flights })
  
    const results = await getFlight()
    expect(results).toEqual({
      'origin': 'NYCA',
      'durations': 642,
      'price': 427,
      'stops': 1
    })
  })

  it("getFlightEstimations", async () => {
    jest.spyOn(axios, 'request').mockResolvedValue({ data: flights })
  
    const results = await getFlightEstimations()
    expect(results).toEqual({
      avgs: [
        {'origin': 'NYCA', 'durations': 642, 'price': 427, 'stops': 1},
        {'origin': 'LGW', 'durations': 642, 'price': 427, 'stops': 1},
        {'origin': 'MAD', 'durations': 642, 'price': 427, 'stops': 1},
      ],
      totalPrice: 1281
    })
  })
})