import Link from "next/link";
import Image from "next/image";

export default function Blogs(){
    return (
        <div className="md:py-12 py-9">
            <div className="container">
                <div className="flex items-center justify-between mb-5 gap-5">
                    <h2 className="mb-0">Blog Posts</h2>
                    <Link href="#" className="text-primary md:inline-block hidden">View All</Link>
                </div>
                <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-col-1 gap-7">
                    <div className="mb-0">
                        <div className="relative pb-[65%] overflow-hidden mb-5">
                            <Image src="/frontend/images/blog/1.png" alt="It is a long established fact that a reader." width={270} height={175} className="absolute top-0 left-0 w-full h-full object-cover"/>
                        </div>
                        <p className="mb-2.5 font-light">Aug 16 2025</p>
                        <h5 className="mb-2.5">It is a long established fact that a reader.</h5>
                        <Link href="#" className="text-primary">Read More</Link>
                    </div>
                    <div className="mb-0">
                        <div className="relative pb-[65%] overflow-hidden mb-5">
                            <Image src="/frontend/images/blog/2.png" alt="It is a long established fact that a reader." width={270} height={175} className="absolute top-0 left-0 w-full h-full object-cover"/>
                        </div>
                        <p className="mb-2.5 font-light">Aug 16 2025</p>
                        <h5 className="mb-2.5">It is a long established fact that a reader.</h5>
                        <Link href="#" className="text-primary">Read More</Link>
                    </div>
                    <div className="mb-0">
                        <div className="relative pb-[65%] overflow-hidden mb-5">
                            <Image src="/frontend/images/blog/3.png" alt="It is a long established fact that a reader." width={270} height={175} className="absolute top-0 left-0 w-full h-full object-cover"/>
                        </div>
                        <p className="mb-2.5 font-light">Aug 16 2025</p>
                        <h5 className="mb-2.5">It is a long established fact that a reader.</h5>
                        <Link href="#" className="text-primary">Read More</Link>
                    </div>
                    <div className="mb-0">
                        <div className="relative pb-[65%] overflow-hidden mb-5">
                            <Image src="/frontend/images/blog/4.png" alt="It is a long established fact that a reader." width={270} height={175} className="absolute top-0 left-0 w-full h-full object-cover"/>
                        </div>
                        <p className="mb-2.5 font-light">Aug 16 2025</p>
                        <h5 className="mb-2.5">It is a long established fact that a reader.</h5>
                        <Link href="#" className="text-primary">Read More</Link>
                    </div>
                    <div className="mb-0">
                        <div className="relative pb-[65%] overflow-hidden mb-5">
                            <Image src="/frontend/images/blog/5.png" alt="It is a long established fact that a reader." width={270} height={175} className="absolute top-0 left-0 w-full h-full object-cover"/>
                        </div>
                        <p className="mb-2.5 font-light">Aug 16 2025</p>
                        <h5 className="mb-2.5">It is a long established fact that a reader.</h5>
                        <Link href="#" className="text-primary">Read More</Link>
                    </div>
                    <div className="mb-0">
                        <div className="relative pb-[65%] overflow-hidden mb-5">
                            <Image src="/frontend/images/blog/6.png" alt="It is a long established fact that a reader." width={270} height={175} className="absolute top-0 left-0 w-full h-full object-cover"/>
                        </div>
                        <p className="mb-2.5 font-light">Aug 16 2025</p>
                        <h5 className="mb-2.5">It is a long established fact that a reader.</h5>
                        <Link href="#" className="text-primary">Read More</Link>
                    </div>
                    <div className="mb-0">
                        <div className="relative pb-[65%] overflow-hidden mb-5">
                            <Image src="/frontend/images/blog/7.png" alt="It is a long established fact that a reader." width={270} height={175} className="absolute top-0 left-0 w-full h-full object-cover"/>
                        </div>
                        <p className="mb-2.5 font-light">Aug 16 2025</p>
                        <h5 className="mb-2.5">It is a long established fact that a reader.</h5>
                        <Link href="#" className="text-primary">Read More</Link>
                    </div>
                    <div className="mb-0">
                        <div className="relative pb-[65%] overflow-hidden mb-5">
                            <Image src="/frontend/images/blog/8.png" alt="It is a long established fact that a reader." width={270} height={175} className="absolute top-0 left-0 w-full h-full object-cover"/>
                        </div>
                        <p className="mb-2.5 font-light">Aug 16 2025</p>
                        <h5 className="mb-2.5">It is a long established fact that a reader.</h5>
                        <Link href="#" className="text-primary">Read More</Link>
                    </div>
                </div>
                <div className="md:hidden text-center mt-6">
                    <Link href="#" className="text-primary">View All</Link>
                </div>
            </div>
        </div>
    )
}