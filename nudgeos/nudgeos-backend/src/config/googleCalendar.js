const { google } = require("googleapis");
const path = require("path");

const KEY_PATH = process.env.GOOGLE_CALENDAR_KEY_PATH;

const auth = new google.auth.GoogleAuth({
  keyFile: KEY_PATH,
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

const calendar = google.calendar({ version: "v3", auth });

module.exports = { calendar };