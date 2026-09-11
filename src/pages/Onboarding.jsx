import { useState } from "react";

const MIN_LENGTH = 50;

export default function Onboarding() {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState(false);

  const isValid = text.trim().length >= MIN_LENGTH;

  function handleSubmit(e) {
    e.preventDefault();
    setTouched(true);
    if (!isValid) return;

    setSubmitting(true);
    // TODO (M3-16): call Onboarding Agent via M2's backend here
    console.log("Would submit:", text);

    // Temporary — remove once real backend call is wired in M3-16
    setTimeout(() => setSubmitting(false), 1000);
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
