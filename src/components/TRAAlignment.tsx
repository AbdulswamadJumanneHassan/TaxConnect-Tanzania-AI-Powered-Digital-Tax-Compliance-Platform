"use client";

import { motion } from "framer-motion";
import {
    CheckCircle2,
    TrendingUp,
    ShieldAlert,
    Zap,
    Building2
} from "lucide-react";

const benefits = [
    {
        title: "Increased Tax Compliance",
        description: "Simplified workflows lead to higher voluntary compliance across all business sectors.",
        icon: CheckCircle2
    },
    {
        title: "Reduced Tax Evasion",
        description: "AI-driven real-time monitoring makes it easier for businesses to do the right thing.",
        icon: ShieldAlert
    },
    {
        title: "Enhanced Revenue Collection",
        description: "Digital tools minimize leakages and optimize revenue streams for the government.",
        icon: TrendingUp
    },
    {
        title: "Digital Transformation",
        description: "Modernizing tax services to meet the needs of a 21st-century digital economy.",
        icon: Zap
    }
];

export function TRAAlignment() {
    return (
        <section className="py-24 px-6 bg-[#FFD700] overflow-hidden">
            <div className="container mx-auto max-w-6xl">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1A1A]/10 text-[#1A1A1A] text-xs font-bold uppercase tracking-wider mb-6">
                            <Building2 className="w-3 h-3" />
                            Official Alignment
                        </div>

                        <h2 className="text-4xl md:text-5xl font-black text-[#1A1A1A] mb-8 leading-tight">
                            Aligned with <br />
                            <span className="opacity-70">Tanzania Revenue Authority</span>
                        </h2>

                        <p className="text-lg text-[#1A1A1A]/80 mb-10 leading-relaxed">
                            TaxConnect is built to work hand-in-hand with TRA&apos;s digital transformation goals.
                            By simplifying tax processes, we help the nation build a stronger, more transparent
                            economic foundation.
                        </p>

                        <div className="grid sm:grid-cols-2 gap-6">
                            {benefits.map((benefit, i) => {
                                const Icon = benefit.icon;
                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="p-4 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30"
                                    >
                                        <Icon className="w-6 h-6 text-[#1A1A1A] mb-3" />
                                        <h3 className="font-bold text-[#1A1A1A] mb-1">{benefit.title}</h3>
                                        <p className="text-[#1A1A1A]/70 text-xs leading-relaxed">{benefit.description}</p>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="aspect-square bg-[#1A1A1A] rounded-3xl overflow-hidden shadow-2xl relative">
                            {/* Abstract TRA-style graphics */}
                            <div className="absolute inset-0 opacity-20">
                                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#FFD700] via-transparent to-transparent" />
                            </div>

                            <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                                <div className="w-24 h-24 bg-[#FFD700] rounded-2xl mb-8 flex items-center justify-center rotate-3">
                                    <Building2 className="w-12 h-12 text-[#1A1A1A]" />
                                </div>
                                <h3 className="text-3xl font-black text-white mb-4 italic">Hapa Kazi Tu</h3>
                                <p className="text-gray-400 text-sm max-w-xs">
                                    Digitizing tax compliance to support President Samia Suluhu Hassan&apos;s vision for a modern Tanzanian economy.
                                </p>
                            </div>

                            {/* Floaties */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute top-10 right-10 p-4 rounded-2xl bg-[#FFD700]/10 border border-[#FFD700]/20 backdrop-blur-md"
                            >
                                <div className="text-[#FFD700] font-black text-xl">+45%</div>
                                <div className="text-white/50 text-[10px] uppercase">Compliance rate</div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
