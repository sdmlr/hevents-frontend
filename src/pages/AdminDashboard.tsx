import { useEffect, useState } from "react";
import api from "../api";
import { Event } from "../types/Event";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import toast from "react-hot-toast";

const initialFormState = {
  title: "",
  description: "",
  date: "",
  time: "",
  location: "",
  image_url: "",
  category: "",
};

function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [form, setForm] = useState(initialFormState);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const protectRoute = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return navigate("/login");

      const { data, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error || data?.role !== "staff") {
        toast.error("Access denied");
        return navigate("/");
      }
    };

    protectRoute();
  }, []);

  useEffect(() => {
    api
      .get("/events")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Error loading events:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        // UPDATE existing event
        const res = await api.put(`/admin/events/${editingId}`, form);
        setEvents((prev) =>
          prev.map((ev) => (ev.id === editingId ? res.data.data[0] : ev))
        );
        toast.success("Event updated successfully");
      } else {
        // CREATE new event
        const res = await api.post("/admin/events", form);
        setEvents((prev) => [...prev, res.data.data[0]]);
        toast.success("Event created successfully");
      }

      // Reset state
      setForm(initialFormState);
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      console.error("Failed to submit event:", err);
      toast.error("Submission failed.");
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this event?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/admin/events/${id}`);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      toast.success("Event deleted");
    } catch (err) {
      console.error("Failed to delete event:", err);
      toast.error("Delete failed");
    }
  };

  return (
    <div className="flex min-h-screen relative" role="presentation">
      {/* Sidebar Toggle (Mobile only) */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`
      fixed top-1/2 -translate-y-1/2 left-0 z-50 sm:hidden 
      bg-gray-100 shadow-md rounded-r px-1 py-2 text-gray font-bold 
      transition-transform duration-300 ease-in-out 
      ${sidebarOpen ? "translate-x-64" : ""}
    `}
        aria-label="Toggle staff menu"
      >
        {sidebarOpen ? "<" : ">"}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-gray-100 p-4 z-40 transform transition-transform duration-300 ease-in-out
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
    sm:relative sm:translate-x-0 sm:block`}
        aria-label="Staff menu"
      >
        <h2 id="staff-menu-heading" className="text-xl font-bold mb-6">
          Staff Menu
        </h2>
        <nav aria-labelledby="staff-menu-heading" className="space-y-4">
          <a href="#" className="text-primary">
            Dashboard
          </a>
          <br />
          <a href="#" className="text-gray-600">
            Manage Users
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6" role="main">
        {/* Sticky Expandable Form */}
        <section
          aria-labelledby="event-form-heading"
          className={`sticky top-16 z-30 mb-3 bg-white shadow rounded overflow-hidden transition-all duration-300 ${
            showForm ? "max-h-[1000px]" : "max-h-16"
          }`}
        >
          {/* Header Row with Title + Arrow */}
          <div className="flex justify-between items-center px-4 py-2">
            <h2 id="event-form-heading" className="text-lg font-semibold">
              Manage Event
            </h2>
            <button
              onClick={() => {
                if (showForm) {
                  setEditingId(null);
                  setForm(initialFormState);
                }
                setShowForm(!showForm);
              }}
              className="text-gray-500 text-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              title={showForm ? "Collapse form" : "Expand form"}
              aria-expanded={showForm}
              aria-controls="event-form"
            >
              {showForm ? "▲" : "▼"}
            </button>
          </div>
          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-3 mt-3">
              {[
                "title",
                "description",
                "date",
                "time",
                "location",
                "image_url",
                "category",
              ].map((field) => (
                <div key={field} className="flex flex-col gap-1">
                  <label htmlFor={field} className="text-sm font-medium">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    id={field}
                    type={["date", "time"].includes(field) ? field : "text"}
                    name={field}
                    value={(form as any)[field]}
                    onChange={handleChange}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    className="w-full p-2 border rounded text-sm"
                    required
                    aria-required="true"
                  />
                </div>
              ))}
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded hover:bg-red-600 transition"
                aria-label={editingId ? "Update event" : "Create event"}
              >
                {editingId ? "Update Event" : "Create Event"}
              </button>
            </form>
          )}

          {/* Bottom Arrow Toggle */}
          {showForm && (
            <div className="text-center mt-3 border-t border-gray-200 py-2">
              <button
                onClick={() => {
                  setEditingId(null);
                  setForm(initialFormState);
                  setShowForm(false);
                }}
                className="text-sm text-gray-500 hover:text-red-500"
                aria-label="Collapse form"
              >
                ▲ Collapse
              </button>
            </div>
          )}
        </section>

        <section>
          {loading ? (
            <Spinner />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
              {events.map((event) => (
                <article
                  key={event.id}
                  className="border border-gray-300 rounded shadow-sm flex h-36 overflow-hidden"
                  aria-labelledby={`event-${event.id}`}
                >
                  <div className="w-2/3 flex flex-col justify-between p-4">
                    <h3
                      id={`event-${event.id}`}
                      className="text-lg font-semibold"
                    >
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {event.date} at {event.time}
                    </p>
                    <p className="text-sm text-gray-500">{event.location}</p>
                    <div className="mt-2 flex gap-2">
                      <button
                        className="bg-yellow-400 px-3 py-1 text-sm rounded hover:bg-yellow-500"
                        onClick={() => {
                          setEditingId(event.id);
                          setForm({ ...event });
                          setShowForm(true);
                        }}
                        aria-label={`Edit ${event.title}`}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 px-3 py-1 text-sm rounded hover:bg-red-600"
                        onClick={() => handleDelete(event.id)}
                        aria-label={`Delete ${event.title}`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Event Image */}
                  {event.image_url && (
                    <div className="w-1/3 h-full">
                      <img
                        src={event.image_url}
                        alt={`Image for ${event.title}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
