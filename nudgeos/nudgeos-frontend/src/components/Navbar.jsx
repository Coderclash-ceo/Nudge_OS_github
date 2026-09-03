import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();
  return (
    <header className="h-14 border-b flex items-center justify-between px-6">
      <span className="text-sm text-slate-500">{user?.email}</span>
      <button onClick={() => signOut(auth)} className="text-sm text-red-600">
        Log out
      </button>
    </header>
  );
}
