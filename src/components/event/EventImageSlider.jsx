"use client";

import { useState } from "react";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export default function EventImageSlider({ images = [] }) {
  const validImages = Array.isArray(images) ? images : [];
  const [active, setActive] = useState(0);

  if (!validImages.length) return null;

  const prev = () =>
    setActive((i) => (i === 0 ? validImages.length - 1 : i - 1));
  const next = () =>
    setActive((i) => (i === validImages.length - 1 ? 0 : i + 1));

  return (
    <div className="w-full">

      {/* MAIN IMAGE */}
      <div className="relative w-full overflow-hidden rounded-b-[28px] bg-white">

        <img
          src={`${backendUrl}/images/events/${validImages[active].FilePath}`}
          alt=""
          className="w-full h-[520px] object-cover"
          loading="eager"
        />

        {/* ARROWS — CENTERED BOTTOM */}
        {validImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-white/90 backdrop-blur rounded-full px-3 py-2 shadow">
            <button
              onClick={prev}
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-100"
            >
              ←
            </button>
            <button
              onClick={next}
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-100"
            >
              →
            </button>
          </div>
        )}
      </div>

      {/* THUMBNAILS — OUTSIDE IMAGE */}
      {validImages.length > 1 && (
        <div className="mt-3 flex gap-2">
          {validImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`border rounded-md overflow-hidden transition
                ${
                  i === active
                    ? "border-gray-900"
                    : "border-gray-200 opacity-70 hover:opacity-100"
                }
              `}
            >
              <img
                src={`${backendUrl}/images/events/${img.FilePath}`}
                alt=""
                className="w-20 h-14 object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
