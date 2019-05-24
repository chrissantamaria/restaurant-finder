# Restaurants Finder

A simple web app to find nearby restaurants and make calls to place reservations.

Uses React with [material-ui](https://github.com/mui-org/material-ui) for the frontend and Node with Express for the backend. Location data is provided by the [Mapbox](https://docs.mapbox.com/api/) and [Google Places](https://developers.google.com/places/web-service/intro) APIs. Maps are displayed using [react-map-gl](https://github.com/uber/react-map-gl). Calls are made using [Twilio](https://www.twilio.com/).

## Usage

Run `npm install` and `npm build` and create a `.env` file with all necessary credentials (see `.env.example`).

Run the app with `npm start` and access at `http://localhost:4200/`.

## Features

- Search criteria such as location, radius and a location keyword
- Visual maps display of all restaurant results
- Placing calls to a restaurant (please don't call actual businesses!) similar to Google Duplex.
