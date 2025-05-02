import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import TopNav from "./components/TopNav";
import CalendarPage from "./pages/Calendar";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Footer from "./components/Footer";
import AdminDashboard from "./pages/AdminDashboard";
import { Toaster } from "react-hot-toast";
import Browse from "./pages/Browse";


function App() {
  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <TopNav />
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/browse" element={<Browse />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
