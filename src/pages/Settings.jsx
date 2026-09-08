import { useState } from "react";
import { saveSettings } from "../api/client";

export default function Settings() {
  const [services, setServices] = useState([{ name: "Haircut", price: 300 }]);
  const [hours, setHours] = useState({
    "mon-fri": "9am - 7pm",
    sat: "10am - 5pm",
    sun: null,
  });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");

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

  async function handleSave() {
    setSaving(true);
    setSaveSuccess(false);
    setSaveError("");
    try {
      await saveSettings({ services, hours, whatsappNumber: "" });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setSaveError("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-xl font-semibold mb-4">Settings</h1>

      <h2 className="font-medium mb-2">Services</h2>
      <div className="space-y-2 mb-4">
        {services.map((s, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              value={s.name}
              onChange={(e) => updateService(i, "name", e.target.value)}
              placeholder="Service name"
              className="border rounded px-2 py-1 flex-1"
            />
            <input
              type="number"
              value={s.price}
              onChange={(e) =>
                updateService(i, "price", Number(e.target.value))
              }
              placeholder="Price"
              className="border rounded px-2 py-1 w-24"
            />
            <button
              onClick={() => removeService(i)}
              className="text-red-600 text-sm"
            >
              Remove
            </button>
          </div>
        ))}
        <button
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
            value={hours["mon-fri"] || ""}
            onChange={(e) => setHours({ ...hours, "mon-fri": e.target.value })}
            className="border rounded px-2 py-1 flex-1"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="w-28 text-sm">Saturday</label>
          <input
            value={hours.sat || ""}
            onChange={(e) => setHours({ ...hours, sat: e.target.value })}
            className="border rounded px-2 py-1 flex-1"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="w-28 text-sm">Sunday</label>
          <input
            value={hours.sun || ""}
            onChange={(e) =>
              setHours({ ...hours, sun: e.target.value || null })
            }
            placeholder="Closed"
            className="border rounded px-2 py-1 flex-1"
          />
        </div>
      </div>

      {saveSuccess && (
        <div className="mb-3 text-sm text-green-700 bg-green-50 p-2 rounded">
          Settings saved successfully!
        </div>
      )}
      {saveError && (
        <div className="mb-3 text-sm text-red-600 bg-red-50 p-2 rounded">
          {saveError}
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
