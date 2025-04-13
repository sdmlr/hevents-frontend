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

const EventCard = ({ event }: { event: Event }) => (
  <Link
    to={`/events/${event.id}`}
    className="flex-shrink-0 w-64 bg-white rounded-lg shadow-md overflow-hidden no-underline text-inherit mb-5"
   >
    <img
      src={event.image_url}
      alt={event.title}
      className="w-full h-36 object-cover"
    />
    <div className="p-4">
      <h3 className="text-lg font-semibold">{event.title}</h3>
      <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
      <p className="text-xs text-gray-500 mt-1">
        {event.date} at {event.time}
      </p>
    </div>
  </Link>
);

export default EventCard;
