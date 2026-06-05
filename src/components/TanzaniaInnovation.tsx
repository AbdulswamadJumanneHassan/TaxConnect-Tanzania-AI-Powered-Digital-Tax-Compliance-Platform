"use client";

import { motion } from "framer-motion";
import {
    Languages,
    Smartphone,
    Users,
    Palmtree,
    MapPin,
    Globe
} from "lucide-react";

const innovations = [
    {
        title: "Swahili-First AI",
        description: "Our AI is trained on local Tanzanian tax laws and speaks perfect Swahili, ensuring no business owner is left behind.",
        icon: Languages
    },
    {
        title: "Mobile Money Native",
        description: "Deep integration with M-Pesa, Tigo Pesa, and Airtel Money for seamless revenue tracking and automated filing.",
        icon: Smartphone
    },
    {
        title: "Informal Sector Support",
        description: "Custom workflows for 'machingas' and small traders to help them formalize and grow with zero complexity.",
        icon: Users
    },
    {
        title: "Tourism Tax Management",
        description: "Specialized tools for the tourism sector, handling conservation fees, hotel levies, and safari taxes automatically.",
        icon: Palmtree
    },
    {
        title: "Local Govt. Revenue",
        description: "Integrated collections for municipal councils and local governments (PO-RALG) to optimize regional development.",
        icon: MapPin
    },
    {
        title: "Cross-Border E-Commerce",
        description: "Advanced monitoring for digital services and cross-border trade, ensuring fair taxation in the global digital economy.",
        icon: Globe
    }
];

export function TanzaniaInnovation() {
    return (
        <section className="py-24 px-6 bg-slate-50 relative overflow-hidden">
            {/* Pattern background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
                backgroundImage: `radial-gradient(#1A1A1A 1px, transparent 1px)`,
                backgroundSize: "40px 40px"
            }} />

            <div className="container mx-auto max-w-6xl relative z-10">
                <div className="max-w-3xl mb-20 text-center mx-auto">
                    <h2 className="text-4xl md:text-5xl font-black text-[#1A1A1A] mb-6">
                        Innovation Built for <span className="text-[#F5B800]">Tanzania</span>
                    </h2>
                    <p className="text-lg text-gray-600">
                        We don&apos;t just build software; we build solutions that respect our unique local context,
                        culture, and economic landscape.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {innovations.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-[#FFD700]/10 flex items-center justify-center mb-6">
                                    <Icon className="w-7 h-7 text-[#1A1A1A]" />
                                </div>
                                <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">{item.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
