import React, { memo } from "react";
import {
  ZoomableGroup,
  ComposableMap,
  Geographies,
  Geography,
  Marker
} from "react-simple-maps";
import airports from "./airports.json"

const MapChart = ({ 
    budget,
    destinations,
    setDestinations,
    flights,
    setTooltipContent
  }: any) => {
  const budgetColors = {
    in: "#16b302",
    close: "#ffb300",
    out: "#F00"
  }
  const [markers, setMarkers] = React.useState<any>([])

  React.useEffect(() => {
    const totalB = (flights?.[0]?.avgs?.length || 0) * budget

    setMarkers(markers.map((marker: any) => ({
      ...marker,
      color: checkAgainstBudget(marker.cost, totalB)
    })))
  }, [budget])

  React.useEffect(() => {
    const totalB = (flights?.[0]?.avgs?.length || 0) * budget
    const filtered = markers.length > 0 ? flights.filter((f: any) => markers.some((m: any) => f.destination !== m.iata)) : flights
    setMarkers(
      [
        ...markers,
        // do not return markers for existing ones
        ...filtered.map((f: any) => {
            const airport = airports.find(a => a.iata === f.destination)

            return {
              iata: airport?.iata,
              markerOffset: -10,
              name: airport?.name,
              city: airport?.city,
              coordinates: [airport?.longitude, airport?.latitude],
              cost: f.totalPrice,
              color: checkAgainstBudget(+f.totalPrice, totalB)
            }
          })
    ])
  }, [flights])

  const checkAgainstBudget = (cost: number, totalBudget: number) => {
    // 10% tolerance for determining closeness
    const budgetThreshold = 0.1

    if (Math.abs(totalBudget - cost) < (totalBudget * budgetThreshold)) return budgetColors.close 
    if (cost < totalBudget) return budgetColors.in 
    if (cost > totalBudget) return budgetColors.out 
  }

  const getAirportCodesForCountry = (country: string) => {
    const airportCodes = airports.filter(a => a.size === "large" && a.country === country).map(a => a.iata)
    // TODO: return only subset of or airports in capital for larger countries
    return airportCodes.length > 0 && airportCodes.length < 3 ? airportCodes.join(",") : ""
  }

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
                  onMouseDownCapture={() => {
                    const airportDestinations = getAirportCodesForCountry(geo.properties.name)
                    const newDestinations = `${destinations}${destinations && airportDestinations ? "," : ""}${airportDestinations}`.split(",")
                    // remove duplicates
                    setDestinations(newDestinations.filter((e: any, i: any) => newDestinations.indexOf(e) === i).join(","))
                  }}
                  onMouseEnter={() => setTooltipContent(`${geo.properties.name}`)}
                  onMouseLeave={() => setTooltipContent("")}
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
          {markers.map(({ name, coordinates, markerOffset, city, cost, color }: any) => (
            <Marker
              key={name}
              coordinates={coordinates as any}
              onMouseEnter={() => setTooltipContent(`$${cost}`)}
              onMouseLeave={() => setTooltipContent("")}
            >
              <circle r={5} fill={color} stroke="#fff" strokeWidth={1} />
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