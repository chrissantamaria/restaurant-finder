import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import MuiPhoneNumber from "material-ui-phone-number";
import DateFnsUtils from "@date-io/date-fns";
import {
  DatePicker,
  TimePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";

import { format as dateFormat, addHours } from "date-fns";
import phoneFormat from "phone";

const styles = {
  input: {
    paddingBottom: 30,
    width: "100%"
  }
};

function SelectForm(props) {
  const { classes } = props;
  const { chosenLocation } = props.formData;

  const [phone, setPhone] = useState("");
  const [dateTime, setDateTime] = useState(addHours(new Date(), 2));

  const [name, setName] = useState("");
  const [nameWarning, setNameWarning] = useState(false);

  const handleNameChange = e => {
    setName(e.target.value);
    setNameWarning(!e.target.value);
  };

  // Keeping parent form data up to date
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const validStep = phoneFormat(phone).length !== 0 && !!name;
    props.setFormData({
      ...props.formData,
      reservation: {
        phone,
        name,
        date: dateFormat(dateTime, "MMMM do"),
        time: dateFormat(dateTime, "h:mm a")
      },
      validStep
    });
  }, [phone, dateTime, name]);
  /* eslint-disable react-hooks/exhaustive-deps */

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography className={classes.name} variant="h5" component="h2">
                {chosenLocation.name}
                {!chosenLocation.price ? "" : ` (${chosenLocation.price})`}
              </Typography>
              <Typography className={classes.pos} color="textSecondary">
                {chosenLocation.distance.toFixed(1)} miles
              </Typography>
              <Typography component="p">{chosenLocation.address}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <div style={{ width: "75%" }}>
              <div style={{ paddingBottom: 30 }}>
                <TextField
                  required
                  label="Name"
                  fullWidth
                  value={name}
                  error={nameWarning}
                  onChange={handleNameChange}
                />
              </div>
              <div style={{ paddingBottom: 30 }}>
                <MuiPhoneNumber
                  fullWidth={true}
                  defaultCountry={"us"}
                  onChange={value => setPhone(value)}
                />
              </div>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                  label="Date"
                  className={classes.input}
                  value={dateTime}
                  onChange={setDateTime}
                />
                <TimePicker
                  label="Time"
                  className={classes.input}
                  value={dateTime}
                  onChange={setDateTime}
                />
              </MuiPickersUtilsProvider>
            </div>
          </Box>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default withStyles(styles)(SelectForm);
