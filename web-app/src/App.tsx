import React from 'react';
import ReactTooltip from "react-tooltip";
import WorldMap from "./WorldMap";
import "./map.css";
import { Button, TextField } from '@mui/material';

export default function App() {
  const [content, setContent] = React.useState("");
  const [origins, setOrigins] = React.useState("")
  const [budget, setBudget] = React.useState(0)
  const [destination, setDestination] = React.useState("")

  const formatUrl = () => {
    const formattedOrigins = origins.split(",").map(origin => `&origins=${origin}`).join("")
    return `${process.env.REACT_APP_API_URL}?destination=OPO&departureDate=2023-05-15&returnDate=2023-05-19${formattedOrigins}`
  }

  const handleSearch = () => {
    console.log(formatUrl())
    alert(formatUrl())
  }

  return (
    <div>
       <TextField
          id="origin-airport-codes"
          label="Origin airport codes"
          multiline
          rows={6}
          defaultValue=""
          variant="filled"
          onChange={(e) => setOrigins(e.target.value as any)}
        />
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
