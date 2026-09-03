import { useFirestore } from "../hooks/useFirestore";
import ConversationThread from "../components/ConversationThread";

export default function Conversations() {
  const { data: conversations, loading, error } = useFirestore("conversations");

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Conversations</h1>

      {loading && <p className="text-slate-500">Loading conversations...</p>}

      {error && (
        <p className="text-red-600 bg-red-50 p-2 rounded">
          Error loading conversations: {error}
        </p>
      )}

      {!loading && !error && conversations.length === 0 ? (
        <p className="text-slate-500">No conversations yet.</p>
      ) : (
        <div className="space-y-4">
          {conversations.map((c) => (
            <ConversationThread key={c.id} conversation={c} />
          ))}
        </div>
      )}
    </div>
  );
}
