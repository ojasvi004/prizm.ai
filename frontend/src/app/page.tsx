import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Features from "../components/Features";

import { JSX } from "react";

export default function Home(): JSX.Element {
  return (
    <div className="">
      <main className="">
        <Hero />
        <Features />
        <Footer />
      </main>
    </div>
  );
}
