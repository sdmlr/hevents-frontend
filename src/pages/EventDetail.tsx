import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";
import { generateCalendarLink } from "../utils/utils";
import { supabase } from "../supabase";

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
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
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
    <div className="max-w-2xl mx-auto p-6">
      <img
        src={event.image_url}
        alt={event.title}
        className="w-full h-64 object-cover rounded mb-6"
      />
      <h1 className="text-3xl font-bold text-primary mb-2">{event.title}</h1>
      <p className="text-gray-600 mb-4">{event.description}</p>
      <div className="text-sm text-gray-500 mb-6">
        <p><strong>Date:</strong> {event.date}</p>
        <p><strong>Time:</strong> {event.time}</p>
        <p><strong>Location:</strong> {event.location}</p>
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
          <p className="mb-2 text-sm text-gray-600">You're signing up as <strong>{userEmail}</strong></p>
          <button type="submit" className="bg-primary text-white px-4 py-2 rounded">
            Confirm Signup
          </button>
        </form>
      ) : (
        <div className="text-sm text-gray-500 italic mb-4">
          You need to <a href="/login" className="text-primary underline">log in</a> to sign up for this event.
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
    </div>
  );
};


export default EventDetail;
