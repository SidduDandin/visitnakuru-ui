import Link from "next/link";
import Image from "next/image";


export default function Trendings(){
    return (
        <div className="lg:py-24 md:py-20 py-18">
            <div className="container">
                <h2 className="mb-4 pr-14">Trending in Nakuru</h2>
				<div className="trendings-slider-outer relative">
					<div className="trendings-slider swiper swiper-lg-4 swiper-md-2">
						<div className="swiper-wrapper">
							<div className="swiper-slide">
								<div className="relative md:pb-[140%] pb-[100%] overflow-hidden mb-5">
									<Image src="/frontend/images/trendings/1.png" alt="It is a long established fact that a reader." width={270} height={370} className="absolute top-0 left-0 w-full h-full object-cover"/>
								</div>
								<h5 className="mb-5">It is a long established fact that a reader.</h5>
								<Link href="#" className="text-primary">Read More</Link>
							</div>
							<div className="swiper-slide">
								<div className="relative md:pb-[140%] pb-[100%] overflow-hidden mb-5">
									<Image src="/frontend/images/trendings/2.png" alt="There are many variations of passages." width={270} height={370} className="absolute top-0 left-0 w-full h-full object-cover"/>
								</div>
								<h5 className="mb-5">There are many variations of passages.</h5>
								<Link href="#" className="text-primary">Read More</Link>
							</div>
							<div className="swiper-slide">
								<div className="relative md:pb-[140%] pb-[100%] overflow-hidden mb-5">
									<Image src="/frontend/images/trendings/3.png" alt="It has survived not only five centuries." width={270} height={370} className="absolute top-0 left-0 w-full h-full object-cover"/>
								</div>
								<h5 className="mb-5">It has survived not only five centuries.</h5>
								<Link href="#" className="text-primary">Read More</Link>
							</div>
							<div className="swiper-slide">
								<div className="relative md:pb-[140%] pb-[100%] overflow-hidden mb-5">
									<Image src="/frontend/images/trendings/4.png" alt="The standard chunk of Lorem Ipsum used." width={270} height={370} className="absolute top-0 left-0 w-full h-full object-cover"/>
								</div>
								<h5 className="mb-5">The standard chunk of Lorem Ipsum used.</h5>
								<Link href="#" className="text-primary">Read More</Link>
							</div>
							<div className="swiper-slide">
								<div className="relative md:pb-[140%] pb-[100%] overflow-hidden mb-5">
									<Image src="/frontend/images/trendings/2.png" alt="There are many variations of passages." width={270} height={370} className="absolute top-0 left-0 w-full h-full object-cover"/>
								</div>
								<h5 className="mb-5">There are many variations of passages.</h5>
								<Link href="#" className="text-primary">Read More</Link>
							</div>
							<div className="swiper-slide">
								<div className="relative md:pb-[140%] pb-[100%] overflow-hidden mb-5">
									<Image src="/frontend/images/trendings/3.png" alt="It has survived not only five centuries." width={270} height={370} className="absolute top-0 left-0 w-full h-full object-cover"/>
								</div>
								<h5 className="mb-5">It has survived not only five centuries.</h5>
								<Link href="#" className="text-primary">Read More</Link>
							</div>
							<div className="swiper-slide">
								<div className="relative md:pb-[140%] pb-[100%] overflow-hidden mb-5">
									<Image src="/frontend/images/trendings/4.png" alt="The standard chunk of Lorem Ipsum used." width={270} height={370} className="absolute top-0 left-0 w-full h-full object-cover"/>
								</div>
								<h5 className="mb-5">The standard chunk of Lorem Ipsum used.</h5>
								<Link href="#" className="text-primary">Read More</Link>
							</div>
						</div>
					</div>
					<div className="absolute md:-top-9 -top-7 right-0 w-auto h-auto transform -translate-y-full flex gap-8" style={{"--swiper-navigation-size": "30px"}}>
						<div className="swiper-button-prev !relative !text-primary">
							<svg width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.97776 14L2 7.55372M2 7.55372L7.97776 1M2 7.55372H18" stroke="currentcolor" strokeWidth="2"/></svg>
						</div>
						<div className="swiper-button-next !relative !text-primary">
							<svg width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.0222 14L16 7.55372M16 7.55372L10.0222 1M16 7.55372H0" stroke="currentcolor" strokeWidth="2"/></svg>
						</div>
					</div>
				</div>
            </div>
        </div>
    )
}