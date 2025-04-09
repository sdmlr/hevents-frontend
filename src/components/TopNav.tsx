import { Link, useLocation } from "react-router-dom";

const TopNav = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="w-full h-16 px-6 bg-white shadow-md fixed top-0 left-0 right-0 flex items-center justify-between z-50">
      <Link to="/" className="text-red-500 font-bold text-xl">
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
      </div>
    </nav>
  );
};

export default TopNav;
