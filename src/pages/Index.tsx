import React from 'react';
import { Nav } from '@/components/landing/Nav';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { Audience } from '@/components/landing/Audience';
import { Benefits } from '@/components/landing/Benefits';
import { Testimonials } from '@/components/landing/Testimonials';
import { CTA } from '@/components/landing/CTA';
import { Footer } from '@/components/landing/Footer';

export default function Index() {
  return (
    <div className="bg-white overflow-hidden rounded-lg border-[rgba(206,212,218,1)] border-solid border-2">
      <div className="bg-[rgba(0,0,0,0)] w-full max-md:max-w-full">
        <div className="flex w-full flex-col items-stretch max-md:max-w-full">
          <Nav />
          <main>
            <Hero />
            <Features />
            <Audience />
            <Benefits />
            <Testimonials />
            <CTA />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
