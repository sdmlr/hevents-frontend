import { useEffect, useState } from "react";
import api from "../api";

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image_url: string; // <- add this
};

function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/events")
      .then((res) => {
        console.log("Events from backend:", res.data); // 👈 See what you're getting
        setEvents(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again.");
        setLoading(false);
      });
  }, []);

  if (!loading && events.length === 0) {
    return <p>No events found.</p>;
  }

  if (loading) return <p>Loading events...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Upcoming Events</h1>
      {events.map((event) => (
        <div
          key={event.id}
          style={{
            border: "1px solid #ccc",
            padding: "1rem",
            marginBottom: "1rem",
          }}
        >
          {event.image_url && (
            <img
              src={event.image_url}
              alt={event.title}
              style={{
                width: "100%",
                height: "auto",
                marginBottom: "1rem",
                borderRadius: "8px",
              }}
            />
          )}
          <h2>{event.title}</h2>
          <p>{event.description}</p>
          <p>
            <strong>Date:</strong> {event.date}
            <br />
            <strong>Time:</strong> {event.time}
            <br />
            <strong>Location:</strong> {event.location}
          </p>
        </div>
      ))}
    </div>
  );
}

export default Events;
