import CustomerCard from "../components/CustomerCard";

const dummyCustomers = [
  {
    id: "c1",
    name: "Aisha Khan",
    phone: "+91 98765 43210",
    lastVisit: "2026-08-01T00:00:00Z",
    totalVisits: 5,
  },
  {
    id: "c2",
    name: "Rahul Verma",
    phone: "+91 91234 56789",
    lastVisit: "2026-07-20T00:00:00Z",
    totalVisits: 2,
  },
];

export default function Customers() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Customers</h1>
      {dummyCustomers.length === 0 ? (
        <p className="text-slate-500">No customers yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {dummyCustomers.map((c) => (
            <CustomerCard key={c.id} customer={c} />
          ))}
        </div>
      )}
    </div>
  );
}
