require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true, service: "nudgeos-backend" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`[server] listening on ${PORT}`));