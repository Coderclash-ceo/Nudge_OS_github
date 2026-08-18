const fetch = require("node-fetch");

const BASE = `https://graph.facebook.com/v20.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

async function sendMessage(to, text) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: text },
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("[whatsapp.service] send failed:", data);
    return { ok: false, error: data };
  }

  return { ok: true, id: data.messages?.[0]?.id };
}

module.exports = { sendMessage };