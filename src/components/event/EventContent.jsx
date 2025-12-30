export default function EventContent({ event }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold mb-4">
        About this event
      </h2>

      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{
          __html: event.FullDesc || event.Description || "",
        }}
      />
    </div>
  );
}
