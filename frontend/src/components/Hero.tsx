"use client";

import React from "react";
import { BackgroundGradientAnimation } from "./ui/background-gradient-animation";

export default function Hero() {
  return (
    <BackgroundGradientAnimation
      gradientBackgroundStart="rgb(250, 252, 255)"
      gradientBackgroundEnd="rgb(240, 245, 255)"
      firstColor="59, 130, 246" 
      secondColor="147, 197, 253"
      thirdColor="56, 189, 248"
      fourthColor="125, 211, 252"
      fifthColor="167, 139, 250"
      pointerColor="96, 165, 250"
      size="80%"
      blendingValue="hard-light"
    >
      <div className="relative z-50 w-full h-[100vh] flex flex-col items-center justify-center pointer-events-none pt-20 pb-20">
        <div className="relative max-w-6xl mx-auto px-6 text-center pointer-events-auto">
          
          {/* Main Headline */}
          <h1 className="text-6xl md:text-[100px] my-10 font-bold tracking-tighter text-slate-900 mb-6 leading-[0.85]">
            The spectrum of <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-blue-600 to-indigo-900">
              adversarial logic.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 mb-12 leading-relaxed font-light">
            Prizm interrogates reports through a multi-agent adversarial protocol 
            to synthesize <span className="text-slate-900 font-medium">unbiased truth</span>.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
            <button className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-900 text-white font-semibold rounded-full hover:opacity-90 transition-all duration-300 shadow-xl shadow-blue-900/20 active:scale-95">
              Start New Analysis
            </button>
            <button className="px-10 py-4 bg-white/60 backdrop-blur-md text-slate-700 font-semibold rounded-full border border-white hover:bg-white transition-all duration-300">
              Watch Execution
            </button>
          </div>

        </div>
      </div>

      <style jsx global>{`
        @keyframes move {
          0% { left: 0; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
      `}</style>
    </BackgroundGradientAnimation>
  );
}