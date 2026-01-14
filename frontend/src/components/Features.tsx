"use client";

import React from "react";

const features = [
  {
    title: "Multi-Agent Deconstruction",
    description:
      "Complex reports and multimodal inputs are decomposed into isolated decision variables. Dedicated agents reason independently across policy, sales, and organizational domains.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h12M4 18h8" />
      </svg>
    ),
  },
  {
    title: "A2A Adversarial Debate",
    description:
      "Every claim is challenged by an opposing agent while a supportive agent defends it. This adversarial loop enforces self-correction and eliminates weak reasoning paths.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.4-4 8-9 8a10 10 0 01-4-1l-4 1 1-4c-1-1.4-1-3-1-4 0-4.4 4-8 9-8s9 3.6 9 8z" />
      </svg>
    ),
  },
  {
    title: "Traceable Coordination Flow",
    description:
      "Execution graphs and agent logs expose the full reasoning chain. Observe how context is exchanged, refuted, and reconciled in real time.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h18M3 12h18M3 19h18" />
      </svg>
    ),
  },
  {
    title: "Unified Synthesis Engine",
    description:
      "All agent outputs are consolidated into a single defensible report explaining outcomes, tradeoffs, and final decisions with traceable logic.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];



export default function Features() {
  return (
    <section className="relative overflow-hidden bg-[rgb(240,245,255)] py-32">
      {/* Ambient Grid */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.08),transparent_60%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <header className="mx-auto mb-24 max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
            Architecture
          </p>

          <h2 className="mt-4 text-4xl sm:text-5xl py-2 font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-blue-600 to-indigo-900">
            A2A Adversarial Reasoning System
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-slate-600">
            A multi-agent framework where reasoning is continuously challenged,
            refined, and synthesized, ensuring decisions survive structured opposition.
          </p>
        </header>

        {/* Feature Modules */}
        <div className="grid gap-10 lg:grid-cols-2">
          {features.map((f) => (
            <div
              key={f.title}
              className="relative rounded-[32px] border border-white bg-white/60 backdrop-blur-md p-8 transition-all duration-300 hover:bg-white hover:shadow-xl hover:shadow-blue-900/20 shadow-lg shadow-blue-900/5 group"
            >
              <div className="absolute left-8 top-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-white text-blue-600 border border-blue-100 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                {f.icon}
              </div>

              <div className="pl-20">
                <h3 className="text-xl font-bold text-slate-900">
                  {f.title}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-slate-500 font-light">
                  {f.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Unified Flow */}
        <div className="relative mx-auto mt-32 max-w-5xl">
          <div className="absolute -inset-8 rounded-[48px] bg-blue-500/5 blur-3xl" />

          <div className="relative rounded-[36px] border border-white bg-white/40 p-1 md:p-12 backdrop-blur-2xl shadow-2xl shadow-blue-900/5">
            <div className="grid items-center gap-12 md:grid-cols-[1fr_auto_1.6fr_auto_1fr]">
              <ProcessStep
                title="Extraction"
                subtitle="Factor isolation"
                tone="light"
              />

              <FlowConnector />

              <div className="rounded-3xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white px-10 py-8 shadow-inner">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-5 flex items-center gap-4">
                    <Badge color="cyan">PRO</Badge>
                    <Badge color="rose">CON</Badge>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">
                    Structured Debate
                  </h4>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Adversarial Verification
                  </p>
                </div>
              </div>

              <FlowConnector />

              <ProcessStep
                title="Synthesis"
                subtitle="Unified report"
                tone="dark"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

//helpers

function FlowConnector() {
  return (
    <div className="hidden h-px w-16 bg-gradient-to-r from-transparent via-blue-400 to-transparent md:block" />
  );
}

function ProcessStep({
  title,
  subtitle,
  tone,
}: {
  title: string;
  subtitle: string;
  tone: "light" | "dark";
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div
        className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl font-black ${
          tone === "dark"
            ? "bg-slate-900 text-white"
            : "bg-blue-50 text-blue-600"
        }`}
      >
        {title[0]}
      </div>
      <h5 className="text-sm font-bold uppercase tracking-widest text-slate-900">
        {title}
      </h5>
      <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
    </div>
  );
}

function Badge({
  children,
  color,
}: {
  children: React.ReactNode;
  color: "cyan" | "rose";
}) {
  return (
    <span
      className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-black text-white shadow-lg ${
        color === "cyan" ? "bg-cyan-500" : "bg-rose-500"
      }`}
    >
      {children}
    </span>
  );
}