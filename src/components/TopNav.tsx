import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import LoginModal from "../pages/LoginModal";

const TopNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserEmail(user?.email ?? null);
    };
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUserEmail(session?.user?.email ?? null);
      }
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserEmail(null);
    navigate("/");
  };

  return (
    <nav className="w-full h-16 px-6 bg-white shadow-md fixed top-0 left-0 right-0 flex items-center justify-between z-50">
      <Link to="/" className="text-primary text-4xl font-bold">
        hevents
      </Link>

      <div className="flex gap-6 items-center text-sm">
        <Link
          to="/"
          className={`hover:text-red-500 transition ${
            isActive("/") ? "text-red-500 font-medium" : "text-gray-600"
          }`}
        >
          Home
        </Link>
        <Link
          to="/calendar"
          className={`hover:text-red-500 transition ${
            isActive("/calendar") ? "text-red-500 font-medium" : "text-gray-600"
          }`}
        >
          Calendar
        </Link>
        <Link
          to="/profile"
          className={`hover:text-red-500 transition ${
            isActive("/profile") ? "text-red-500 font-medium" : "text-gray-600"
          }`}
        >
          Profile
        </Link>

        {/* AUTH SECTION */}
        {userEmail ? (
          <>
            <span className="hidden sm:inline text-gray-500 text-xs">
              {userEmail}
            </span>
            <button
              onClick={handleLogout}
              className="font-medium text-sm text-gray-600 border border-gray-300 px-3 py-1 rounded hover:bg-red-500 hover:text-white transition"
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setShowLogin(true)}
              className="font-medium text-sm text-gray-600 border border-gray-300 px-3 py-1 rounded hover:bg-red-500 hover:text-white transition"
            >
              Login
            </button>
            {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
          </>
        )}
      </div>
    </nav>
  );
};

export default TopNav;
