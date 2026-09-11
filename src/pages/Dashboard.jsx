import { useState, useEffect } from "react";
import StatCard from "../components/StatCard";
import AlertCard from "../components/AlertCard";
import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
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
      setAlerts([
        {
          id: "a1",
          type: "underbooked",
          message: "You have 3 open slots this Thursday afternoon.",
          date: "2026-09-10",
        },
        {
          id: "a2",
          type: "underbooked",
          message:
            "Saturday morning is looking light — only 2 bookings so far.",
          date: "2026-09-12",
        },
      ]);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  function dismissAlert(id) {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }

  if (loading) return <Spinner label="Loading dashboard..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Dashboard</h1>
      <p className="text-slate-600 mb-6">{stats.headline}</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Bookings this month"
          value={stats.totalBookingsThisMonth}
        />
        <StatCard label="Busiest hour" value={stats.busiestHour} />
        <StatCard label="At-risk customers" value={stats.atRiskCustomerCount} />
      </div>

      <h2 className="font-medium mb-2">Alerts</h2>
      {alerts.length === 0 ? (
        <p className="text-slate-500 text-sm">
          No alerts right now — you're all caught up.
        </p>
      ) : (
        <div className="space-y-2">
          {alerts.map((a) => (
            <AlertCard key={a.id} alert={a} onDismiss={dismissAlert} />
          ))}
        </div>
      )}
    </div>
  );
}
