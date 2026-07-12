"use client";

import { motion } from "framer-motion";
import {
    TrendingUp,
    Clock,
    Wallet,
    ShieldCheck,
    Store
} from "lucide-react";

const benefits = [
    {
        title: "Increased Revenue",
        value: "+30%",
        description: "Average increase in taxable revenue for businesses through better expense tracking.",
        icon: TrendingUp,
        color: "bg-yellow-500/10 text-yellow-500"
    },
    {
        title: "Faster Filing",
        value: "10x",
        description: "Reduction in time spent on monthly tax preparation and TRA submissions.",
        icon: Clock,
        color: "bg-yellow-500/10 text-yellow-500"
    },
    {
        title: "Lower Costs",
        value: "-45%",
        description: "Reduction in compliance-related costs including accounting fees and penalties.",
        icon: Wallet,
        color: "bg-[#FFD700]/10 text-[#FFD700]"
    },
    {
        title: "Transparency",
        value: "100%",
        description: "Full visibility into your tax status, ensuring audit-readiness at all times.",
        icon: ShieldCheck,
        color: "bg-yellow-500/10 text-yellow-500"
    },
    {
        title: "Formalization",
        value: "8K+",
        description: "Businesses successfully formalized and registered through our platform.",
        icon: Store,
        color: "bg-yellow-500/10 text-yellow-500"
    }
];

export function ImpactBenefits() {
    return (
        <section className="py-24 px-6 bg-slate-50 overflow-hidden" id="impact">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-[#1A1A1A] mb-6">
                        Real Impact, <span className="text-[#F5B800]">Real Benefits</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        We measure our success by the success of the businesses we serve.
                        Here is how TaxConnect is changing the landscape.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {benefits.map((benefit, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-300"
                        >
                            <div className={`w-12 h-12 rounded-2xl ${benefit.color} flex items-center justify-center mb-6`}>
                                <benefit.icon className="w-6 h-6" />
                            </div>

                            <div className="text-3xl font-black text-[#1A1A1A] mb-2">{benefit.value}</div>
                            <h3 className="font-bold text-[#1A1A1A] mb-4">{benefit.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">{benefit.description}</p>

                            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full translate-x-16 -translate-y-16 -z-10 group-hover:scale-110 transition-transform duration-500" />
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="mt-16 p-12 rounded-[40px] bg-[#1A1A1A] text-white text-center relative overflow-hidden"
                >
                    <div className="relative z-10">
                        <h3 className="text-3xl font-bold mb-4">Ready to formalize your success?</h3>
                        <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                            Join thousands of Tanzanian entrepreneurs who have simplified their tax compliance.
                        </p>
                        <button className="px-8 py-4 bg-[#FFD700] text-[#1A1A1A] font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-yellow-500/20">
                            Transform My Business
                        </button>
                    </div>

                    {/* Background Glow */}
                    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#FFD700] rounded-full blur-[140px] opacity-20" />
                </motion.div>
            </div>
        </section>
    );
}
