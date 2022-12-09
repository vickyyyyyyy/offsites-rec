import React, { memo } from "react";
import {
  ZoomableGroup,
  ComposableMap,
  Geographies,
  Geography,
  Marker
} from "react-simple-maps";
import airports from "./airports.json"

const MapChart = ({ flights, setTooltipContent }: any) => {
  const markers = flights.map((f: any) => {
    const airport = airports.find(a => a.iata === f.destination)
    return {
      markerOffset: -10,
      name: airport?.name,
      city: airport?.city,
      coordinates: [airport?.longitude, airport?.latitude],
      cost: f.totalPrice
    }
  })

  return (
    <div data-tip="">
      <ComposableMap>
        <ZoomableGroup>
          <Geographies geography="/features.json">
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => {
                    setTooltipContent(`${geo.properties.name}`);
                  }}
                  onMouseLeave={() => {
                    setTooltipContent("");
                  }}
                  style={{
                    default: {
                      fill: "#D6D6DA",
                      outline: "none"
                    },
                    hover: {
                      fill: "#F53",
                      outline: "none"
                    },
                    pressed: {
                      fill: "#E42",
                      outline: "none"
                    }
                  }}
                />
              ))
            }
          </Geographies>
          {markers.map(({ name, coordinates, markerOffset, city, cost }: any) => (
            <Marker
              key={name}
              coordinates={coordinates as any}
              onMouseEnter={() => setTooltipContent("Total cost: " + cost)}
              onMouseLeave={() => setTooltipContent("")}
            >
              <circle r={5} fill="#F00" stroke="#fff" strokeWidth={1} />
              <text
                textAnchor="middle"
                y={markerOffset}
                style={{ fontSize: 10, fontFamily: "system-ui", fill: "#5D5A6D" }}
              >
                {city}
              </text>
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
};

export default memo(MapChart);