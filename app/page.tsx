'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Users, Database, Server, Globe } from 'lucide-react';
import Banner from "@/components/frontendcomponents/home/banner";
import About from "@/components/frontendcomponents/home/about";
import WhatsOn from "@/components/frontendcomponents/home/whatsOn";
import Explore from "@/components/frontendcomponents/home/explore";
import Trendings from "@/components/frontendcomponents/home/trendings";
import NakuruThings from "@/components/frontendcomponents/home/nakuruThings";
import WhereToEat from "@/components/frontendcomponents/home/whereToEat";
import Stays from "@/components/frontendcomponents/home/stays";
import ShoppingPlaces from "@/components/frontendcomponents/home/shoppingPlaces";
import Visitor from "@/components/frontendcomponents/home/visitor";
import Events from "@/components/frontendcomponents/home/events";
import Ideas from "@/components/frontendcomponents/home/ideas";
import Transports from "@/components/frontendcomponents/home/transports";
import Partners from "@/components/frontendcomponents/home/partners";
import Blogs from "@/components/frontendcomponents/home/blogs";
import InstaIntegration from "@/components/frontendcomponents/home/instaIntergration";
import SwiperInit from "@/components/frontendcomponents/SwiperInit";


interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

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