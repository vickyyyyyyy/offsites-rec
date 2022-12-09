import React from 'react';
import ReactTooltip from "react-tooltip";
import WorldMap from "./WorldMap";
import "./map.css";
import { Button, TextField } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";
import airports from "./airports.json"

const defaultDestinations = "AUS,JFK,BCN,LIS,LHR,NRT,BKK"


export default function App() {
  const [content, setContent] = React.useState("");
  const [origins, setOrigins] = React.useState("")
  const [budget, setBudget] = React.useState(0)
  const [departureDate, setDepartureDate] = React.useState<any>("")
  const [returnDate, setReturnDate] = React.useState<any>("")
  const [destinations, setDestinations] = React.useState(defaultDestinations)

  const formatUrl = (destination: string) => {
    const formattedOrigins = origins.split(",").map(origin => `&origins=${origin}`).join("")
    const formattedDeparture = dayjs(departureDate).format("YYYY-MM-DD")
    const formattedReturn = dayjs(returnDate).format("YYYY-MM-DD")

    return `${process.env.REACT_APP_API_URL}?destination=${destination}&departureDate=${formattedDeparture}&returnDate=${formattedReturn}${formattedOrigins}`
  }

  const handleSearch = () => {
    destinations.split(",").forEach(d => {
      console.log(airports.find(a => a.iata === d)?.country)
      console.log(formatUrl(d))
    })
  }

  return (
    <div>
      <TextField
        id="origin-airport-codes"
        label="Origin airport codes"
        multiline
        rows={6}
        defaultValue={origins}
        variant="filled"
        onChange={(e) => setOrigins(e.target.value as any)}
      />
      <TextField
        id="destination-airport-codes"
        label="Destination airport codes"
        multiline
        rows={6}
        defaultValue={destinations}
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
      <WorldMap setTooltipContent={setContent} />
      <ReactTooltip>{content}</ReactTooltip>
    </div>
  );
}
