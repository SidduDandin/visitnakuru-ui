import Link from "next/link";
import Image from "next/image";

export default function Visitor(){
    return (
        <div className="lg:py-24 md:py-20 py-18">
            <div className="container">
                <div className="flex items-center justify-between mb-5">
                    <h2>Visitor Information</h2>
                    <Link href="#" className="text-primary md:inline-block hidden">View All</Link>
                </div>
                <div className="grid md:grid-cols-3 grid-cols-1 gap-7">
                    <Link href="#" className="block mb-0">
                        <div className="relative pb-[65%] overflow-hidden mb-5">
                            <Image src="/frontend/images/visitor/1.png" alt="Maps" width={370} height={240} className="absolute top-0 left-0 w-full h-full object-cover"/>
                        </div>
                        <h5 className="mb-0">Maps</h5>
                    </Link>
                    <Link href="#" className="block mb-0">
                        <div className="relative pb-[65%] overflow-hidden mb-5">
                            <Image src="/frontend/images/visitor/2.png" alt="Getting Around" width={370} height={240} className="absolute top-0 left-0 w-full h-full object-cover"/>
                        </div>
                        <h5 className="mb-0">Getting Around</h5>
                    </Link>
                    <Link href="#" className="block mb-0">
                        <div className="relative pb-[65%] overflow-hidden mb-5">
                            <Image src="/frontend/images/visitor/3.png" alt="TransPennine Express" width={370} height={240} className="absolute top-0 left-0 w-full h-full object-cover"/>
                        </div>
                        <h5 className="mb-0">TransPennine Express</h5>
                    </Link>
                </div>
                <div className="md:hidden text-center mt-8">
                    <Link href="#" className="text-primary">View All</Link>
                </div>
            </div>
        </div>
    )
}