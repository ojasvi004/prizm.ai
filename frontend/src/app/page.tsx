import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Features from "../components/Features";
import SubscriptionPackages from "../components/SubscriptionPackages";
import ReviewsCarousel from "../components/ReviewsCarousel";

import { JSX } from "react";

export default function Home(): JSX.Element {
  return (
    <div className="bg-[rgb(240,245,255)] min-h-screen">
      <main className="">
        <Hero />
        <Features />
        <SubscriptionPackages />
        <ReviewsCarousel />
        <Footer />
      </main>
    </div>
  );
}
