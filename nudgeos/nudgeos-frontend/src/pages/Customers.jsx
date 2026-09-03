import { useFirestore } from "../hooks/useFirestore";
import CustomerCard from "../components/CustomerCard";

export default function Customers() {
  const { data: customers, loading, error } = useFirestore("customers");

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Customers</h1>

      {loading && <p className="text-slate-500">Loading customers...</p>}

      {error && (
        <p className="text-red-600 bg-red-50 p-2 rounded">
          Error loading customers: {error}
        </p>
      )}

      {!loading && !error && customers.length === 0 ? (
        <p className="text-slate-500">No customers yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers.map((c) => (
            <CustomerCard key={c.id} customer={c} />
          ))}
        </div>
      )}
    </div>
  );
}
