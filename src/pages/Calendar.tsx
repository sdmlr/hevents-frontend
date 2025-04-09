import { useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image_url: string;
};

function CalendarPage() {
  const [email, setEmail] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSignups = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/signups/by-email`, {
        params: { email },
      });
      setEvents(res.data);
    } catch (err) {
      alert("Failed to load your events.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">My Events</h1>

      <div className="flex items-center gap-2 mb-6">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border px-3 py-2 rounded w-full max-w-xs"
        />
        <button
          onClick={fetchSignups}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          View
        </button>
      </div>

      {loading ? <p>Loading...</p> : null}

      {events.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-4">
          {events.map((event) => (
            <Link to={`/events/${event.id}`} key={event.id}>
              <div className="bg-white p-4 rounded-lg shadow-md h-[400px] flex flex-col justify-between">
                {event.image_url && (
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="h-36 w-full object-cover rounded mb-2"
                  />
                )}
                <h3 className="text-lg font-semibold">{event.title}</h3>
                <p className="text-sm text-gray-600">{event.description}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {event.date} @ {event.time}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        !loading && <p>No events found for this email.</p>
      )}
    </div>
  );
}

export default CalendarPage;
