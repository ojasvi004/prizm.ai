"use client";

import React from "react";

export default function Footer() {
  return (
    <footer className="relative z-50 overflow-hidden border-t border-blue-100/60 bg-gradient-to-b from-white/40 via-blue-50/40 to-white backdrop-blur-xl">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08),transparent_60%)]" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-10">
        {/* Top Grid */}
        <div className="grid gap-14 md:grid-cols-4 mb-16">
          {/* Brand */}
          <div className="md:col-span-2 space-y-5">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="PRIZM Logo"
                className="w-9 h-9 object-contain drop-shadow-md"
              />
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-blue-600 bg-clip-text text-transparent">
                PRIZM AI
              </span>
            </div>

            <p className="max-w-md text-sm leading-relaxed text-slate-600">
              Advancing multi-agent reasoning through adversarial protocols.
              Deliberative logic for complex organizational and policy evaluation.
            </p>
          </div>

          {/* Protocol */}
          <div>
            <h4 className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-slate-900">
              Protocol
            </h4>
            <ul className="space-y-4 text-sm">
              {[
                "Factor Extraction",
                "Adversarial Debate",
                "Synthesis Engine",
              ].map((item) => (
                <li
                  key={item}
                  className="group flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  <span className="h-1 w-1 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-slate-900">
              Resources
            </h4>
            <ul className="space-y-4 text-sm">
              {[
                "Execution Traces",
                "Agent Logs",
                "Documentation",
              ].map((item) => (
                <li
                  key={item}
                  className="group flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  <span className="h-1 w-1 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Console Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-blue-100/70 pt-8">
          {/* Left */}
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <span className="text-slate-400">
              © 2026 PRIZM AI. All rights reserved.
            </span>

            <span className="hidden md:block h-4 w-px bg-slate-200" />

            <span className="font-semibold text-slate-900">
              Created by{" "}
              <span className="ml-1 inline-flex items-center rounded bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                N3RDS
              </span>
            </span>
          </div>

          {/* System Status */}
          <div className="flex items-center gap-6 font-mono text-[10px] uppercase tracking-tight text-slate-500">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Agents Online
            </div>

            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              v1.0.4-stable
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
