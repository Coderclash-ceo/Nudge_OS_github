export default function CustomerCard({ customer }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <p className="font-semibold">{customer.name}</p>
      <p className="text-sm text-slate-500">{customer.phone}</p>
      <p className="text-sm text-slate-500 mt-2">
        Last visit: {new Date(customer.lastVisit).toLocaleDateString()}
      </p>
      <p className="text-sm text-slate-500">
        Total visits: {customer.totalVisits}
      </p>
    </div>
  );
}
