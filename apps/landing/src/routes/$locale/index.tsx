import { createFileRoute } from "@tanstack/react-router";
import Header from "../../components/Header";
import Hero from "../../components/Hero";
import Features from "../../components/Features";
import Testimonials from "../../components/Testimonials";
import Changelog from "../../components/Changelog";
import Pricing from "../../components/Pricing";
import CTA from "../../components/CTA";
import Footer from "../../components/Footer";

export const Route = createFileRoute("/$locale/")({
  component: LandingPage,
});

function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <Testimonials />
        <Changelog />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
