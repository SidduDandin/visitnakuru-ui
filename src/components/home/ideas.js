import Image from "next/image";

export default function Ideas(){
    return (
        <div className="lg:py-24 md:py-20 py-18">
            <div className="container">
                <h2 className="mb-5">Ideas and Inspire Me</h2>
                <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-col-1 gap-7">
                    <div className="mb-0">
                        <div className="relative pb-[65%] overflow-hidden mb-5">
                            <Image src="/frontend/images/ideas/1.png" alt="Famous Cultural Events in Nakuru" width={270} height={175} className="absolute top-0 left-0 w-full h-full object-cover"/>
                        </div>
                        <h5 className="mb-2.5">Famous Cultural Events in Nakuru</h5>
                        <div className="mb-3 font-light">
                            <p className="mb-0">There are many variations of passages of Lorem Ipsum available, but the majority have suffered.</p>
                        </div>
                    </div>
                    <div className="mb-0">
                        <div className="relative pb-[65%] overflow-hidden mb-5">
                            <Image src="/frontend/images/ideas/2.png" alt="The best way to spend 4 days in Nakuru" width={270} height={175} className="absolute top-0 left-0 w-full h-full object-cover"/>
                        </div>
                        <h5 className="mb-2.5">The best way to spend 4 days in Nakuru</h5>
                        <div className="mb-3 font-light">
                            <p className="mb-0">There are many variations of passages of Lorem Ipsum available, but the majority have suffered.</p>
                        </div>
                    </div>
                    <div className="mb-0">
                        <div className="relative pb-[65%] overflow-hidden mb-5">
                            <Image src="/frontend/images/ideas/3.png" alt="Nature, Fun and Events are famous in Nakuru" width={270} height={175} className="absolute top-0 left-0 w-full h-full object-cover"/>
                        </div>
                        <h5 className="mb-2.5">Nature, Fun and Events are famous in Nakuru</h5>
                        <div className="mb-3 font-light">
                            <p className="mb-0">There are many variations of passages of Lorem Ipsum available, but the majority have suffered.</p>
                        </div>
                    </div>
                    <div className="mb-0">
                        <div className="relative pb-[65%] overflow-hidden mb-5">
                            <Image src="/frontend/images/ideas/4.png" alt="Best Place to eat and drink in Nakuru" width={270} height={175} className="absolute top-0 left-0 w-full h-full object-cover"/>
                        </div>
                        <h5 className="mb-2.5">Best Place to eat and drink in Nakuru</h5>
                        <div className="mb-3 font-light">
                            <p className="mb-0">There are many variations of passages of Lorem Ipsum available, but the majority have suffered.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}