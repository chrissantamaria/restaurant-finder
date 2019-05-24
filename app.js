require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());

const axios = require("axios");
const path = require("path");
const phone = require("phone");

const twilioClient = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

app.get("/api/proxy", async (req, res) => {
  try {
    const queryResponse = await axios.get(req.query.url);
    res.status(200).send(queryResponse.data);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: e.stack });
  }
});

app.post("/api/call", async (req, res) => {
  try {
    const reservation = req.body;

    const encodedXML = encodeURIComponent(`
      <Response>
        <Say>
          Hi, I would like to place a reservation on ${reservation.date} 
          at ${reservation.time}. Please put the reservation under 
          the name ${reservation.name}. Thank you.
        </Say>
      </Response>
    `);
    await twilioClient.calls.create({
      url: `https://twimlets.com/echo?Twiml=${encodedXML}`,
      to: phone(reservation.phone)[0],
      from: process.env.TWILIO_PHONE_NUMBER
    });

    res.status(200).send();
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: e.stack });
  }
});

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
app.use(express.static(path.join(__dirname, "build")));

app.listen(4200, () => console.log("Server listening on port 4200"));
