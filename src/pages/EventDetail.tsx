import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";
import { generateCalendarLink } from "../utils/utils";

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image_url: string;
};

function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/events")
      .then((res) => {
        const found = res.data.find((e: Event) => e.id === id);
        setEvent(found);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching event:", err);
        setError("Failed to load event.");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!event) return <p>Event not found</p>;

  return (
    <div style={{ padding: "1rem" }}>
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
      <h1 className="font-bold text-6xl bg-amber-600">{event.title}</h1>
      <p><strong>Date:</strong> {event.date}</p>
      <p><strong>Time:</strong> {event.time}</p>
      <p><strong>Location:</strong> {event.location}</p>
      <p>{event.description}</p>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const email = (e.target as HTMLFormElement).email.value;

          try {
            await api.post("/signups", {
              event_id: event.id,
              user_email: email,
            });
            alert("Signed up!");
          } catch (err) {
            alert("Signup failed");
            console.error(err);
          }
        }}
      >
        <input
          type="email"
          name="email"
          placeholder="Your email"
          required
        />
        <button type="submit" style={{ marginTop: "0.5rem" }}>
          Sign up
        </button>
      </form>

      <a
        href={generateCalendarLink(event)}
        target="_blank"
        rel="noopener noreferrer"
      >
        <button style={{ marginTop: "1rem" }}>
          Add to Google Calendar
        </button>
      </a>
    </div>
  );
}

export default EventDetail;
