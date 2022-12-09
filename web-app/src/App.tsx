import React from "react";
import ReactTooltip from "react-tooltip";
import WorldMap from "./WorldMap";
import "./map.css";
import { Box, Button, Grid, TextField } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";
import airports from "./airports.json"
import axios from "axios"
import { BarLoader } from "react-spinners"

const defaultDestinations = "AUS,JFK,NRT"
const defaultOrigins = "SFO,LGW"

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
  const [loading, setLoading] = React.useState(false)
  const [content, setContent] = React.useState("")
  const [origins, setOrigins] = React.useState(defaultOrigins)
  const [budget, setBudget] = React.useState(0)
  const [departureDate, setDepartureDate] = React.useState<any>(dayjs().add(3, "M"))
  const [returnDate, setReturnDate] = React.useState<any>(dayjs(dayjs().add(3, "M")).add(1, "w"))
  const [destinations, setDestinations] = React.useState(defaultDestinations)
  const [flights, setFlights] = React.useState<any>([])

  const handleSearch = async () => {
    const allDestinations = destinations.split(",")
    setLoading(true)
    allDestinations.forEach(async (destination: string) => {
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

      try {
        const response = await axios.request(options)

        // if this is the last request, wait for it
        if (destination === allDestinations[allDestinations.length-1]) {
          setLoading(false)
        }

        // filter on any same destinations
        setFlights((f: any) => f.some((fl: any) => fl.destination === response.data.destination) ? f : [...f, response.data])
      } catch (error) {
        setLoading(false)
      }
    })
  }

  return (
    <Grid container xs={12}>
      <Grid item xs={2}>
        <Box m={2}>
          <TextField
            id="origin-airport-codes"
            label="Origin airport codes"
            multiline
            rows={6}
            value={origins}
            variant="filled"
            onChange={(e) => setOrigins(e.target.value as any)}
          />
        </Box>
        <Box m={2}>
          <TextField
            id="destination-airport-codes"
            label="Destination airport codes"
            multiline
            rows={6}
            value={destinations}
            variant="filled"
            onChange={(e) => setDestinations(e.target.value as any)}
          />
        </Box>
      </Grid>
      <Grid item xs={12} sm container>
        <Grid item xs={12} pt={2} container spacing={2} justifyContent="center">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid item>
            <DesktopDatePicker
              label="Departure date"
              inputFormat="YYYY-MM-DD"
              value={departureDate}
              onChange={setDepartureDate}
              renderInput={(params) => <TextField {...params} />}
            />
            </Grid>
            <Grid item>
              <DesktopDatePicker
                label="Return date"
                inputFormat="YYYY-MM-DD"
                value={returnDate}
                onChange={setReturnDate}
                renderInput={(params) => <TextField {...params} />}
              />
            </Grid>
          </LocalizationProvider>
          <Grid item>
            <TextField
              id="budget"
              label="Budget"
              variant="filled"
              error={false}
              helperText={""}
              type="number"
              onChange={(e) => setBudget(+e.target.value)}
            />
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={handleSearch}>
              <div>
                Search<br></br>
                <BarLoader loading={loading} color="#36d7b7" />
              </div>
            </Button>
          </Grid>
        </Grid>        
        <Grid item xs={10}>
          <WorldMap
            budget={budget}
            destinations={destinations}
            setDestinations={setDestinations}
            flights={flights}
            setTooltipContent={setContent}
          />
        </Grid>
      </Grid>
    <ReactTooltip>{content}</ReactTooltip>
    </Grid>
  );
}
