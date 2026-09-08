const express = require("express");
const router = express.Router();
const { resolveBusinessId } = require("../middleware/tenantResolver");
const { getDoc, queryCollection } = require("../services/firestore.service");
const { handleReceptionMessage } = require("../agents/reception/reception.agent");
const { sendMessage } = require("../services/whatsapp.service");

// GET — Meta's webhook verification handshake
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

    if (!msg) return;

    const from = msg.from;
    const text = msg.text?.body;

    console.log("[webhook] incoming:", { from, text });

    const { found, businessId } = await resolveBusinessId(from);
    if (!found) {
      console.log("[webhook] unknown number, ignoring:", from);
      return;
    }

    const business = await getDoc("businesses", businessId);
const conversationHistory = []; // TODO: replace with real history once Task 21 (store conversation history) is built

    const { reply } = await handleReceptionMessage(business, conversationHistory, text);

    await sendMessage(from, reply);
    console.log("[webhook] replied:", reply);
  } catch (err) {
    console.error("[webhook] parse error:", err.message);
  }
});

module.exports = router;