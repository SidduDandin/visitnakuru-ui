import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

// ----------------------------------
// FETCH BY SLUG
// ----------------------------------
async function getExploreBySlug(slug) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/explore/slug/${slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;
  return res.json();
}

// ----------------------------------
// PAGE
// ----------------------------------
export default async function ExploreDetailPage({ params }) {
  const explore = await getExploreBySlug(params.slug);
  if (!explore) return notFound();

  const heroImage = explore.bannerImage
    ? `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/images/Explore/${explore.bannerImage}`
    : "/frontend/images/explore/hero.jpg";

  return (
    <div className="bg-white text-black overflow-x-hidden">
      {/* ================= HERO ================= */}
      <section className="relative w-full">
        {/* FULL WIDTH IMAGE — NO CROP, NO SCROLL */}
        <div className="relative w-full">
          <Image
            src={heroImage}
            alt={explore.title}
            width={1920}
            height={1080}
            priority
            unoptimized
            className="w-full h-auto block"
          />
        </div>

        {/* WHITE CURVED PANEL (LEFT ONLY) */}
        <div
          className="
            absolute bottom-0 left-0
            w-[340px]
            bg-white
            px-7 py-7
            rounded-tr-[48px]
          "
        >
          <h3 className="text-lg font-semibold mb-1">
            {explore.title}
          </h3>

          <Link
            href="#content"
            className="text-sm font-medium underline underline-offset-4"
          >
            Read More
          </Link>
        </div>
      </section>

      {/* ================= BREADCRUMB ================= */}
      <nav className="container max-w-6xl pt-14 text-sm text-gray-500">
        <div className="flex flex-wrap gap-1">
          <Link href="/" className="hover:underline font-semibold text-black">
            Home
          </Link>
          <span>|</span>
          <Link href="#" className="hover:underline font-semibold text-black">
            Things To Do
          </Link>
          <span>|</span>
          <Link
            href="/explore"
            className="hover:underline font-semibold text-black"
          >
            Explore Nakuru
          </Link>
          <span>|</span>
          <span className="font-medium">{explore.title}</span>
        </div>
      </nav>

      {/* ================= CONTENT ================= */}
      <section
        id="content"
        className="container max-w-4xl pt-14 pb-24"
      >
        <h1 className="text-3xl md:text-4xl font-semibold mb-8">
          Explore {explore.title}
        </h1>

        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: explore.content }}
        />
      </section>
    </div>
  );
}
