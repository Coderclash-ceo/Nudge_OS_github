import { useState, useEffect } from "react";
import StatCard from "../components/StatCard";
import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Mock data — replace with real API once M2's backend is ready (see M3-10, M3-14)
    const timer = setTimeout(() => {
      setStats({
        totalBookingsThisMonth: 24,
        busiestHour: "3:00 PM",
        atRiskCustomerCount: 3,
        headline: "Bookings are up 12% compared to last month.",
      });
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Spinner label="Loading dashboard..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Dashboard</h1>
      <p className="text-slate-600 mb-6">{stats.headline}</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Bookings this month"
          value={stats.totalBookingsThisMonth}
        />
        <StatCard label="Busiest hour" value={stats.busiestHour} />
        <StatCard label="At-risk customers" value={stats.atRiskCustomerCount} />
      </div>
    </div>
  );
}
