import { useEffect, useState } from "react";
import api from "../api";
import { Event } from "../types/Event";
import { Link } from "react-router-dom";
import { formatDate, formatTime } from "../utils/utils";

const Browse = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    api.get("/events").then((res) => {
      setEvents(res.data);

      const uniqueCategories: string[] = Array.from(
        new Set(res.data.map((e: Event) => e.category).filter(Boolean))
      );
      
      setCategories(uniqueCategories);
    });
  }, []);

  // Filtered list
  const filtered = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.location.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "" || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Browse Events</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search events..."
          className="w-full sm:w-1/2 border p-2 rounded text-sm"
          aria-label="Search events"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full sm:w-1/4 border p-2 rounded text-sm"
          aria-label="Filter by category"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500">No events found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((event) => (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              className="block border border-gray-300 rounded shadow hover:shadow-md transition overflow-hidden"
            >
              {event.image_url && (
                <img
                  src={event.image_url}
                  alt={`Image for ${event.title}`}
                  className="w-full h-40 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold">{event.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {event.description}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                {formatDate(event.date)} at {formatTime(event.time)} • {event.location}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
};

export default Browse;
