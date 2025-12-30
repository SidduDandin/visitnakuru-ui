"use client";

import { useState } from "react";
import Image from "next/image";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export default function EventImageSlider({ images = [], title }) {
  if (!images.length) return null;

  const sortedImages = [...images].sort(
    (a, b) => (b.IsCover ? 1 : 0) - (a.IsCover ? 1 : 0)
  );

  const [activeIndex, setActiveIndex] = useState(0);

  const activeImage = sortedImages[activeIndex];

  function prev() {
    setActiveIndex((i) => (i === 0 ? sortedImages.length - 1 : i - 1));
  }

  function next() {
    setActiveIndex((i) => (i === sortedImages.length - 1 ? 0 : i + 1));
  }

  return (
    <div className="bg-black">

      {/* MAIN IMAGE */}
      <div className="relative max-w-7xl mx-auto">
        <div className="relative w-full h-[520px] overflow-hidden rounded-b-[40px]">
          <Image
            src={`${backendUrl}/images/events/${activeImage.FilePath}`}
            alt={title}
            fill
            priority
            className="object-cover"
          />

          {/* ARROWS */}
          {sortedImages.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-4 bottom-6 bg-white/90 hover:bg-white p-3 rounded-full shadow"
              >
                ←
              </button>

              <button
                onClick={next}
                className="absolute right-4 bottom-6 bg-white/90 hover:bg-white p-3 rounded-full shadow"
              >
                →
              </button>
            </>
          )}
        </div>

        {/* THUMBNAILS */}
        {sortedImages.length > 1 && (
          <div className="flex gap-3 mt-4 px-4 overflow-x-auto">
            {sortedImages.map((img, index) => (
              <button
                key={img.ImageID || index}
                onClick={() => setActiveIndex(index)}
                className={`relative w-24 h-16 rounded overflow-hidden border-2 transition
                  ${
                    index === activeIndex
                      ? "border-yellow-500"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }
                `}
              >
                <Image
                  src={`${backendUrl}/images/events/${img.FilePath}`}
                  alt=""
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
