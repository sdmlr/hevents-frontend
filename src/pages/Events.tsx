import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image_url: string;
  category: string; // make sure events have a category field
};

const Home = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Define your categories
  const categories = ["Party", "Experiences", "Workshop", "Networking"];

  useEffect(() => {
    api
      .get("/events")
      .then((res) => {
        console.log("Events fetched:", res.data);
        setEvents(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again later.");
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {/* HERO SECTION */}
      <section className="bg-primary text-white text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold">Welcome to Hevents</h1>
        <p className="mt-4 text-lg md:fbtext-xl">
          Discover and join amazing community events around you.
        </p>
        <Link
          to="/events"
          className="mt-6 inline-block px-6 py-3 bg-white text-brand font-semibold rounded-lg hover:bg-gray-100 transition"
        >
          Explore Events
        </Link>
      </section>

      {/* EVENTS SECTION */}
      <section className="container mx-auto px-4 py-8">
        {loading && <p className="text-center">Loading events...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading &&
          !error &&
          categories.map((category) => {
            // Filter events by current category
            const filteredEvents = events.filter(
              (event) => event.category === category
            );
            if (filteredEvents.length === 0) return null;
            return (
              <div key={category} className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">{category}</h2>
                <div className="flex overflow-x-auto space-x-4">
                  {filteredEvents.map((event) => (
                    <Link
                      key={event.id}
                      to={`/events/${event.id}`}
                      className="no-underline text-inherit"
                    >
                      <div className="w-64 h-[300px] bg-white rounded-lg shadow-md flex flex-col justify-between flex-shrink-0 mb-2 ml-2">
                        {event.image_url && (
                          <img
                            src={event.image_url}
                            alt={event.title}
                            className="w-full h-36 object-cover rounded-t mb-2"
                          />
                        )}
                        <div className="p-4 flex-grow">
                          <h3 className="text-lg font-semibold">
                            {event.title}
                          </h3>
                          <p className="text-sm text-gray-700 line-clamp-3">
                            {event.description}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            <strong>{event.date}</strong> at {event.time}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
      </section>
    </div>
  );
};

export default Home;
