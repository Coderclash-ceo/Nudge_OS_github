const { calendar } = require("../config/googleCalendar");
const { getDoc } = require("./firestore.service");

async function listEvents(calendarId, timeMin, timeMax) {
  const res = await calendar.events.list({
    calendarId,
    timeMin: timeMin.toISOString(),
    timeMax: timeMax.toISOString(),
    singleEvents: true,
    orderBy: "startTime",
  });

  return res.data.items || [];
}

// Parses "10:00-20:00" into { open: "10:00", close: "20:00" }, or null if closed
function parseHoursForDay(hoursObj, date) {
  const dayNames = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const dayKey = dayNames[date.getDay()];

  // Find a matching key — supports both single-day keys (e.g. "sun")
  // and range keys (e.g. "mon-sat")
  for (const key of Object.keys(hoursObj)) {
    const value = hoursObj[key];
    if (key === dayKey) {
      return value === "closed" ? null : value;
    }
    if (key.includes("-")) {
      const [start, end] = key.split("-");
      const startIdx = dayNames.indexOf(start);
      const endIdx = dayNames.indexOf(end);
      if (startIdx === -1 || endIdx === -1) continue;

      const todayIdx = date.getDay();
      const inRange =
        startIdx <= endIdx
          ? todayIdx >= startIdx && todayIdx <= endIdx
          : todayIdx >= startIdx || todayIdx <= endIdx; // wraps around week

      if (inRange) {
        return value === "closed" ? null : value;
      }
    }
  }
  return null; // no matching hours entry = treat as closed
}

function timeStringToDate(baseDate, timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const d = new Date(baseDate);
  d.setHours(hours, minutes, 0, 0);
  return d;
}

async function getCalendarGaps(calendarId, date, openTime, closeTime) {
  const dayStart = timeStringToDate(date, openTime);
  const dayEnd = timeStringToDate(date, closeTime);

  const events = await listEvents(calendarId, dayStart, dayEnd);

  const busy = events
    .filter((e) => e.start?.dateTime && e.end?.dateTime)
    .map((e) => ({
      start: new Date(e.start.dateTime),
      end: new Date(e.end.dateTime),
    }))
    .sort((a, b) => a.start - b.start);

  const gaps = [];
  let cursor = dayStart;

  for (const b of busy) {
    if (b.start > cursor) {
      gaps.push({ start: new Date(cursor), end: new Date(b.start) });
    }
    if (b.end > cursor) {
      cursor = b.end;
    }
  }

  if (cursor < dayEnd) {
    gaps.push({ start: new Date(cursor), end: new Date(dayEnd) });
  }

  return gaps;
}

async function listAvailableSlots(businessId, service, date) {
  const business = await getDoc("businesses", businessId);
  if (!business) throw new Error(`Business not found: ${businessId}`);

  const { calendarId, hours, services } = business;
  if (!calendarId) throw new Error(`Business ${businessId} has no calendarId set`);

  const hoursForDay = parseHoursForDay(hours, date);
  if (!hoursForDay) return []; // closed that day

  const [openTime, closeTime] = hoursForDay.split("-");

  const serviceInfo = (services || []).find((s) => s.name === service);
  if (!serviceInfo) throw new Error(`Service not found: ${service}`);
  const durationMin = serviceInfo.durationMin;

  const gaps = await getCalendarGaps(calendarId, date, openTime, closeTime);

  const slots = [];
  for (const gap of gaps) {
    let slotStart = new Date(gap.start);
    while (true) {
      const slotEnd = new Date(slotStart.getTime() + durationMin * 60000);
      if (slotEnd > gap.end) break;

      const hh = String(slotStart.getHours()).padStart(2, "0");
      const mm = String(slotStart.getMinutes()).padStart(2, "0");
      slots.push(`${hh}:${mm}`);

      slotStart = slotEnd;
    }
  }

  return slots;
}

module.exports = { listEvents, getCalendarGaps, listAvailableSlots };