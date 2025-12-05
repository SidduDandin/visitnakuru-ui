// import Image from "next/image";
// import Link from "next/link";

// import SwiperInit from '@/components/SwiperInit';

export default function Banner(){
    return (
        <div className="hero-banner">
            <div className="hero-banner-slider swiper">
                <div className="swiper-wrapper">
                    <div className="swiper-slide">
                        <div className="bg-cover bg-no-repeat bg-center md:min-h-[550px] min-h-[450px] flex items-center justify-center py-7 px-10 before:content-[''] before:absolute before:top-0 before:left-0 before:w-[100%] before:h-[100%] before:bg-black before:opacity-25 text-white text-center" style={{ "backgroundImage" : "url(/frontend/images/banner/banner-1.png)"}}>
                            <div className="container relative z-10">
                                <div className="max-w-[970px] mx-auto">
                                    <h1 className="m-0">Your gateway to <br />nature, fun and events</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="swiper-slide">
                        <div className="bg-cover bg-no-repeat bg-center md:min-h-[550px] min-h-[450px] flex items-center justify-center py-7 px-10 before:content-[''] before:absolute before:top-0 before:left-0 before:w-[100%] before:h-[100%] before:bg-black before:opacity-25 text-white text-center" style={{ "backgroundImage" : "url(/frontend/images/banner/banner-1.png)"}}>
                            <div className="container relative z-10">
                                <div className="max-w-[970px] mx-auto">
                                    <h2 className="m-0">Your gateway to <br />nature, fun and events</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="swiper-slide">
                        <div className="bg-cover bg-no-repeat bg-center md:min-h-[550px] min-h-[450px] flex items-center justify-center py-7 px-10 before:content-[''] before:absolute before:top-0 before:left-0 before:w-[100%] before:h-[100%] before:bg-black before:opacity-25 text-white text-center" style={{ "backgroundImage" : "url(/frontend/images/banner/banner-1.png)"}}>
                            <div className="container relative z-10">
                                <div className="max-w-[970px] mx-auto">
                                    <h2 className="m-0">Your gateway to <br />nature, fun and events</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="swiper-button-prev">
                    <svg width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.97776 14L2 7.55372M2 7.55372L7.97776 1M2 7.55372H18" stroke="currentcolor" strokeWidth="2"/></svg>
                </div>
                <div className="swiper-button-next">
                    <svg width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.0222 14L16 7.55372M16 7.55372L10.0222 1M16 7.55372H0" stroke="currentcolor" strokeWidth="2"/></svg>
                </div>
                <div className="swiper-pagination" />
            </div>
        </div>
    )
}