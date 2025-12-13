"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Explore() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const [explores, setExplores] = useState([]);

  // --------------------------------------
  // HELPERS
  // --------------------------------------
  const truncate = (text = "", limit = 70) => {
    if (!text) return "";
    return text.length > limit ? text.slice(0, limit).trim() + "..." : text;
  };

  // --------------------------------------
  // FETCH + SORT (LATEST FIRST)
  // --------------------------------------
  useEffect(() => {
    const fetchExplore = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/explore/list`);
        if (!res.ok) throw new Error("Failed to fetch explore");

        const data = await res.json();

        // sort by createdAt DESC (latest first)
        const sorted = [...data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setExplores(sorted.slice(0, 4)); // show only 4 items
      } catch (err) {
        console.error("Explore fetch error:", err);
      }
    };

    fetchExplore();
  }, [backendUrl]);

  if (!explores.length) return null;

  return (
    <div className="dir-down lg:py-24 md:py-20 py-18 bg-primary text-white">
      <div className="container">
        <div className="flex items-center justify-between mb-5">
          <h2>Explore Nakuru</h2>
          <Link href="#" className="md:inline-block hidden">
            View All
          </Link>
        </div>

        <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-col-1 gap-7">
          {explores.map((item) => {
            const imageSrc = item.bannerImage
              ? `${backendUrl}/images/Explore/${item.bannerImage}`
              : "/frontend/images/placeholder.jpg";

            return (
              <Link
                key={item.id}
                // href={`/explore/${item.slug}`}
                href="#"
                className="block"
              >
                <div className="relative pb-[65%] overflow-hidden mb-5">
                  <Image
                    src={imageSrc}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                </div>

                <h5 className="mb-2.5">
                  {truncate(item.title, 22)}
                </h5>

                <p className="mb-3 font-light">
                  {truncate(item.shortDesc, 80)}
                </p>
                
              </Link>
              
            );
          })}
        </div>
      </div>
    </div>
  );
}
