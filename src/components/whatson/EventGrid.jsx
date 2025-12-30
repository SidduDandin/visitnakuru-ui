import EventCard from "./EventCard";

export default function EventGrid({ events }) {
  if (!events || events.length === 0) {
    return <p>No events found.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((e) => (
        <EventCard key={e.EventID} event={e} />
      ))}
    </div>
  );
}
