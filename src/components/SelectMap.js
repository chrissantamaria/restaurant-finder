import React, { useState, useEffect } from "react";
import MapGL, { Marker, Popup, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import markerIcon from "../assets/marker.png";

import "./SelectMap.css";

const MAPBOX_KEY = process.env.REACT_APP_MAPBOX_PUBLIC_TOKEN;

export default function SelectMap(props) {
  const [viewport, setViewport] = useState({
    zoom: 14,
    ...props.centerLocation
  });
  const [showPopup, setShowPopup] = useState(false);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    setViewport({ ...viewport, ...props.chosenLocation.location });
    setShowPopup(true);
  }, [props.chosenLocation]);
  /* eslint-disable react-hooks/exhaustive-deps */

  const onViewportChange = viewport => {
    const { width, height, ...etc } = viewport;
    setViewport(etc);
  };

  const handleClickMarker = location => {
    props.setChosenLocation(location);
  };

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
      mapboxApiAccessToken={MAPBOX_KEY}
    >
      <div className="nav" style={navStyle}>
        <NavigationControl
          onViewportChange={newViewport => onViewportChange(newViewport)}
        />
      </div>
      {props.locations.map((location, i) => (
        <React.Fragment key={i}>
          <Marker {...location.location} offsetLeft={-20} offsetTop={-20}>
            <img
              alt="Marker pin"
              style={{ height: 40, cursor: "pointer" }}
              src={markerIcon}
              onClick={() => handleClickMarker(location)}
            />
          </Marker>
          {location === props.chosenLocation && showPopup && (
            <Popup
              className="popup"
              {...location.location}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setShowPopup(false)}
              anchor="bottom"
              altitude={100}
            >
              <h1>
                {location.name}
                {!location.price ? "" : ` (${location.price})`}
              </h1>
              <p>{location.address}</p>
            </Popup>
          )}
        </React.Fragment>
      ))}
    </MapGL>
  );
}
