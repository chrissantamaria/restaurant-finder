import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import Box from "@material-ui/core/Box";

import SearchMap from "./SearchMap";
import { geocode } from "./SearchUtils";

export default function SearchForm(props) {
  const [location, setLocation] = useState(props.formData.location);
  const [locationText, setLocationText] = useState("");
  const [locationWarning, setLocationWarning] = useState(false);

  const [keyword, setKeyword] = useState(props.formData.keyword);
  const [keywordWarning, setKeywordWarning] = useState(false);

  const [radius, setRadius] = useState(props.formData.radius);
  const [radiusWarning, setRadiusWarning] = useState(false);

  // Keeping parent form data up to date
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const validStep = !radiusWarning && !!keyword;
    props.setFormData({
      ...props.formData,
      location,
      keyword,
      radius: parseInt(radius),
      validStep
    });
  }, [location, radius, keyword]);
  /* eslint-disable react-hooks/exhaustive-deps */

  const convertToLocation = async () => {
    try {
      const location = await geocode(locationText);
      setLocation(location);
    } catch (e) {
      console.error("Invalid location search", e);
      setLocationWarning(true);
    }
  };

  const handleKeywordChange = e => {
    setKeyword(e.target.value);
    setKeywordWarning(!e.target.value);
  };

  const handleRadiusChange = e => {
    setRadius(e.target.value);
    // Warning is false if a valid number > 0
    setRadiusWarning(!e.target.value.match(/^[1-9][0-9]*$/g));
  };

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={10}>
          <TextField
            value={locationText}
            onChange={e => setLocationText(e.target.value)}
            label="Location"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Box display="flex" justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              onClick={convertToLocation}
            >
              Update
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} sm={10}>
          <TextField
            required
            label="Query"
            fullWidth
            value={keyword}
            error={keywordWarning}
            onChange={handleKeywordChange}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            required
            label="Radius"
            type="number"
            fullWidth
            value={radius}
            error={radiusWarning}
            onChange={handleRadiusChange}
          />
        </Grid>
        <Grid item xs={12}>
          <div className="map" style={{ height: 400 }}>
            <SearchMap location={location} setLocation={setLocation} />
          </div>
        </Grid>
      </Grid>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        open={locationWarning}
        autoHideDuration={4000}
        onClose={() => setLocationWarning(false)}
        message={<span>Invalid location, please resubmit</span>}
      />
    </React.Fragment>
  );
}
