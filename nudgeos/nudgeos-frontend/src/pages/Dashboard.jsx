import StatCard from "../components/StatCard";

const dummyStats = {
  totalBookingsThisMonth: 24,
  busiestHour: "3:00 PM",
  atRiskCustomerCount: 3,
  headline: "Bookings are up 12% compared to last month.",
};

export default function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Dashboard</h1>
      <p className="text-slate-600 mb-6">{dummyStats.headline}</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Bookings this month"
          value={dummyStats.totalBookingsThisMonth}
        />
        <StatCard label="Busiest hour" value={dummyStats.busiestHour} />
        <StatCard
          label="At-risk customers"
          value={dummyStats.atRiskCustomerCount}
        />
      </div>
    </div>
  );
}
