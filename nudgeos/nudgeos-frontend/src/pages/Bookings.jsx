import BookingTable from "../components/BookingTable";

const dummyBookings = [
  {
    id: "b1",
    customerName: "Aisha Khan",
    service: "Haircut",
    startTime: "2026-08-10T15:00:00Z",
    status: "confirmed",
  },
  {
    id: "b2",
    customerName: "Rahul Verma",
    service: "Beard Trim",
    startTime: "2026-08-10T16:30:00Z",
    status: "pending",
  },
];

export default function Bookings() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Bookings</h1>
      <BookingTable bookings={dummyBookings} />
    </div>
  );
}
