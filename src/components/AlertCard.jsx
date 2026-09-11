export default function AlertCard({ alert, onDismiss }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex justify-between items-start">
      <p className="text-sm text-amber-900">{alert?.message || "Alert"}</p>
      <button
        onClick={() => onDismiss(alert.id)}
        className="text-amber-600 text-xs ml-3 shrink-0"
      >
        Dismiss
      </button>
    </div>
  );
}
