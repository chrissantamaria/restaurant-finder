import axios from "axios";
import querystring from "query-string";
import { getDistance } from "geolib";

const MAPBOX_KEY = process.env.REACT_APP_MAPBOX_PUBLIC_TOKEN;
const GOOGLE_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

export async function geocode(query) {
  const res = await axios.get(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${MAPBOX_KEY}`
  );
  const location = res.data.features[0].center;
  return { latitude: location[1], longitude: location[0] };
}

export async function getLocations(formData) {
  const { location, keyword, radius } = formData;
  let mapsQuery = querystring.stringify({
    key: GOOGLE_KEY,
    radius,
    keyword,
    opennow: true
  });
  mapsQuery += `&location=${[location.latitude, location.longitude].join(",")}`;

  const proxyQuery = querystring.stringify({
    url: `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${mapsQuery}`
  });
  const res = await axios.get(`/api/proxy?${proxyQuery}`).catch(e => {
    console.error("Google API GET failed:", e);
    return { data: { results: [] } };
  });

  const locations = res.data.results.map(location => {
    const position = location.geometry.location;
    const formattedPosition = {
      latitude: position.lat,
      longitude: position.lng
    };
    const distance =
      getDistance(formData.location, formattedPosition) / 1609.344;

    return {
      name: location.name,
      location: formattedPosition,
      price: "$".repeat(Math.floor(location.price_level)),
      address: location.vicinity,
      distance
    };
  });

  return locations;
}
