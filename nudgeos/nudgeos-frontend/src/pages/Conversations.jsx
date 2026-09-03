import { useFirestore } from "../hooks/useFirestore";
import ConversationThread from "../components/ConversationThread";
import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";

export default function Conversations() {
  const { data: conversations, loading, error } = useFirestore("conversations");

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Conversations</h1>

      {loading && <Spinner label="Loading conversations..." />}

      {error && (
        <ErrorMessage message={`Error loading conversations: ${error}`} />
      )}

      {!loading && !error && conversations.length === 0 ? (
        <p className="text-slate-500">No conversations yet.</p>
      ) : (
        !loading &&
        !error && (
          <div className="space-y-4">
            {conversations.map((c) => (
              <ConversationThread key={c.id} conversation={c} />
            ))}
          </div>
        )
      )}
    </div>
  );
}
