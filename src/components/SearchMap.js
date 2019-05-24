import React, { useState, useEffect } from "react";
import MapGL, { Marker, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import markerIcon from "../assets/marker.png";

const MAPBOX_KEY = process.env.REACT_APP_MAPBOX_PUBLIC_TOKEN;

export default function SearchMap(props) {
  const [viewport, setViewport] = useState({
    zoom: 14,
    ...props.location
  });

  const onViewportChange = viewport => {
    const { width, height, ...etc } = viewport;
    setViewport(etc);
  };

  const handleMapClick = event => {
    props.setLocation({
      latitude: event.lngLat[1],
      longitude: event.lngLat[0]
    });
  };

  // Runs when the locations prop changes
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    // Using all existing data from viewport but overriding latitude and longitude
    setViewport({ ...viewport, ...props.location });
  }, [props.location]);
  /* eslint-disable react-hooks/exhaustive-deps */

  const navStyle = {
    position: "absolute",
    top: 0,
    right: 0,
    padding: "10px"
  };

  return (
    <MapGL
      width="100%"
      height="100%"
      {...viewport}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      onViewportChange={newViewport => onViewportChange(newViewport)}
      onNativeClick={handleMapClick}
      mapboxApiAccessToken={MAPBOX_KEY}
    >
      <div className="nav" style={navStyle}>
        <NavigationControl
          onViewportChange={newViewport => onViewportChange(newViewport)}
        />
      </div>
      <Marker {...props.location} offsetLeft={-20} offsetTop={-20}>
        <img alt="Marker pin" style={{ height: 40 }} src={markerIcon} />
      </Marker>
    </MapGL>
  );
}
