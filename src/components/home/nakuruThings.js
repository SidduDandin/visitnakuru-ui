import Link from "next/link";
import Image from "next/image";

export default function NakuruThings(){
    return (
        <div className="lg:py-24 md:py-20 py-18 bg-secondary dir-up text-white">
            <div className="container">
                <div className="flex items-center justify-between mb-5">
                    <h2>Things to do in Nakuru</h2>
                    <Link href="#" className="md:inline-block hidden">View All</Link>
                </div>
                <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-col-1 gap-7">
                    <div className="mb-0">
                        <div className="relative pb-[65%] overflow-hidden mb-5">
                            <Image src="/frontend/images/things/1.png" alt="It is a long established fact that a reader." width={270} height={175} className="absolute top-0 left-0 w-full h-full object-cover"/>
                        </div>
                        <h5 className="mb-2.5">It is a long established fact that a reader.</h5>
                        <div className="mb-3 font-light">
                            <p className="mb-0">There are many variations of passages of Lorem Ipsum available, but the majority have suffered.</p>
                        </div>
                        <Link href="#">Read More</Link>
                    </div>
                    <div className="mb-0">
                        <div className="relative pb-[65%] overflow-hidden mb-5">
                            <Image src="/frontend/images/things/2.png" alt="The standard chunk of Lorem Ipsum used." width={270} height={175} className="absolute top-0 left-0 w-full h-full object-cover"/>
                        </div>
                        <h5 className="mb-2.5">The standard chunk of Lorem Ipsum used.</h5>
                        <div className="mb-3 font-light">
                            <p className="mb-0">There are many variations of passages of Lorem Ipsum available, but the majority have suffered.</p>
                        </div>
                        <Link href="#">Read More</Link>
                    </div>
                    <div className="mb-0">
                        <div className="relative pb-[65%] overflow-hidden mb-5">
                            <Image src="/frontend/images/things/3.png" alt="It uses a dictionary of over 200 Latin words." width={270} height={175} className="absolute top-0 left-0 w-full h-full object-cover"/>
                        </div>
                        <h5 className="mb-2.5">It uses a dictionary of over 200 Latin words.</h5>
                        <div className="mb-3 font-light">
                            <p className="mb-0">There are many variations of passages of Lorem Ipsum available, but the majority have suffered.</p>
                        </div>
                        <Link href="#">Read More</Link>
                    </div>
                    <div className="mb-0">
                        <div className="relative pb-[65%] overflow-hidden mb-5">
                            <Image src="/frontend/images/things/4.png" alt="It has survived not only five centuries." width={270} height={175} className="absolute top-0 left-0 w-full h-full object-cover"/>
                        </div>
                        <h5 className="mb-2.5">It has survived not only five centuries.</h5>
                        <div className="mb-3 font-light">
                            <p className="mb-0">There are many variations of passages of Lorem Ipsum available, but the majority have suffered.</p>
                        </div>
                        <Link href="#">Read More</Link>
                    </div>
                </div>
                <div className="md:hidden text-center mt-6">
                    <Link href="#">View All</Link>
                </div>
            </div>
        </div>
    )
}