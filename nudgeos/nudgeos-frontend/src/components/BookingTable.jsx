export default function BookingTable({ bookings }) {
  if (!bookings || bookings.length === 0) {
    return <p className="text-slate-500">No bookings yet.</p>;
  }
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-slate-500 border-b">
          <th className="py-2">Customer</th>
          <th>Service</th>
          <th>Time</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {bookings.map((b) => (
          <tr key={b.id} className="border-b">
            <td className="py-2">{b.customerName}</td>
            <td>{b.service}</td>
            <td>{new Date(b.startTime).toLocaleString()}</td>
            <td>{b.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
