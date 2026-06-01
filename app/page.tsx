import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Steps } from "@/components/sections/Steps";
import { About } from "@/components/sections/About";
import { Benefits } from "@/components/sections/Benefits";
import { Trips } from "@/components/sections/Trips";
import { Gallery } from "@/components/sections/Gallery";
import { Reviews } from "@/components/sections/Reviews";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";
import { CtaBand } from "@/components/sections/CtaBand";
import { Footer } from "@/components/sections/Footer";
import { JsonLd } from "@/components/JsonLd";

export default function Home() {
  return (
    <>
      <JsonLd />
      <Nav />
      <main id="content">
        <span id="top" aria-hidden="true" className="absolute top-0" />
        <Hero />
        <Services />
        <Steps />
        <About />
        <Benefits />
        <Trips />
        <Gallery />
        <Reviews />
        <Faq />
        <Contact />
        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
