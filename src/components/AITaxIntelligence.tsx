"use client";

import { motion } from "framer-motion";
import {
    Bot,
    ShieldCheck,
    Activity,
    Search,
    TrendingUp,
    BrainCircuit
} from "lucide-react";

const aiFeatures = [
    {
        id: 1,
        icon: Bot,
        title: "AI Tax Assistant",
        description: "24/7 support in Swahili and English. Get instant answers to complex tax laws and compliance requirements.",
        color: "from-yellow-400 to-yellow-600"
    },
    {
        id: 2,
        icon: ShieldCheck,
        title: "Receipt Verification Prototype",
        description: "Prototype demonstrating how EFD and digital receipts could be verified against TRA records to ensure authenticity.",
        color: "from-yellow-500 to-yellow-700"
    },
    {
        id: 3,
        icon: Activity,
        title: "AI Compliance Monitoring",
        description: "Automated real-time checks on your business activities to ensure you never miss a filing deadline.",
        color: "from-yellow-600 to-yellow-800"
    },
    {
        id: 4,
        icon: Search,
        title: "Fraud Detection Analysis",
        description: "AI-assisted analysis conceptualizing how algorithms could scan for anomalies and protect your business.",
        color: "from-yellow-400 to-yellow-500"
    },
    {
        id: 5,
        icon: TrendingUp,
        title: "AI Revenue Forecasting",
        description: "Predict future tax obligations and revenue trends using deep learning based on your historical data.",
        color: "from-yellow-500 to-yellow-600"
    },
    {
        id: 6,
        icon: BrainCircuit,
        title: "Smart Recommendations",
        description: "Personalized advice on tax exemptions and incentives applicable to your specific industry sector.",
        color: "from-yellow-600 to-yellow-700"
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6 },
    },
};

export function AITaxIntelligence() {
    return (
        <section className="py-32 px-6 bg-[#1A1A1A] relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden opacity-20">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#FFD700] rounded-full blur-[120px]" />
                <div className="absolute bottom-0 -left-24 w-64 h-64 bg-[#FFD700] rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto max-w-6xl relative z-10">
                <div className="flex flex-col items-center text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#FFD700]/30 bg-[#FFD700]/10 mb-6 backdrop-blur-sm"
                    >
                        <BrainCircuit className="w-4 h-4 text-[#FFD700]" />
                        <span className="text-xs font-bold uppercase tracking-wider text-[#FFD700]">Advanced Intelligence</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-6xl font-black text-white mb-6"
                    >
                        AI-Powered <span className="text-[#FFD700]">Tax Intelligence</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-lg text-gray-400 max-w-3xl"
                    >
                        Transforming tax compliance from a burden into a competitive advantage.
                        Our neural engine handles the complexity so you can focus on growing your business.
                    </motion.p>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {aiFeatures.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={feature.id}
                                variants={itemVariants}
                                className="group"
                            >
                                <div className="p-8 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-[#FFD700]/30 transition-all duration-300 h-full flex flex-col items-start text-left">
                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg shadow-yellow-500/10 group-hover:shadow-[#FFD700]/20 transition-all`}>
                                        <Icon className="w-7 h-7 text-[#1A1A1A]" />
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#FFD700] transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-400 leading-relaxed text-sm">
                                        {feature.description}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
