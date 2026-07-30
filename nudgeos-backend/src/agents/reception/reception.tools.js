// src/agents/reception/reception.tools.js

const receptionTools = [
  {
    name: "check_availability",
    description: "Check available appointment slots for a given service on a given date. Use this whenever the customer wants to book but hasn't confirmed a specific time yet, or asks what slots are open.",
    input_schema: {
      type: "object",
      properties: {
        service: { type: "string", description: "Service name as offered by this business, e.g. 'haircut'." },
        date: { type: "string", description: "YYYY-MM-DD. Resolve relative dates ('tomorrow','Friday') before calling." }
      },
      required: ["service", "date"]
    }
  },
  {
    name: "create_booking",
    description: "Book a confirmed appointment. Only call after the customer has explicitly confirmed service, date, and time.",
    input_schema: {
      type: "object",
      properties: {
        customerName: { type: "string" },
        service: { type: "string" },
        date: { type: "string", description: "YYYY-MM-DD" },
        time: { type: "string", description: "12-hour format with AM/PM, e.g. '03:00 PM'. Always include AM/PM." }
      },
      required: ["customerName", "service", "date", "time"]
    }
  },
  {
    name: "find_booking",
    description: "Look up an existing booking to get its bookingId. Must be called before cancel_booking or reschedule_booking - never guess a bookingId.",
    input_schema: {
      type: "object",
      properties: {
        customerName: { type: "string" },
        roughDate: { type: "string", description: "Date or day-name the customer gave, e.g. 'Friday'. Used to narrow the search, not an exact match." },
        service: { type: "string", description: "Optional - helps disambiguate if the customer has multiple bookings." }
      },
      required: ["customerName"]
    }
  },
  {
    name: "cancel_booking",
    description: "Cancel an existing booking. Use when the customer explicitly asks to cancel. Requires a bookingId obtained from find_booking.",
    input_schema: {
      type: "object",
      properties: {
        bookingId: { type: "string", description: "Must come from a prior find_booking call. Never invent or guess this value." }
      },
      required: ["bookingId"]
    }
  },
  {
    name: "reschedule_booking",
    description: "Move an existing booking to a new date/time. Requires a bookingId obtained from find_booking.",
    input_schema: {
      type: "object",
      properties: {
        bookingId: { type: "string", description: "Must come from a prior find_booking call." },
        newDate: { type: "string", description: "YYYY-MM-DD" },
        newTime: { type: "string", description: "12-hour format with AM/PM, e.g. '05:00 PM'." }
      },
      required: ["bookingId", "newDate", "newTime"]
    }
  }
];

module.exports = { receptionTools };