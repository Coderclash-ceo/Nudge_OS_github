export default function ConversationThread({ conversation }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <p className="font-semibold mb-2">{conversation.customerName}</p>
      <div className="space-y-2">
        {conversation.messages.map((m) => (
          <div
            key={m.id}
            className={`max-w-xs px-3 py-2 rounded text-sm ${
              m.sender === "business"
                ? "bg-slate-900 text-white ml-auto"
                : "bg-slate-100 text-slate-800"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>
    </div>
  );
}
