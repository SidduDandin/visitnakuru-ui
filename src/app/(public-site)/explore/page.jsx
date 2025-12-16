import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

// ----------------------------------
// FETCH EXPLORE LIST
// ----------------------------------
async function getExploreList() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/explore/list`,
    { cache: "no-store" }
  );

  if (!res.ok) throw new Error("Failed to fetch explore list");

  const data = await res.json();

  // newest first
  return data.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
}

// ----------------------------------
// HELPERS
// ----------------------------------
const truncate = (text = "", max = 80) =>
  text.length > max ? text.slice(0, max) + "…" : text;

// ----------------------------------
// PAGE
// ----------------------------------
export default async function ExplorePage() {
  const explores = await getExploreList();

  const heroImage =
    explores.length > 0 && explores[0].bannerImage
      ? `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/images/Explore/${explores[0].bannerImage}`
      : "/frontend/images/explore/hero.jpg";

  return (
    <div className="bg-white text-black">

      {/* ================= HERO ================= */}
     <section className="relative w-full">
             {/* FULL WIDTH IMAGE — NO CROP, NO SCROLL */}
             <div className="relative w-full">
               <Image
                 src={heroImage}
                 alt="/frontend/images/placeholder.jpg"                
                 width={1920}
                 height={1080}
                 priority
                 className="w-full h-auto block"
               />
             </div>
     
          
           </section>

      {/* ================= INTRO ================= */}
      <div className="container max-w-4xl py-16">
        <nav className="mb-4 text-sm flex items-center gap-2">
          <Link href="/" className="font-semibold hover:underline">
            Home
          </Link>
          <span>|</span>
          <Link href="/explore" className="font-semibold hover:underline">
            Things To Do
          </Link>
          <span>|</span>
          <span>Explore Nakuru</span>
        </nav>

        <h1 className="mb-4">Explore Nakuru</h1>

        <p className="text-gray-600 leading-relaxed">
         {explores[0].shortDesc}
        </p>
      </div>

      {/* ================= GRID ================= */}
      <div className="container pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">

          {explores.map((item) => (
            <Link
              key={item.id}
              href={`/explore/${item.slug}`}
              className="block"
            >
              {/* IMAGE */}
              <div className="relative w-full aspect-[328.75/219.97] overflow-hidden mb-4">
                <Image
                  src={`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/images/Explore/${item.bannerImage}`}
                  alt={item.title}
                  fill
                  className="object-cover"
                  loading="lazy"
                />
              </div>

              {/* TITLE */}
              <h5 className="mb-2 text-lg font-semibold">
                {truncate(item.title, 32)}
              </h5>

              {/* DESCRIPTION */}
              <p className="text-sm text-gray-600 leading-relaxed mb-2">
                {truncate(item.shortDesc, 90)}
              </p>

              {/* READ MORE */}
              <span className="text-sm font-semibold underline text-primary">
                Read More
              </span>
            </Link>
          ))}

        </div>
      </div>
    </div>
  );
}
