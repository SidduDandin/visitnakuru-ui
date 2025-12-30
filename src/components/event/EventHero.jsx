import Image from "next/image";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export default function EventHero({ event }) {
  const cover =
    event.images?.find((i) => i.IsCover) || event.images?.[0];

  if (!cover) return null;

  return (
    <div className="relative w-full h-[420px]">
      <Image
        src={`${backendUrl}/images/events/${cover.FilePath}`}
        alt={event.Title}
        fill
        priority
        className="object-cover"
      />
    </div>
  );
}
