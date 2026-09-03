import ConversationThread from "../components/ConversationThread";

const dummyConversations = [
  {
    id: "conv1",
    customerName: "Aisha Khan",
    messages: [
      {
        id: "m1",
        sender: "customer",
        text: "Hi, can I book a haircut tomorrow?",
        timestamp: "2026-08-09T10:00:00Z",
      },
      {
        id: "m2",
        sender: "business",
        text: "Sure! What time works for you?",
        timestamp: "2026-08-09T10:02:00Z",
      },
    ],
  },
  {
    id: "conv2",
    customerName: "Rahul Verma",
    messages: [
      {
        id: "m3",
        sender: "customer",
        text: "Do you do beard trims?",
        timestamp: "2026-08-08T14:00:00Z",
      },
    ],
  },
];

export default function Conversations() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Conversations</h1>
      {dummyConversations.length === 0 ? (
        <p className="text-slate-500">No conversations yet.</p>
      ) : (
        <div className="space-y-4">
          {dummyConversations.map((c) => (
            <ConversationThread key={c.id} conversation={c} />
          ))}
        </div>
      )}
    </div>
  );
}
