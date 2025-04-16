import { useEffect, useState } from "react";
import api from "../api";
import { Event } from "../types/Event";

function AdminDashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    image_url: "",
    category: "",
  });

  const initialFormState = {
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    image_url: "",
    category: "",
  };
  

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
          prev.map((e) => (e.id === editingId ? res.data.data : e))
        );
        alert("Event updated!");
      } else {
        const res = await api.post("/events", form);
        setEvents((prev) => [...prev, res.data.data]);
        alert("Event created!");
      }
  
      setForm(initialFormState);
      setEditingId(null);
    } catch (err) {
      console.error("Failed to save event:", err);
      alert("Error saving event.");
    }
  };
  
  
  return (
    <div className="flex">
    {/* Sidebar */}
    <aside className="w-64 h-screen bg-gray-100 p-4">
      <h2 className="text-xl font-bold mb-6">Staff Menu</h2>
      <nav className="space-y-4">
        <a href="#" className="text-primary">Dashboard</a> <br/>
        <a href="#" className="text-gray-600">Manage Users</a>
      </nav>
    </aside>

      {loading ? (
        <p>Loading events...</p>
      ) : (
        <div className="space-y-4">
          <div className="mb-8 border p-4 rounded shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Create New Event</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const res = await api.post("/events", form);
                  setEvents((prev) => [...prev, res.data.data]);
                  setForm({
                    title: "",
                    description: "",
                    date: "",
                    time: "",
                    location: "",
                    image_url: "",
                    category: "",
                  });
                  alert("Event created!");
                } catch (err) {
                  console.error("Failed to create event:", err);
                  alert("Failed to create event.");
                }
              }}
              className="space-y-4"
            >
              {[
                "title",
                "description",
                "date",
                "time",
                "location",
                "image_url",
                "category",
              ].map((field) => 
                ["date", "time"].includes(field) ? (
                    <input
                      key={field}
                      type={field}
                      name={field}
                      value={(form as any)[field]}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  ) : (
                    <input
                      key={field}
                      type="text"
                      name={field}
                      value={(form as any)[field]}
                      onChange={handleChange}
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                      className="w-full p-2 border rounded"
                      required
                    />
                  )
                )}
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Create Event
              </button>
            </form>
          </div>

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
                    setForm({ ...event }); // preload form with this event's data
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
  );
}

export default AdminDashboard;
