import Link from "next/link";
import Image from "next/image";

export default function Transports(){
    return (
        <div className="pt-22 pb-24 lg:pt-30 md:pt-26 lg:pb-35 md:pb-30 dir-up bg-primary text-white">
            <div className="container">
                <h2 className="mb-5">Transport (Getting Around)</h2>
                <div className="grid md:grid-cols-3 grid-cols-1 gap-7">
                    <Link href="#" className="block mb-0">
                        <div className="relative pb-[65%] overflow-hidden mb-5">
                            <Image src="/frontend/images/transports/1.png" alt="All the Lorem Ipsum generators on the Internet tend" width={370} height={240} className="absolute top-0 left-0 w-full h-full object-cover"/>
                        </div>
                        <h5 className="mb-0">All the Lorem Ipsum generators on the Internet tend</h5>
                    </Link>
                    <Link href="#" className="block mb-0">
                        <div className="relative pb-[65%] overflow-hidden mb-5">
                            <Image src="/frontend/images/transports/2.png" alt="The first line of Lorem Ipsum, Lorem ipsum dolor sit amet" width={370} height={240} className="absolute top-0 left-0 w-full h-full object-cover"/>
                        </div>
                        <h5 className="mb-0">The first line of Lorem Ipsum, &quot;Lorem ipsum dolor sit amet &quot;</h5>
                    </Link>
                    <Link href="#" className="block mb-0">
                        <div className="relative pb-[65%] overflow-hidden mb-5">
                            <Image src="/frontend/images/transports/3.png" alt="It was popularised in the 1960s with the release of Letraset" width={370} height={240} className="absolute top-0 left-0 w-full h-full object-cover"/>
                        </div>
                        <h5 className="mb-0">It was popularised in the 1960s with the release of Letraset</h5>
                    </Link>
                </div>
            </div>
        </div>
    )
}