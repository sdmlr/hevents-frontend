import { useEffect, useState } from "react";
import api from "../api";
import { Event } from "../types/Event";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

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
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(initialFormState);
  const [showForm, setShowForm] = useState(false);

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
        alert("Access denied");
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
      } else {
        // CREATE new event
        const res = await api.post("/admin/events", form);
        setEvents((prev) => [...prev, res.data.data[0]]);
      }

      // Reset state
      setForm(initialFormState);
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      console.error("Failed to submit event:", err);
      alert("Submission failed.");
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
      alert("Event deleted");
    } catch (err) {
      console.error("Failed to delete event:", err);
      alert("Delete failed");
    }
  };

  return (
    <div className="flex" role="presentation">
      {/* Sidebar */}
      <aside
        className="w-64 h-screen bg-gray-100 p-4 bg-[#f8f8f8]"
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
      <main className="flex-1 p-6 overflow-y-auto" role="main">
        {/* Sticky Expandable Form */}
        <section
          aria-labelledby="event-form-heading"
          className={`sticky bg-white p-2 shadow mb-2 rounded transition-all duration-300 ${
            showForm ? "" : "h-14 overflow-hidden"
          }`}
        >
          {/* Expand/Collapse Toggle Area */}
          <div
            onClick={() => {
              if (showForm) {
                setEditingId(null);
                setForm(initialFormState);
              }
              setShowForm(!showForm);
            }}
            className="flex justify-between items-center cursor-pointer rounded px-2 py-1"
            title={showForm ? "Collapse" : "Expand"}
            role="button"
            aria-expanded={showForm}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setShowForm(!showForm);
              }
            }}
          >
            <h2 id="event-form-heading" className="text-lg font-semibold">
              {editingId ? "Edit Event" : "Create New Event"}
            </h2>
            <span className="text-gray-500 text-xl">
              {showForm ? "▲" : "▼"}
            </span>
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
        </section>

        <section className="overflow-y-auto max-h-[calc(100vh-8rem)] pr-2">
          {loading ? (
            <p>Loading events...</p>
          ) : (
            <div className="space-y-4 grid-cols-2">
              {events.map((event) => (
                <article
                  key={event.id}
                  className="border p-4 rounded shadow-sm"
                  aria-labelledby={`event-${event.id}`}
                >
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
