# offsites-rec

Uses the [Skyscanner API](https://rapidapi.com/3b-data-3b-data-default/api/skyscanner44/) to get flight details for easier offsite location recommendations.

## Web application

More information [here](./web-app/README.md).

### How to run
```
npm run start
```

### Tests
```
npm run test:web-app
```

## Script

### Configuration
Copy the .env-example file and fill in the missing API key.

### How to run
Run the script to get the averages for multiple flights with the following format:
```
npm run getFlights "[<ORIGIN>]" "<DESTINATION>" "<DEPARTURE_DATE>" "<RETURN_DATE>"
// e.g. npm run getFlights "[NYCA,LGW,MAD]" "OPO" "2023-05-15" "2023-05-19"
```

Run the script to get the averages for one flight with the following format:
```
npm run getFlight "<ORIGIN>" "<DESTINATION>" "<DEPARTURE_DATE>" "<RETURN_DATE>"
// e.g. npm run getFlight "NYCA" "OPO" "2023-05-15" "2023-05-19"
```

### Tests
```
npm run test:lambda
```