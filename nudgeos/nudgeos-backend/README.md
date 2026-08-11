# NudgeOS Backend

Backend service for NudgeOS — handles WhatsApp Cloud API webhook integration.

## Setup
1. Copy `.env.example` to `.env` and fill in real values.
2. Run `npm install`
3. Run `node verify.js` (temporary test file — will be replaced by src/index.js in Task 6)

## Notes
- The ngrok webhook URL changes every time ngrok restarts — update it in Meta's dashboard whenever you restart ngrok.
