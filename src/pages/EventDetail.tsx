import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";
import { formatDate, formatTime, generateCalendarLink } from "../utils/utils";
import { supabase } from "../supabase";
import { Event } from "../types/Event";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";

function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [alreadySignedUp, setAlreadySignedUp] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user?.email ?? null);

        // Check if already signed up
        try {
          const { data: joinedEvents } = await api.get(
            `/signups?email=${user.email}`
          );

          const found = joinedEvents.some((ev: Event) => ev.id === id);
          setAlreadySignedUp(found);
        } catch (err) {
          console.error("Failed to fetch signups", err);
        }
      }
    };
    fetchUser();
  }, [id]);

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

  if (loading) return <Spinner />;
  if (error) return <p>{error}</p>;
  if (!event) return <p>Event not found</p>;

  return (
    <main
      className="max-w-2xl mx-auto p-6"
      aria-labelledby="event-detail-heading"
    >
      <img
        src={event.image_url}
        alt={`Image for ${event.title}`}
        className="w-full h-64 object-cover rounded mb-6"
      />
      <h1
        id="event-detail-heading"
        className="text-3xl font-bold text-primary mb-2"
      >
        {event.title}
      </h1>
      <p className="text-gray-600 mb-4">{event.description}</p>
      <section
        aria-label="Event details"
        className="text-sm text-gray-500 mb-6"
      >
        <p>
          <strong>Date:</strong> {formatDate(event.date)}
        </p>
        <p>
          <strong>Time:</strong> {formatTime(event.time)}
        </p>
        <p>
          <strong>Location:</strong> {event.location}
        </p>
      </section>

      {/* Only show form if user is logged in */}
      {userEmail ? (
        alreadySignedUp ? (
          <p className="text-sm text-green-600 font-medium mb-4">
            You’ve already signed up for this event.
          </p>
        ) : (
          <form
            onSubmit={async (e) => {
              e.preventDefault();

              try {
                await api.post("/signups", {
                  event_id: event.id,
                  user_email: userEmail,
                });
                toast.success("You’ve successfully signed up!");

                // Re-fetch joined events
                const { data: joinedEvents } = await api.get(
                  `/signups?email=${userEmail}`
                );
                const found = joinedEvents.some((ev: Event) => ev.id === id);
                setAlreadySignedUp(found);
              } catch (err) {
                toast.error("Signup failed.");
                console.error(err);
              }
            }}
            aria-label="Signup form"
            className="mb-4"
          >
            <p className="mb-2 text-sm text-gray-600">
              You're signing up as <strong>{userEmail}</strong>
            </p>
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded"
            >
              Sign Up
            </button>
          </form>
        )
      ) : (
        <div className="text-sm text-gray-500 italic mb-4">
          You need to{" "}
          <Link to="/login" className="text-primary underline" role="link">
            log in
          </Link>{" "}
          to sign up for this event.
        </div>
      )}

      <a
        href={generateCalendarLink(event)}
        target="_blank"
        rel="noopener noreferrer"
      >
        <button
          type="button"
          className="bg-lightBorder hover:bg-primary hover:text-white transition px-4 py-2 rounded"
        >
          Add to Google Calendar
        </button>
      </a>

      {/* 🔍 OTHER EVENTS YOU MIGHT LIKE */}
      {event && allEvents.length > 0 && (
        <section className="mt-12" aria-labelledby="related-events-heading">
          <h2
            id="related-events-heading"
            className="text-xl font-semibold mb-4"
          >
            Other events you might like
          </h2>
          <div className="flex overflow-x-auto space-x-4 pb-2">
            {allEvents
              .filter(
                (e) => e.category === event.category && e.id !== event.id // same category, not the current event
              )
              .map((relatedEvent) => (
                <article
                  key={relatedEvent.id}
                  aria-labelledby={`related-event-${relatedEvent.id}`}
                  className="flex-shrink-0 w-64 bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <Link
                    key={relatedEvent.id}
                    to={`/events/${relatedEvent.id}`}
                    className="block no-underline text-inherit"
                  >
                    <img
                      src={relatedEvent.image_url}
                      alt={`Image for ${relatedEvent.title}`}
                      className="w-full h-36 object-cover"
                    />
                    <div className="p-4">
                      <h3
                        id={`related-event-${relatedEvent.id}`}
                        className="text-lg font-semibold"
                      >
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
                </article>
              ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default EventDetail;
