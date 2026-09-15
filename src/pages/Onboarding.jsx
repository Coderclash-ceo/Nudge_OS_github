import { useState } from "react";
import Spinner from "../components/Spinner";

const MIN_LENGTH = 50;

// MOCK — replace with real api.post('/api/settings/onboarding', { text }) once M2's backend route exists
async function mockExtractOnboardingData(text) {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return {
    services: [
      { name: "Haircut", price: 300 },
      { name: "Beard Trim", price: 150 },
    ],
    hours: {
      "mon-fri": "9am-7pm",
      sat: "10am-5pm",
      sun: null,
    },
  };
}

export default function Onboarding() {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState(false);

  // Extracted data & review state
  const [isExtracted, setIsExtracted] = useState(false);
  const [services, setServices] = useState([]);
  const [hours, setHours] = useState({
    "mon-fri": "",
    sat: "",
    sun: null,
  });
  const [confirmed, setConfirmed] = useState(false);

  const isValid = text.trim().length >= MIN_LENGTH;

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched(true);
    if (!isValid) return;

    setSubmitting(true);
    try {
      // MOCK — replace with real api.post('/api/settings/onboarding', { text }) once M2's backend route exists
      const data = await mockExtractOnboardingData(text);
      setServices(data.services || []);
      setHours(
        data.hours || {
          "mon-fri": "",
          sat: "",
          sun: null,
        }
      );
      setIsExtracted(true);
    } catch (err) {
      console.error("Failed to extract onboarding data:", err);
    } finally {
      setSubmitting(false);
    }
  }

  function updateService(index, field, value) {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };
    setServices(updated);
  }

  function addService() {
    setServices([...services, { name: "", price: 0 }]);
  }

  function removeService(index) {
    setServices(services.filter((_, i) => i !== index));
  }

  function handleConfirm() {
    // TODO: POST final values to save endpoint once backend exists
    console.log("Confirmed onboarding data:", { services, hours });
    setConfirmed(true);
  }

  if (submitting) {
    return (
      <div className="p-6 max-w-2xl">
        <h1 className="text-xl font-semibold mb-2">Onboarding</h1>
        <p className="text-slate-600 mb-6">
          Analyzing your business details...
        </p>
        <Spinner label="Extracting business info..." />
      </div>
    );
  }

  if (isExtracted) {
    return (
      <div className="p-6 max-w-xl">
        <h1 className="text-xl font-semibold mb-2">Review Extracted Settings</h1>
        <p className="text-slate-600 mb-6 text-sm">
          We extracted the following services and operating hours from your description.
          Please review and adjust them before continuing.
        </p>

        {confirmed && (
          <div className="mb-4 text-sm text-green-700 bg-green-50 p-3 rounded">
            Onboarding settings confirmed! Check console for logged data.
          </div>
        )}

        <h2 className="font-medium mb-2">Services</h2>
        <div className="space-y-2 mb-4">
          {(services || []).map((s, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                value={s.name || ""}
                onChange={(e) => updateService(i, "name", e.target.value)}
                placeholder="Service name"
                className="border rounded px-2 py-1 flex-1"
              />
              <input
                type="number"
                value={s.price ?? ""}
                onChange={(e) =>
                  updateService(
                    i,
                    "price",
                    e.target.value === "" ? null : Number(e.target.value)
                  )
                }
                placeholder="Price"
                className="border rounded px-2 py-1 w-24"
              />
              <button
                type="button"
                onClick={() => removeService(i)}
                className="text-red-600 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addService}
            className="text-sm text-slate-700 underline"
          >
            + Add service
          </button>
        </div>

        <h2 className="font-medium mb-2">Hours</h2>
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2">
            <label className="w-28 text-sm">Mon–Fri</label>
            <input
              value={(hours && hours["mon-fri"]) || ""}
              onChange={(e) =>
                setHours({ ...hours, "mon-fri": e.target.value })
              }
              placeholder="e.g. 9am - 7pm"
              className="border rounded px-2 py-1 flex-1"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="w-28 text-sm">Saturday</label>
            <input
              value={(hours && hours.sat) || ""}
              onChange={(e) => setHours({ ...hours, sat: e.target.value })}
              placeholder="e.g. 10am - 5pm"
              className="border rounded px-2 py-1 flex-1"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="w-28 text-sm">Sunday</label>
            <input
              value={(hours && hours.sun) || ""}
              onChange={(e) =>
                setHours({ ...hours, sun: e.target.value || null })
              }
              placeholder="Closed"
              className="border rounded px-2 py-1 flex-1"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleConfirm}
            className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 font-medium text-sm"
          >
            Confirm
          </button>
          <button
            type="button"
            onClick={() => {
              setIsExtracted(false);
              setConfirmed(false);
            }}
            className="text-slate-600 hover:text-slate-900 text-sm underline"
          >
            Edit description
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-xl font-semibold mb-2">Onboarding</h1>
      <p className="text-slate-600 mb-4">
        Paste a few real customer conversations, or describe your business —
        this helps us set up your assistant.
      </p>

      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={() => setTouched(true)}
          placeholder="Paste a few real customer conversations, or describe your business..."
          rows={10}
          className={`w-full border rounded-lg p-3 text-sm ${
            touched && !isValid ? "border-red-400" : "border-slate-300"
          }`}
        />

        <div className="flex justify-between items-center mt-1 mb-4">
          <span
            className={`text-xs ${text.length < MIN_LENGTH ? "text-slate-400" : "text-slate-500"}`}
          >
            {text.trim().length} / {MIN_LENGTH} characters minimum
          </span>
          {touched && !isValid && (
            <span className="text-xs text-red-500">
              Please enter at least {MIN_LENGTH} characters.
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className={`px-4 py-2 rounded text-sm font-medium ${
            submitting
              ? "bg-slate-300 text-slate-500 cursor-not-allowed"
              : "bg-slate-900 text-white hover:bg-slate-800"
          }`}
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
