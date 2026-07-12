"use client";

import { motion } from "framer-motion";
import {
    AlertCircle,
    HelpCircle,
    Settings,
    BarChart3,
    XCircle
} from "lucide-react";

const problems = [
    {
        title: "Informal Sector Challenges",
        description: "Over 80% of Tanzanian businesses are informal, making it difficult for them to access credit and government services.",
        icon: HelpCircle
    },
    {
        title: "Manual Tax Processes",
        description: "Traditional filing is time-consuming, prone to calculation errors, and requires physical visits to TRA offices.",
        icon: Settings
    },
    {
        title: "Tax Knowledge Gaps",
        description: "Complex tax laws and frequent regulation updates create confusion for small and medium enterprises (SMEs).",
        icon: AlertCircle
    },
    {
        title: "Revenue Inefficiencies",
        description: "Inefficient collection systems lead to revenue leakages and higher costs of compliance for both state and trader.",
        icon: BarChart3
    }
];

export function ProblemStatement() {
    return (
        <section className="py-24 px-6 bg-white relative overflow-hidden" id="problem">
            <div className="container mx-auto max-w-6xl relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-black text-[#1A1A1A] mb-8 leading-tight">
                            The <span className="text-yellow-600">Hidden Burden</span> <br />
                            of Tax Compliance
                        </h2>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            For many Tanzanian entrepreneurs, tax compliance feels like a barrier rather than a duty.
                            Manual processes and complex regulations slow down growth and prevent businesses from
                            reaching their full potential.
                        </p>

                        <div className="space-y-6">
                            {problems.map((problem, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100"
                                >
                                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
                                        <problem.icon className="w-5 h-5 text-yellow-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#1A1A1A] mb-1">{problem.title}</h3>
                                        <p className="text-gray-500 text-sm">{problem.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="p-8 rounded-3xl bg-[#1A1A1A] text-white shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4">
                                <XCircle className="w-12 h-12 text-yellow-500 opacity-20" />
                            </div>
                            <h3 className="text-2xl font-bold mb-6 text-yellow-400">Common Pitfalls</h3>
                            <ul className="space-y-4 text-gray-400">
                                <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 shrink-0" />
                                    Missing tax deadlines leading to heavy penalties.
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 shrink-0" />
                                    Inaccurate record-keeping affecting loan eligibility.
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 shrink-0" />
                                    High costs of hiring professional accountants.
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 shrink-0" />
                                    Difficulty in proving revenue for business formalization.
                                </li>
                            </ul>

                            <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10">
                                <div className="text-sm uppercase tracking-wider text-gray-500 mb-2">Estimated Loss</div>
                                <div className="text-3xl font-black text-[#FFD700]">TSh 4.2 Trillion</div>
                                <div className="text-xs text-gray-500 mt-1">Annual revenue gap due to informal sector challenges</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
