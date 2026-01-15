"use client";

import React from "react";
import { motion } from "framer-motion";

const packages = [
	{
		name: "Starter",
		price: "$0",
		description:
			"Free access to basic adversarial analysis. Limited agent depth and no synthesis export.",
		features: [
			"Up to 2 agents per report",
			"Basic factor extraction",
			"No export capability",
		],
		highlight: false,
	},
	{
		name: "Pro",
		price: "$19/mo",
		description:
			"Unlock advanced agent reasoning, synthesis engine, and exportable reports.",
		features: [
			"Up to 6 agents per report",
			"Advanced factor extraction",
			"Unified synthesis export",
			"Priority support",
		],
		highlight: true,
	},
	{
		name: "Enterprise",
		price: "Contact",
		description:
			"Custom agent orchestration, integrations, and dedicated support for organizations.",
		features: [
			"Unlimited agents",
			"Custom orchestration",
			"API & integrations",
			"Dedicated support",
		],
		highlight: false,
	},
];

export default function SubscriptionPackages() {
	return (
		<motion.section id="subscription-packages" className="relative mx-auto max-w-7xl px-6 lg:px-8 py-24 bg-transparent" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, type: "spring" }}>
			<header className="mx-auto mb-16 max-w-2xl text-center">
				<h2 className="text-4xl sm:text-5xl py-2 font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-blue-600 to-indigo-900">
					Subscription Packages
				</h2>
				<p className="mt-4 text-lg text-slate-600 font-light">
					Choose the plan that fits your analysis needs.
				</p>
			</header>
			<div className="grid gap-10 md:grid-cols-3">
				{packages.map((pkg) => (
					<div
						key={pkg.name}
						className={`relative rounded-[32px] border border-white bg-white/40 backdrop-blur-md shadow-lg shadow-blue-900/5 transition-all duration-300 group flex flex-col p-8 h-full ${
							pkg.highlight
								? "ring-4 ring-blue-600/30 scale-105 z-10"
								: ""
						}`}
					>
						<div className="mb-6 flex flex-col items-center justify-center">
							<h3
								className={`text-2xl font-bold mb-2 ${
									pkg.highlight ? "text-blue-700" : "text-slate-900"
								}`}
							>
								{pkg.name}
							</h3>
							<span
								className={`text-3xl font-extrabold mb-2 block ${
									pkg.highlight
										? "bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-900"
										: "text-blue-600"
								}`}
							>
								{pkg.price}
							</span>
							<p className="text-base text-slate-500 font-light mb-4 text-center">
								{pkg.description}
							</p>
						</div>
						<ul className="mb-8 space-y-2 flex-1">
							{pkg.features.map((f, i) => (
								<li
									key={i}
									className="flex items-center gap-2 text-slate-700"
								>
									<span
										className={`inline-block w-2 h-2 rounded-full ${
											pkg.highlight
												? "bg-gradient-to-br from-blue-600 to-indigo-900"
												: "bg-blue-200"
										}`}
									/>
									{f}
								</li>
							))}
						</ul>
						<button
							className={`mt-auto px-6 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg shadow-blue-900/10 ${
								pkg.highlight
									? "bg-gradient-to-r from-blue-600 to-indigo-900 text-white hover:opacity-90"
									: "bg-white/80 text-blue-700 border border-white hover:bg-white"
							}`}
						>
							{pkg.highlight
								? "Get Pro"
								: pkg.name === "Starter"
								? "Start Free"
								: "Contact Sales"}
						</button>
						{pkg.highlight && (
							<div className="absolute -top-4 right-6 px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-blue-600 to-indigo-900 text-white shadow-md">
								Most Popular
							</div>
						)}
					</div>
				))}
			</div>
		</motion.section>
	);
}
