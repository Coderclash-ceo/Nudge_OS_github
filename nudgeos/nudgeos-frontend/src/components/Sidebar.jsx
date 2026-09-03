import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/bookings", label: "Bookings" },
  { to: "/customers", label: "Customers" },
  { to: "/conversations", label: "Conversations" },
  { to: "/settings", label: "Settings" },
];

export default function Sidebar() {
  return (
    <aside className="w-56 bg-slate-900 text-slate-100 min-h-screen p-4">
      <div className="font-bold text-lg mb-6">Nudge OS</div>
      <nav className="space-y-1">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === "/"}
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${isActive ? "bg-slate-700" : "hover:bg-slate-800"}`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
