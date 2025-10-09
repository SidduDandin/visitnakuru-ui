import Banner from "@/components/home/banner";
import About from "@/components/home/about";
import WhatsOn from "@/components/home/whatsOn";
import Explore from "@/components/home/explore";
import Trendings from "@/components/home/trendings";
import NakuruThings from "@/components/home/nakuruThings";
import WhereToEat from "@/components/home/whereToEat";
import Stays from "@/components/home/stays";
import ShoppingPlaces from "@/components/home/shoppingPlaces";
import Visitor from "@/components/home/visitor";
import Events from "@/components/home/events";
import Ideas from "@/components/home/ideas";
import Transports from "@/components/home/transports";
import Partners from "@/components/home/partners";
import Blogs from "@/components/home/blogs";
import InstaIntegration from "@/components/home/instaIntergration";

import SwiperInit from "@/components/header/SwiperInit";

export default function Home() {
  return (
    <>
      <Banner />
      <About />
      <WhatsOn />
      <Explore />
      <Trendings />
      <NakuruThings />
      <WhereToEat />
      <Stays />
      <ShoppingPlaces />
      <Visitor />
      <Events />
      <Ideas />
      <Transports />
      <Partners />
      <Blogs />
      <InstaIntegration />
      <SwiperInit />
    </>
  );
}
