import Image from "next/image";

export default function Partners(){
    return (
        <div className="md:pt-18 md:pb-12 pt-14 pb-10">
            <div className="container">
                <h2 className="mb-5">Our Partners</h2>
                <div className="grid lg:grid-cols-6 md:grid-cols-3 grid-cols-2 gap-7">
                    <div className="p-3 border border-solid border-border">
                        <div className="pb-[50%] relative overflow-hidden">
                            <Image src="/frontend/images/partners/partner-1.png" alt="Partner 1" width={100} height={80} className="absolute top-0 left-0 w-full h-full object-contain"/>
                        </div>
                    </div>
                    <div className="p-3 border border-solid border-border">
                        <div className="pb-[50%] relative overflow-hidden">
                            <Image src="/frontend/images/partners/partner-2.png" alt="Partner 2" width={100} height={80} className="absolute top-0 left-0 w-full h-full object-contain"/>
                        </div>
                    </div>
                    <div className="p-3 border border-solid border-border">
                        <div className="pb-[50%] relative overflow-hidden">
                            <Image src="/frontend/images/partners/partner-3.png" alt="Partner 3" width={100} height={80} className="absolute top-0 left-0 w-full h-full object-contain"/>
                        </div>
                    </div>
                    <div className="p-3 border border-solid border-border">
                        <div className="pb-[50%] relative overflow-hidden">
                            <Image src="/frontend/images/partners/partner-4.png" alt="Partner 4" width={100} height={80} className="absolute top-0 left-0 w-full h-full object-contain"/>
                        </div>
                    </div>
                    <div className="p-3 border border-solid border-border">
                        <div className="pb-[50%] relative overflow-hidden">
                            <Image src="/frontend/images/partners/partner-5.png" alt="Partner 5" width={100} height={80} className="absolute top-0 left-0 w-full h-full object-contain"/>
                        </div>
                    </div>
                    <div className="p-3 border border-solid border-border">
                        <div className="pb-[50%] relative overflow-hidden">
                            <Image src="/frontend/images/partners/partner-6.png" alt="Partner 6" width={100} height={80} className="absolute top-0 left-0 w-full h-full object-contain"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}