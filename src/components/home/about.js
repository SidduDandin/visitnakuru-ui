"use client";

import { useState } from "react";
import Link from "next/link";

export default function About() {
  	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<div className="md:pt-14 md:pb-5 pt-9 pb-2">
			<div className="container">
				<div className="max-w-[800px] mx-auto text-center">
					<h2 className="mb-3">Karibu Nakuru!</h2>
					{/* <p className="mb-4 md:text-[24px] text-[20px] font-normal">Your gateway to nature, fun and events</p> */}
					<div className={`toggle-content [&_a]:underline md:text-[20px] text-[16px] ${isExpanded ? "block" : "line-clamp-3"}`}>
						<p>Visiting for the first time or returning? Nakuru promises an experience that is both memorable and unparalleled.</p>
						<p>Nakuru is distinguished as one of Kenya&apos;s most unique cities due to its rare combination of natural beauty, rich culture, strategic location, and vibrant urban energy—all within one destination. Situated in the heart of the Great Rift Valley, it offers stunning landscapes, a dynamic cultural scene, and exceptional hospitality in perfect balance.</p>
						<p>Marvel at the iconic flamingos of <strong><Link href="#">Lake Nakuru National Park</Link></strong>, hike the majestic <strong><Link href="#">Menengai Crater</Link></strong>, or feel the adrenaline of the <strong><Link href="#">World Rally Championship</Link></strong>. Visit the blooming flower farms that have made Nakuru a global hub for romantic flower exports, and soak in the magic of this dynamic county.</p>
						<p>Planning a <strong>weekend getaway, <Link href="#">family holiday</Link>, <Link href="#">youth getaway</Link>, <Link href="#">Group Chamas</Link></strong>, or a <Link href="#"><strong>business retreat</strong></Link>? You&apos;ll find just what you need here. Explore <Link href="#">What&apos;s On</Link> calendar of events to catch the latest festivals, sports, events, and <strong>conferences</strong>. Looking for the perfect place to stay? Browse <strong>Where to Stay</strong> for everything from lakeside <strong>lodges</strong> and <strong>boutique</strong> hotels to budget <strong>hostels, Airbnb, serviced apartments</strong> and <strong>homestays</strong>, and executive suites tailored for business or leisure.</p>
						<p>Want to experience Nakuru like a local? Check out our <strong>Shopping, nyama choma joints</strong>, and <strong>Restaurants</strong> guide &ndash; from bustling markets and artisanal shops to <strong>modern</strong> malls and a rich blend of Kenyan and international cuisine. Need inspiration? Design your perfect trip using <strong><span className="text-primary">Inspire Me</span></strong> <span className="text-secondary">create description and format</span> and <strong>Things to</strong> do pages.</p>
						<p><strong>Your Nakuru story starts here &ndash; let&apos;s make it unforgettable.</strong></p>
					</div>
					<button type="button" className="bg-trans text-primary p-0 m-0 font-semibold" onClick={() => setIsExpanded(!isExpanded)}>{isExpanded ? "Read Less" : "Read More"}</button>
				</div>
			</div>
		</div>
	)
}