import { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import { supabase } from "../supabase";
import EventCard from "../components/EventCard";
import { Event } from "../types/Event";
import Spinner from "../components/Spinner";

function CalendarPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userEvents, setUserEvents] = useState<Event[]>([]);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [eventsLoading, setEventsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Always fetch all events (for Explore/Recommended)
        const eventRes = await api.get("/events");
        setAllEvents(eventRes.data);

        // Fetch user and their signups (if logged in)
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setUserEmail(user?.email ?? null);
          setEventsLoading(true);

          const signupRes = await api.get(`/signups?email=${user.email}`);
          console.log("User joined events:", signupRes.data);

          setUserEvents(signupRes.data);
          setEventsLoading(false);
        } else {
          setUserEmail(null);
          setUserEvents([]);
        }
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      fetchData(); // Re-fetch on login/logout
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4" tabIndex={0}>
        My Events
      </h1>

      {loading || eventsLoading ? (
        <Spinner />
      ) : !userEmail ? (
        // Not logged in
        <div className="text-gray-600">
          <p className="mb-4">Please log in to view your calendar.</p>
          <Link
            to="/login"
            className="text-white bg-primary px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Log in
          </Link>

          <div
            className="overflow-x-auto mt-10"
            aria-label="Explore Events Carousel"
          >
            <h2 className="text-lg font-semibold mb-2">Explore Events</h2>
            <div className="flex space-x-4 w-max">
              {allEvents.slice(0, 5).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </div>
      ) : userEvents.length === 0 ? (
        // Logged in, but no joined events
        <div>
          <p className="mb-4" role="status">
            You haven't joined any events yet.
          </p>
          <div
            className="overflow-x-auto"
            aria-label="Recommended Events Carousel"
          >
            <h2 className="text-lg font-semibold mb-2">Recommended for you</h2>
            <div className="flex space-x-4 w-max">
              {allEvents.slice(0, 5).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        // Logged in, has joined events
        <div>
          <p className="mb-4 text-gray-600">
            You’ve signed up for {userEvents.length} event
            {userEvents.length > 1 && "s"}:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {userEvents
              .sort(
                (a, b) =>
                  new Date(a.date).getTime() - new Date(b.date).getTime()
              )
              .map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
          </div>
        </div>
      )}
    </main>
  );
}

export default CalendarPage;
