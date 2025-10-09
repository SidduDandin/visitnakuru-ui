import Link from "next/link";
import Image from "next/image";

export default function Events(){
    return (
        <div className="py-24 dir-up bg-secondary text-white">
            <div className="container">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="md:pr-0 pr-14">Events & Activties</h2>
                    <Link href="#" className="md:inline-block hidden">View All</Link>
                </div>
                <div className="events-slider-outer relative">
                    <div className="events-slider swiper swiper-lg-4 swiper-md-2">
                        <div className="swiper-wrapper">
                            <div className="swiper-slide">
                                <div className="relative pb-[65%] overflow-hidden mb-5">
                                    <Image src="/frontend/images/events/1.png" alt="Red Rose Decoration" width={270} height={175} className="absolute top-0 left-0 w-full h-full object-cover"/>
                                </div>
                                <p className="mb-2.5">20 Aug 2025 - 10 Sep 2025</p>
                                <h5 className="mb-5">Red Rose Decoration</h5>
                                <div className="mb-3 font-light">
                                    <p className="mb-0">There are many variations of passages of Lorem Ipsum available, but the majority have suffered.</p>
                                </div>
                            </div>
                            <div className="swiper-slide">
                                <div className="relative pb-[65%] overflow-hidden mb-5">
                                    <Image src="/frontend/images/events/2.png" alt="Adventure Activities" width={270} height={175} className="absolute top-0 left-0 w-full h-full object-cover"/>
                                </div>
                                <p className="mb-2.5">20 Aug 2025 - 10 Sep 2025</p>
                                <h5 className="mb-5">Adventure Activities</h5>
                                <div className="mb-3 font-light">
                                    <p className="mb-0">There are many variations of passages of Lorem Ipsum available, but the majority have suffered.</p>
                                </div>
                            </div>
                            <div className="swiper-slide">
                                <div className="relative pb-[65%] overflow-hidden mb-5">
                                    <Image src="/frontend/images/events/3.png" alt="Dinner With Strangers" width={270} height={175} className="absolute top-0 left-0 w-full h-full object-cover"/>
                                </div>
                                <p className="mb-2.5">20 Aug 2025 - 10 Sep 2025</p>
                                <h5 className="mb-5">Dinner With Strangers</h5>
                                <div className="mb-3 font-light">
                                    <p className="mb-0">There are many variations of passages of Lorem Ipsum available, but the majority have suffered.</p>
                                </div>
                            </div>
                            <div className="swiper-slide">
                                <div className="relative pb-[65%] overflow-hidden mb-5">
                                    <Image src="/frontend/images/events/4.png" alt="Villain Academy" width={270} height={175} className="absolute top-0 left-0 w-full h-full object-cover"/>
                                </div>
                                <p className="mb-2.5">20 Aug 2025 - 10 Sep 2025</p>
                                <h5 className="mb-5">Villain Academy</h5>
                                <div className="mb-3 font-light">
                                    <p className="mb-0">There are many variations of passages of Lorem Ipsum available, but the majority have suffered.</p>
                                </div>
                            </div>
                            <div className="swiper-slide">
                                <div className="relative pb-[65%] overflow-hidden mb-5">
                                    <Image src="/frontend/images/events/2.png" alt="Adventure Activities" width={270} height={175} className="absolute top-0 left-0 w-full h-full object-cover"/>
                                </div>
                                <p className="mb-2.5">20 Aug 2025 - 10 Sep 2025</p>
                                <h5 className="mb-5">Adventure Activities</h5>
                                <div className="mb-3 font-light">
                                    <p className="mb-0">There are many variations of passages of Lorem Ipsum available, but the majority have suffered.</p>
                                </div>
                            </div>
                            <div className="swiper-slide">
                                <div className="relative pb-[65%] overflow-hidden mb-5">
                                    <Image src="/frontend/images/events/3.png" alt="Dinner With Strangers" width={270} height={175} className="absolute top-0 left-0 w-full h-full object-cover"/>
                                </div>
                                <p className="mb-2.5">20 Aug 2025 - 10 Sep 2025</p>
                                <h5 className="mb-5">Dinner With Strangers</h5>
                                <div className="mb-3 font-light">
                                    <p className="mb-0">There are many variations of passages of Lorem Ipsum available, but the majority have suffered.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 md:mt-7 md:relative absolute md:top-auto -top-7 md:right-0 right-0 md:transform-none transform -translate-y-full" style={{"--swiper-navigation-size": "18px"}}>
                        <div className="swiper-button-prev !relative !text-inherit !top-auto !left-auto !right-auto !mt-0">
                            <svg width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.97776 14L2 7.55372M2 7.55372L7.97776 1M2 7.55372H18" stroke="currentcolor" strokeWidth="2"/></svg>
                        </div>
                        <div className="swiper-button-next !relative !text-inherit !top-auto !left-auto !right-auto !mt-0">
                            <svg width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.0222 14L16 7.55372M16 7.55372L10.0222 1M16 7.55372H0" stroke="currentcolor" strokeWidth="2"/></svg>
                        </div>
                    </div>
                </div>
                <div className="md:hidden text-center mt-6">
                    <Link href="#">View All</Link>
                </div>
            </div>
        </div>
    )
}