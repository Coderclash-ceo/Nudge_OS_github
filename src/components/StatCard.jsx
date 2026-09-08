export default function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <p className="text-slate-500 text-sm">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}
