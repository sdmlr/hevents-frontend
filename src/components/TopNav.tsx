import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import LoginModal from "../pages/LoginModal";

const TopNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

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
        className="text-primary text-4xl font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus:ring-offset-2"
        aria-label="Go to homepage"
      >
        hevents
      </Link>

      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="sm:hidden text-2xl text-gray-700 focus:outline-none"
        aria-label="Toggle navigation"
      >
        ☰
      </button>

      {/* Navigation Items */}
      <ul
        className={`${
          menuOpen ? "flex" : "hidden"
        } sm:flex flex-col sm:flex-row gap-6 items-center text-sm absolute sm:static bg-white sm:bg-transparent top-16 left-0 w-full sm:w-auto shadow-md sm:shadow-none z-40 sm:z-auto px-4 sm:px-0 py-4 sm:py-0`}
      >
        {[
          { to: "/", label: "Home" },
          { to: "/calendar", label: "Calendar" },
          { to: "/profile", label: "Profile" },
        ].map(({ to, label }) => (
          <li key={to}>
            <Link
              to={to}
              aria-current={isActive(to) ? "page" : undefined}
              className={`transition focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500
 ${
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
              aria-haspopup="dialog"
              aria-expanded={showLogin}
              aria-controls="login-modal"
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
