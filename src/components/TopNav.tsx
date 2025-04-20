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
    <nav
      className="w-full h-16 px-6 bg-white shadow-md fixed top-0 left-0 right-0 flex items-center justify-between z-50"
      role="navigation"
      aria-label="Main navigation"
    >
      <Link
        to="/"
        className="text-primary text-4xl font-bold focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        aria-label="Go to homepage"
      >
        hevents
      </Link>

      {/* Navigation Items */}
      <ul className="flex gap-6 items-center text-sm">
        {[
          { to: "/", label: "Home" },
          { to: "/calendar", label: "Calendar" },
          { to: "/profile", label: "Profile" },
        ].map(({ to, label }) => (
          <li key={to}>
            <Link
              to={to}
              aria-current={isActive(to) ? "page" : undefined}
              className={`transition focus:outline-none focus:ring-2 focus:ring-red-500 ${
                isActive(to)
                  ? "text-red-500 font-medium"
                  : "text-gray-600 hover:text-red-500"
              }`}
            >
              {label}
            </Link>
          </li>
        ))}

        {/* AUTH SECTION */}
        {userEmail ? (
          <>
            <li className="hidden sm:inline text-gray-500 text-xs">
              {userEmail}
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="font-medium text-sm text-gray-600 border border-gray-300 px-3 py-1 rounded hover:bg-red-500 hover:text-white transition"
              >
                Sign Out
              </button> 
            </li>
          </>
        ) : (
          <li>
            <button
              onClick={() => setShowLogin(true)}
              className="font-medium text-sm text-gray-600 border border-gray-300 px-3 py-1 rounded hover:bg-red-500 hover:text-primary transition"
            >
              Login
            </button>
            {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
          </li>
        )}
      </ul>
    </nav>
  );
};

export default TopNav;
