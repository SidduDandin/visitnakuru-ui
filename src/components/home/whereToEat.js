import Link from "next/link";
import Image from "next/image";

export default function WhereToEat(){
    return (
        <div className="lg:pt-24 md:pt-20 pt-18 lg:pb-12 md:pb-10 pb-9">
            <div className="container">
                <div className="flex items-center justify-between mb-5">
                    <h2>Where to eat in Nakuru ?</h2>
                    <Link href="#" className="text-primary md:inline-block hidden">View All</Link>
                </div>
                <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-col-1 gap-7">
                    <div className="mb-0">
                        <div className="relative pb-[65%] overflow-hidden mb-5">
                            <Image src="/frontend/images/eat/1.png" alt="Java House Nakuru" width={270} height={175} className="absolute top-0 left-0 w-full h-full object-cover"/>
                        </div>
                        <h5 className="mb-2.5">Java House Nakuru</h5>
                        <Link href="#" className="text-primary font-semibold">Read More</Link>
                    </div>
                    <div className="mb-0">
                        <div className="relative pb-[65%] overflow-hidden mb-5">
                            <Image src="/frontend/images/eat/2.png" alt="Taidy’s Restaurant" width={270} height={175} className="absolute top-0 left-0 w-full h-full object-cover"/>
                        </div>
                        <h5 className="mb-2.5">Taidy’s Restaurant</h5>
                        <Link href="#" className="text-primary font-semibold">Read More</Link>
                    </div>
                    <div className="mb-0">
                        <div className="relative pb-[65%] overflow-hidden mb-5">
                            <Image src="/frontend/images/eat/3.png" alt="Culture Mambo Lounge" width={270} height={175} className="absolute top-0 left-0 w-full h-full object-cover"/>
                        </div>
                        <h5 className="mb-2.5">Culture Mambo Lounge</h5>
                        <Link href="#" className="text-primary font-semibold">Read More</Link>
                    </div>
                    <div className="mb-0">
                        <div className="relative pb-[65%] overflow-hidden mb-5">
                            <Image src="/frontend/images/eat/4.png" alt="Merica Hotel" width={270} height={175} className="absolute top-0 left-0 w-full h-full object-cover"/>
                        </div>
                        <h5 className="mb-2.5">Merica Hotel</h5>
                        <Link href="#" className="text-primary font-semibold">Read More</Link>
                    </div>
                </div>
                <div className="md:hidden text-center mt-6">
                    <Link href="#" className="text-primary">View All</Link>
                </div>
            </div>
        </div>
    )
}