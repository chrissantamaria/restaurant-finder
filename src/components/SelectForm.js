import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import SelectMap from "./SelectMap";

const styles = theme => ({
  progress: {
    margin: theme.spacing(2)
  },
  group: {
    margin: `${theme.spacing(1)}px 0`
  }
});

function SelectForm(props) {
  const { classes } = props;

  const [chosenLocation, setChosenLocation] = useState({});

  // Keeping parent form data up to date
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const validStep = !!Object.entries(chosenLocation).length;
    props.setFormData({
      ...props.formData,
      chosenLocation,
      validStep
    });
  }, [chosenLocation]);
  /* eslint-disable react-hooks/exhaustive-deps */

  const handleChooseLocation = e => {
    const locationName = e.target.value;
    const locationObject = props.formData.locations.find(
      location => location.name === locationName
    );
    setChosenLocation(locationObject);
  };

  function showLoading() {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <p style={{ margin: 0 }}>Loading...</p>
        <CircularProgress className={classes.progress} />
      </Box>
    );
  }
  function showNoResults() {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <p style={{ margin: 0 }}>
          No results found, try entering a new location or increasing your
          radius.
        </p>
      </Box>
    );
  }
  function showResults() {
    return (
      <React.Fragment>
        <Grid container spacing={2}>
          <Grid
            style={{ height: 400, overflowY: "scroll" }}
            item
            xs={12}
            sm={4}
          >
            <RadioGroup
              aria-label="Chosen Location"
              className={classes.group}
              value={chosenLocation.name}
              onChange={handleChooseLocation}
            >
              {props.formData.locations.map((location, i) => (
                <FormControlLabel
                  key={i}
                  value={location.name}
                  control={<Radio color="primary" />}
                  label={location.name}
                />
              ))}
            </RadioGroup>
          </Grid>
          <Grid item xs={12} sm={8}>
            <SelectMap
              centerLocation={props.formData.location}
              chosenLocation={chosenLocation}
              setChosenLocation={setChosenLocation}
              locations={props.formData.locations}
            />
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }

  if (props.formData.locations === "loading") return showLoading();
  else if (!props.formData.locations.length) return showNoResults();
  else return showResults();
}

export default withStyles(styles)(SelectForm);
