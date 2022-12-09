import React from "react";
import ReactTooltip from "react-tooltip";
import WorldMap from "./WorldMap";
import "./map.css";
import { Button, TextField } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";
import airports from "./airports.json"
import axios from "axios"

const defaultDestinations = "JFK,BCN,LIS"

// TODO: replace with API call instead of hardcoded responses for testing
const testResponse = [
  {
    destination: "OPO",
    avgs: [
      {"origin": "NYCA", "price": 427, "duration": 642, "stops": 1},
      {"origin": "LGW", "price": 83, "duration": 143, "stops": 0},
      {"origin": "MAD", "price": 68, "duration": 76, "stops": 0},
    ],
    totalPrice: 578
  },
  {
    destination: "NRT",
    avgs: [
      {"origin": "NYCA", "price": 427, "duration": 642, "stops": 1},
      {"origin": "LGW", "price": 83, "duration": 143, "stops": 0},
      {"origin": "MAD", "price": 68, "duration": 76, "stops": 0},
    ],
    totalPrice: 5000
  },
  {
    destination: "JFK",
    avgs: [
      {"origin": "NYCA", "price": 427, "duration": 642, "stops": 1},
      {"origin": "LGW", "price": 83, "duration": 143, "stops": 0},
      {"origin": "MAD", "price": 68, "duration": 76, "stops": 0},
    ],
    totalPrice: 2000
  }
]

export default function App() {
  const [content, setContent] = React.useState("");
  const [origins, setOrigins] = React.useState("")
  const [budget, setBudget] = React.useState(0)
  const [departureDate, setDepartureDate] = React.useState<any>(dayjs().add(3, "M"))
  const [returnDate, setReturnDate] = React.useState<any>(dayjs(dayjs().add(3, "M")).add(1, "w"))
  const [destinations, setDestinations] = React.useState(defaultDestinations)
  const [flights, setFlights] = React.useState<any>([])

  const handleSearch = async () => {
    destinations.split(",").forEach(async (destination: string) => {
      const params = new URLSearchParams({
        destination,
        departureDate: dayjs(departureDate).format("YYYY-MM-DD"),
        returnDate: dayjs(returnDate).format("YYYY-MM-DD"),
      })

      origins.split(",").forEach((o: any) => {
        params.append("origins", o);
      })
  
      const options = {
        method: "GET",
        url: process.env.REACT_APP_API_URL,
        params
      }

      const response = await axios.request(options)
      // filter on any same destinations
      setFlights((f: any) => f.some((fl: any) => fl.destination === response.data.destination) ? f : [...f, response.data])
    })
  }

  return (
    <div>
      <TextField
        id="origin-airport-codes"
        label="Origin airport codes"
        multiline
        rows={6}
        value={origins}
        variant="filled"
        onChange={(e) => setOrigins(e.target.value as any)}
      />
      <TextField
        id="destination-airport-codes"
        label="Destination airport codes"
        multiline
        rows={6}
        value={destinations}
        variant="filled"
        onChange={(e) => setDestinations(e.target.value as any)}
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DesktopDatePicker
          label="Departure date"
          inputFormat="YYYY-MM-DD"
          value={departureDate}
          onChange={setDepartureDate}
          renderInput={(params) => <TextField {...params} />}
        />
        <DesktopDatePicker
          label="Return date"
          inputFormat="YYYY-MM-DD"
          value={returnDate}
          onChange={setReturnDate}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
      <TextField
        id="budget"
        label="Budget"
        variant="filled"
        error={false}
        helperText={""}
        type="number"
        onChange={(e) => setBudget(+e.target.value)}
      />
      <Button variant="contained" onClick={handleSearch}>Search</Button>
      <WorldMap
        budget={budget}
        destinations={destinations}
        setDestinations={setDestinations}
        flights={flights}
        setTooltipContent={setContent}
      />
      <ReactTooltip>{content}</ReactTooltip>
    </div>
  );
}
