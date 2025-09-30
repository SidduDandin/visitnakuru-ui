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
import Banner from "@/components/Frontendcomponents/home/banner";
import About from "@/components/Frontendcomponents/home/about";
import WhatsOn from "@/components/Frontendcomponents/home/whatsOn";
import Explore from "@/components/Frontendcomponents/home/explore";
import Trendings from "@/components/Frontendcomponents/home/trendings";
import NakuruThings from "@/components/Frontendcomponents/home/nakuruThings";
import WhereToEat from "@/components/Frontendcomponents/home/whereToEat";
import Stays from "@/components/Frontendcomponents/home/stays";
import ShoppingPlaces from "@/components/Frontendcomponents/home/shoppingPlaces";
import Visitor from "@/components/Frontendcomponents/home/visitor";
import Events from "@/components/Frontendcomponents/home/events";
import Ideas from "@/components/Frontendcomponents/home/ideas";
import Transports from "@/components/Frontendcomponents/home/transports";
import Partners from "@/components/Frontendcomponents/home/partners";
import Blogs from "@/components/Frontendcomponents/home/blogs";
import InstaIntegration from "@/components/Frontendcomponents/home/instaIntergration";
import SwiperInit from "@/components/Frontendcomponents/SwiperInit";


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