"use client";

import React from "react";
import { motion } from "framer-motion";

const reviews = [
  {
    name: "Alex P.",
    text: "Prizm's multi-agent debate exposed flaws in our internal reports and helped us make better decisions. Highly recommended!",
    company: "Acme Corp",
  },
  {
    name: "Samantha R.",
    text: "The synthesis engine is a game changer. We finally have traceable logic for every outcome.",
    company: "FinSight Analytics",
  },
  {
    name: "David L.",
    text: "The adversarial protocol keeps our reasoning sharp and unbiased. The UI is beautiful and easy to use.",
    company: "BluePeak Ventures",
  },
  {
    name: "Priya S.",
    text: "We love the transparency and the ability to export agent debates. Prizm is now part of our workflow.",
    company: "Insightful AI",
  },
  {
    name: "Tom W.",
    text: "Enterprise support is fantastic. Custom orchestration fits our needs perfectly.",
    company: "DataBridge Solutions",
  },
];

export default function ReviewsCarousel() {
  const duplicatedReviews = [...reviews, ...reviews];

  return (
    <motion.section id="reviews" className="relative mx-auto max-w-7xl px-6 lg:px-8 py-20 overflow-hidden" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, type: "spring" }}>
      <header className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-blue-600 to-indigo-900">
          Customer Reviews
        </h2>
      </header>

      {/* The Carousel Container */}
      <div className="relative group">
        {/* Removed the absolute gradient mask divs that were here */}
        
        <div className="flex animate-marquee group-hover:[animation-play-state:paused] gap-8 py-4">
          {duplicatedReviews.map((review, idx) => (
            <div
              key={idx}
              className="w-[340px] shrink-0 bg-gradient-to-br from-blue-50 via-white/70 to-indigo-100 border border-white rounded-3xl shadow-xl shadow-blue-900/10 p-8 flex flex-col transition-transform duration-300 hover:scale-[1.02]"
            >
              <p className="text-lg text-slate-700 font-medium italic leading-relaxed mb-6">
                “{review.text}”
              </p>

              <div className="mt-auto">
                <div className="font-semibold text-blue-700 text-base">
                  {review.name}
                </div>
                <div className="text-xs text-slate-500">
                  {review.company}
                </div>
              </div>

              <div className="mt-4 text-xs font-semibold text-blue-400 opacity-70 uppercase tracking-wider">
                Verified Customer
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          /* Precisely loops back to start by calculating card width + gap */
          100% { transform: translateX(calc(-340px * ${reviews.length} - 2rem * ${reviews.length})); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
      `}</style>
    </motion.section>
  );
}