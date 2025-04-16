import { useEffect, useState } from "react";
import api from "../api";
import { Event } from "../types/Event";

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
        const res = await api.put(`/events/${editingId}`, form);
        setEvents((prev) =>
          prev.map((ev) => (ev.id === editingId ? res.data.data : ev))
        );
      } else {
        const res = await api.post("/events", form);
        setEvents((prev) => [...prev, res.data.data]);
      }
      setForm(initialFormState);
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      console.error("Failed to submit event:", err);
      alert("Submission failed.");
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 h-screen bg-gray-100 p-4 bg-[#f8f8f8]">
        <h2 className="text-xl font-bold mb-6">Staff Menu</h2>
        <nav className="space-y-4">
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
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Sticky Expandable Form */}
        <div
          className={`sticky bg-white shadow p-4 mb-1 rounded transition-all duration-300 ${
            showForm ? "" : "h-14 overflow-hidden"
          }`}
        >
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">
              {editingId ? "Edit Event" : "Create New Event"}
            </h2>
            <button
              onClick={() => {
                if (showForm) {
                  setEditingId(null);
                  setForm(initialFormState);
                }
                setShowForm(!showForm);
              }}
              className="text-gray-500 mr-2"
              title={showForm ? "Collapse" : "Expand"}
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
                <input
                  key={field}
                  type={["date", "time"].includes(field) ? field : "text"}
                  name={field}
                  value={(form as any)[field]}
                  onChange={handleChange}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  className="w-full p-2 border rounded text-sm"
                  required
                />
              ))}
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                {editingId ? "Update Event" : "Create Event"}
              </button>
            </form>
          )}
        </div>

        <div className="overflow-y-auto max-h-[calc(100vh-8rem)] pr-2">
          {loading ? (
            <p>Loading events...</p>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="border p-4 rounded shadow-sm">
                  <h3 className="text-lg font-semibold">{event.title}</h3>
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
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 px-3 py-1 text-sm rounded hover:bg-red-600"
                      onClick={async () => {
                        if (
                          confirm("Are you sure you want to delete this event?")
                        ) {
                          try {
                            await api.delete(`/events/${event.id}`);
                            setEvents(events.filter((e) => e.id !== event.id));
                            alert("Event deleted");
                          } catch (err) {
                            console.error("Failed to delete event:", err);
                            alert("Delete failed");
                          }
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
