import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";
import { generateCalendarLink } from "../utils/utils";
import { supabase } from "../supabase";
import { Event } from "../types/Event";

function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [allEvents, setAllEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email);
      }
    };
    fetchUser();
  }, []);
  
  useEffect(() => {
    api
      .get("/events")
      .then((res) => {
        const all = res.data;
        const found = all.find((e: Event) => e.id === id);
        setEvent(found);
        setAllEvents(all);
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
    <div className="max-w-2xl mx-auto p-6">
      <img
        src={event.image_url}
        alt={event.title}
        className="w-full h-64 object-cover rounded mb-6"
      />
      <h1 className="text-3xl font-bold text-primary mb-2">{event.title}</h1>
      <p className="text-gray-600 mb-4">{event.description}</p>
      <div className="text-sm text-gray-500 mb-6">
        <p>
          <strong>Date:</strong> {event.date}
        </p>
        <p>
          <strong>Time:</strong> {event.time}
        </p>
        <p>
          <strong>Location:</strong> {event.location}
        </p>
      </div>

      {/* Only show form if user is logged in */}
      {userEmail ? (
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            try {
              await api.post("/signups", {
                event_id: event.id,
                user_email: userEmail,
              });
              alert("You’ve successfully signed up!");
            } catch (err) {
              alert("Signup failed.");
              console.error(err);
            }
          }}
          className="mb-4"
        >
          <p className="mb-2 text-sm text-gray-600">
            You're signing up as <strong>{userEmail}</strong>
          </p>
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded"
          >
            Confirm Signup
          </button>
        </form>
      ) : (
        <div className="text-sm text-gray-500 italic mb-4">
          You need to{" "}
          <a href="/login" className="text-primary underline">
            log in
          </a>{" "}
          to sign up for this event.
        </div>
      )}

      <a
        href={generateCalendarLink(event)}
        target="_blank"
        rel="noopener noreferrer"
      >
        <button className="bg-lightBorder hover:bg-primary hover:text-white transition px-4 py-2 rounded">
          Add to Google Calendar
        </button>
      </a>

      {/* 🔍 OTHER EVENTS YOU MIGHT LIKE */}
      {event && allEvents.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">
            Other events you might like
          </h2>
          <div className="flex overflow-x-auto space-x-4 pb-2">
            {allEvents
              .filter(
                (e) => e.category === event.category && e.id !== event.id // same category, not the current event
              )
              .map((relatedEvent) => (
                <Link
                  key={relatedEvent.id}
                  to={`/events/${relatedEvent.id}`}
                  className="flex-shrink-0 w-64 bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <img
                    src={relatedEvent.image_url}
                    alt={relatedEvent.title}
                    className="w-full h-36 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">
                      {relatedEvent.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {relatedEvent.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {relatedEvent.date} at {relatedEvent.time}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default EventDetail;
