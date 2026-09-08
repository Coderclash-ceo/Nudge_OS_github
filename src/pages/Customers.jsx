import { useFirestore } from "../hooks/useFirestore";
import CustomerCard from "../components/CustomerCard";
import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";

export default function Customers() {
  const { data: customers, loading, error } = useFirestore("customers");

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Customers</h1>

      {loading && <Spinner label="Loading customers..." />}

      {error && <ErrorMessage message={`Error loading customers: ${error}`} />}

      {!loading && !error && customers.length === 0 ? (
        <p className="text-slate-500">No customers yet.</p>
      ) : (
        !loading &&
        !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {customers.map((c) => (
              <CustomerCard key={c.id} customer={c} />
            ))}
          </div>
        )
      )}
    </div>
  );
}
