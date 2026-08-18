const express = require("express");
const router = express.Router();

// GET — Meta's webhook verification handshake (moved from Task 4's verify.js)
router.get("/webhook/whatsapp", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === "nudgeos123") {
    console.log("[webhook] verified by Meta");
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

// POST — real incoming messages from Meta
router.post("/webhook/whatsapp", async (req, res) => {
  res.sendStatus(200); // ack immediately, before any slow work

  try {
    const entry = req.body.entry?.[0];
    const change = entry?.changes?.[0]?.value;
    const msg = change?.messages?.[0];

    if (!msg) return; // status updates / non-message events land here too — ignore for now

    const from = msg.from;
    const text = msg.text?.body;

    console.log("[webhook] incoming:", { from, text });
    // Task 12 replaces this stub with tenantResolver -> reception.agent -> whatsapp.service
  } catch (err) {
    console.error("[webhook] parse error:", err.message);
  }
});

module.exports = router;