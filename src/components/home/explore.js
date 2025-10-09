import Image from "next/image";

export default function Explore(){
    return (
        <div className="dir-down lg:py-24 md:py-20 py-18 bg-primary text-white">
            <div className="container">
                <h2 className="mb-5">Explore Nakuru</h2>
                <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-col-1 gap-7">
                    <div className="mb-0">
                        <div className="relative pb-[65%] overflow-hidden mb-5">
                            <Image src="/frontend/images/explore/1.png" alt="Tour Operators" width={270} height={175} className="absolute top-0 left-0 w-full h-full object-cover"/>
                        </div>
                        <h5 className="mb-2.5">Tour Operators</h5>
                        <p className="mb-0">Verified local and global safari experts</p>
                    </div>
                    <div className="mb-0">
                        <div className="relative pb-[65%] overflow-hidden mb-5">
                            <Image src="/frontend/images/explore/2.png" alt="Travel Agencies" width={270} height={175} className="absolute top-0 left-0 w-full h-full object-cover"/>
                        </div>
                        <h5 className="mb-2.5">Travel Agencies</h5>
                        <p className="mb-0">Curated packages for every traveller</p>
                    </div>
                    <div className="mb-0">
                        <div className="relative pb-[65%] overflow-hidden mb-5">
                            <Image src="/frontend/images/explore/3.png" alt="Car Rentals" width={270} height={175} className="absolute top-0 left-0 w-full h-full object-cover"/>
                        </div>
                        <h5 className="mb-2.5">Car Rentals</h5>
                        <p className="mb-0">Self-drive, chauffeur, & 4x4 safari vehicles</p>
                    </div>
                    <div className="mb-0">
                        <div className="relative pb-[65%] overflow-hidden mb-5">
                            <Image src="/frontend/images/explore/4.png" alt="Adventure Safaris" width={270} height={175} className="absolute top-0 left-0 w-full h-full object-cover"/>
                        </div>
                        <h5 className="mb-2.5">Adventure Safaris</h5>
                        <p className="mb-0">Lake Nakuru, Menengai Crater & beyond</p>
                    </div>
                </div>
            </div>
        </div>
    )
}