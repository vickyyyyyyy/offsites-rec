import React from 'react';
import ReactTooltip from "react-tooltip";
import WorldMap from "./WorldMap";
import "./map.css";

export default function App() {
  const [content, setContent] = React.useState("");
  return (
    <div>
      <WorldMap setTooltipContent={setContent} />
      <ReactTooltip>{content}</ReactTooltip>
    </div>
  );
}
