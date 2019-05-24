import React, { useState } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Snackbar from "@material-ui/core/Snackbar";

import { animateScroll as scroll } from "react-scroll";
import axios from "axios";

import SearchForm from "./components/SearchForm";
import SelectForm from "./components/SelectForm";
import ReservationForm from "./components/ReservationForm";
import { getLocations } from "./components/SearchUtils";

import styles from "./AppStyles";

const steps = ["Enter query", "Select location", "Place reservation"];

function App(props) {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    validStep: false,
    location: {
      latitude: 38.031,
      longitude: -78.488
    },
    radius: 500,
    keyword: "restaurant"
  });
  const [warning, setWarning] = useState(false);

  const getStepContent = step => {
    switch (step) {
      case 0:
        return <SearchForm formData={formData} setFormData={setFormData} />;
      case 1:
        return <SelectForm formData={formData} setFormData={setFormData} />;
      case 2:
        return (
          <ReservationForm formData={formData} setFormData={setFormData} />
        );
      default:
        throw new Error("Unknown step");
    }
  };

  const handleNext = async () => {
    if (!formData.validStep) setWarning(true);
    else {
      if (activeStep === 0) {
        setFormData({ ...formData, locations: "loading" });
        getLocations(formData).then(locations => {
          setFormData({ ...formData, locations, validStep: false });
        });
      } else if (activeStep === 2) {
        axios.post("/api/call", formData.reservation);
      }
      setActiveStep(activeStep + 1);
      scroll.scrollToTop();
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
    scroll.scrollToTop();
  };

  const { classes } = props;
  return (
    <React.Fragment>
      <CssBaseline />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center">
            Restaurant Finder
          </Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map(label => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <React.Fragment>
            {activeStep === steps.length ? (
              <React.Fragment>
                <Typography variant="h5" gutterBottom>
                  Your reservation has been made.
                </Typography>
                {/* prettier-ignore */}
                <Typography variant="subtitle1">
                  A call has been placed to {formData.chosenLocation.name} for a reservation 
                  at {formData.reservation.time} on {formData.reservation.date}.
                  <br />
                  Thank you for using Restaurant Finder.
                </Typography>
                {/* prettier-ignore */}
              </React.Fragment>
            ) : (
              <React.Fragment>
                {getStepContent(activeStep)}
                <div className={classes.buttons}>
                  {activeStep !== 0 && (
                    <Button onClick={handleBack} className={classes.button}>
                      Back
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    className={classes.button}
                  >
                    {activeStep === steps.length - 1 ? "Place call" : "Next"}
                  </Button>
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
        </Paper>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right"
          }}
          open={warning}
          autoHideDuration={4000}
          onClose={() => setWarning(false)}
          message={<span>Please complete all required form fields</span>}
        />
      </main>
    </React.Fragment>
  );
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(App);
