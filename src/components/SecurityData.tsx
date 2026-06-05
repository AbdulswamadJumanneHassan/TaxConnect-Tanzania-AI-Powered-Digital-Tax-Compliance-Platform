"use client";

import { motion } from "framer-motion";
import {
    ShieldCheck,
    Lock,
    Database,
    UserCheck,
    Eye,
    FileLock2
} from "lucide-react";

const securityFeatures = [
    {
        title: "Data Encryption",
        description: "Bank-grade AES-256 encryption for all your financial data, both at rest and in transit.",
        icon: Lock
    },
    {
        title: "Secure Authentication",
        description: "Two-factor authentication (2FA) and biometric login options to keep your account safe.",
        icon: UserCheck
    },
    {
        title: "TRA Compliance",
        description: "Our data handling protocols are fully aligned with TRA privacy standards and regulations.",
        icon: Database
    },
    {
        title: "Full Audit Logs",
        description: "Track every action on your account with detailed timestamps and IP logging.",
        icon: Eye
    },
    {
        title: "Role-Based Access",
        description: "Define exactly who in your company can view or edit sensitive tax information.",
        icon: FileLock2
    },
    {
        title: "Privacy First",
        description: "Your business secrets are safe with us. We never share your data with third parties.",
        icon: ShieldCheck
    }
];

export function SecurityData() {
    return (
        <section className="py-24 px-6 bg-slate-900 overflow-hidden">
            <div className="container mx-auto max-w-6xl">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="order-2 lg:order-1"
                    >
                        <div className="relative">
                            <div className="aspect-square rounded-[60px] bg-gradient-to-br from-slate-800 to-slate-950 border border-white/10 flex items-center justify-center p-12 relative overflow-hidden shadow-2xl">
                                <div className="absolute inset-0 opacity-10">
                                    <div className="absolute top-0 left-0 w-full h-full" style={{
                                        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,215,0,0.15) 1px, transparent 0)`,
                                        backgroundSize: '24px 24px'
                                    }} />
                                </div>

                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="w-32 h-32 bg-[#FFD700] rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-yellow-500/20 rotate-6">
                                        <ShieldCheck className="w-16 h-16 text-[#1A1A1A]" />
                                    </div>
                                    <div className="text-white font-black text-2xl mb-2 tracking-tighter">SECURED BY TAXCONNECT</div>
                                    <div className="text-gray-500 text-xs uppercase tracking-widest">Enterprise-Grade Protection</div>
                                </div>

                                {/* Orbital Rings */}
                                <div className="absolute w-[400px] h-[400px] rounded-full border border-white/5 animate-[spin_20s_linear_infinite]" />
                                <div className="absolute w-[500px] h-[500px] rounded-full border border-white/5 animate-[spin_30s_linear_infinite_reverse]" />
                            </div>
                        </div>
                    </motion.div>

                    <div className="order-1 lg:order-2">
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-8">
                            Your Data, <br />
                            <span className="text-[#FFD700]">Fortified.</span>
                        </h2>
                        <p className="text-gray-400 text-lg mb-12">
                            We understand the sensitivity of financial records. That&apos;s why we&apos;ve built
                            TaxConnect on top of world-class security infrastructure.
                        </p>

                        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-10">
                            {securityFeatures.map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <feature.icon className="w-5 h-5 text-[#FFD700]" />
                                        <h3 className="font-bold text-white text-sm uppercase tracking-wide">{feature.title}</h3>
                                    </div>
                                    <p className="text-gray-500 text-xs leading-relaxed">
                                        {feature.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
