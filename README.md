# offsites-rec

Uses the [Skyscanner API](https://rapidapi.com/3b-data-3b-data-default/api/skyscanner44/) to get flight details for easier offsite location recommendations.

# How to run

Create a .env file to hold the [API_KEY](https://rapidapi.com/3b-data-3b-data-default/api/skyscanner44/):
```
API_KEY=<your-api-key>
```

Run the script to get the flight averages and total price:
```
npm run getFlightEstimations
```

Run the script to get the averages for one flight with the following format:
```
npm run getFlight "<ORIGIN>" "<DESTINATION>" "<DEPARTURE_DATE>" "<RETURN_DATE>"
// e.g. npm run getFlight "NYCA" "OPO" "2023-05-15" "2023-05-19"
```

# Tests

```
npm run test
```