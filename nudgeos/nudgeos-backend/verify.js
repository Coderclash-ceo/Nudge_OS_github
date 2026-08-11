const express = require("express");
const app = express();

app.get("/webhook/whatsapp", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === "nudgeos123") {
    console.log("[webhook] verified by Meta");
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

app.listen(3000, () => console.log("Verification server running on port 3000"));