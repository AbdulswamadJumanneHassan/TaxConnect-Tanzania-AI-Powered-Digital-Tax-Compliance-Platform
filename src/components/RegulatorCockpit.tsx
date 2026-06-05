"use client";

import { motion } from "framer-motion";
import {
    ShieldAlert,
    Map,
    Link2,
    BarChart,
    Search,
    Building2,
    TrendingUp
} from "lucide-react";

const traFeatures = [
    {
        title: "AI Fraud-Shield",
        description: "Detects evasion patterns and invalid EFD receipts in real-time, preventing revenue leakage before filing.",
        icon: ShieldAlert
    },
    {
        title: "Economic Heatmaps",
        description: "Live visualization of tax collection across regions, identifying high-growth sectors and collection gaps.",
        icon: Map
    },
    {
        title: "Cross-Agency Sync",
        description: "Seamless API integration with BRELA, NIDA, and PO-RALG for a unified national citizen database.",
        icon: Link2
    },
    {
        title: "Predictive Analytics",
        description: "AI-driven forecasts for national revenue, assisting in precise budget planning and policy formulation.",
        icon: BarChart
    }
];

export function RegulatorCockpit() {
    return (
        <section className="py-24 px-6 bg-[#1A1A1A] relative overflow-hidden border-t border-[#FFD700]/10">
            {/* TRA Watermark Background */}
            <div className="absolute inset-0 opacity-[0.02] flex items-center justify-center pointer-events-none">
                <Building2 className="w-[800px] h-[800px] text-[#FFD700]" />
            </div>

            <div className="container mx-auto max-w-6xl relative z-10">
                <div className="flex flex-col lg:flex-row gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="lg:w-1/2"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#FFD700]/30 bg-[#FFD700]/10 mb-8 backdrop-blur-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD700] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFD700]"></span>
                            </span>
                            <span className="text-xs font-bold uppercase tracking-widest text-[#FFD700]">Regulator Innovation 2030</span>
                        </div>

                        <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight">
                            The <span className="text-[#FFD700]">Regulator&apos;s</span> <br />
                            Intelligence Cockpit
                        </h2>

                        <p className="text-lg text-gray-400 mb-10 leading-relaxed">
                            Empowering the Tanzania Revenue Authority with real-time data sovereignty.
                            Move from manual audits to automated, AI-driven oversight that grows the
                            national economy through transparency.
                        </p>

                        <div className="grid sm:grid-cols-2 gap-8">
                            {traFeatures.map((feature, i) => (
                                <div key={i} className="group">
                                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:bg-[#FFD700]/20 group-hover:border-[#FFD700]/30 transition-all">
                                        <feature.icon className="w-6 h-6 text-[#FFD700]" />
                                    </div>
                                    <h3 className="text-white font-bold mb-2">{feature.title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="lg:w-1/2 relative"
                    >
                        {/* Mockup of a TRA Admin Dashboard */}
                        <div className="p-2 rounded-[32px] bg-gradient-to-br from-[#FFD700]/20 to-transparent border border-[#FFD700]/20">
                            <div className="rounded-[28px] bg-slate-900 border border-white/10 overflow-hidden shadow-2xl shadow-[#FFD700]/10">
                                {/* Dashboard Header */}
                                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#1A1A1A]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-[#FFD700] flex items-center justify-center">
                                            <Building2 className="w-5 h-5 text-[#1A1A1A]" />
                                        </div>
                                        <div className="text-xs font-black text-white uppercase tracking-tighter">TRA Admin Portal</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="w-2 h-2 rounded-full bg-red-500" />
                                        <div className="w-2 h-2 rounded-full bg-[#FFD700]" />
                                        <div className="w-2 h-2 rounded-full bg-green-500" />
                                    </div>
                                </div>

                                {/* Dashboard Content */}
                                <div className="p-8 space-y-8">
                                    {/* Big Stat */}
                                    <div>
                                        <div className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">Total National Revenue (Daily)</div>
                                        <div className="text-4xl font-black text-white flex items-center gap-3">
                                            TSh 8.42B
                                            <span className="text-green-500 text-sm font-bold flex items-center">
                                                <TrendingUp className="w-4 h-4 mr-1" /> +12%
                                            </span>
                                        </div>
                                    </div>

                                    {/* Heatmap Mockup */}
                                    <div className="h-48 rounded-2xl bg-[#1A1A1A] border border-white/5 relative overflow-hidden flex items-center justify-center">
                                        <div className="absolute inset-0 opacity-30">
                                            <div className="absolute top-10 left-10 w-20 h-20 bg-[#FFD700] rounded-full blur-3xl animate-pulse" />
                                            <div className="absolute bottom-10 right-20 w-32 h-32 bg-green-500 rounded-full blur-3xl animate-pulse" />
                                        </div>
                                        <Search className="w-12 h-12 text-[#FFD700]/20" />
                                        <div className="absolute bottom-4 left-6 right-6 flex justify-between">
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                                                <div key={i} className="w-2 bg-white/5 rounded-full" style={{ height: `${Math.random() * 100}%` }} />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Alerts */}
                                    <div className="space-y-3">
                                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <ShieldAlert className="w-4 h-4 text-red-500" />
                                                <span className="text-[10px] text-gray-400">Suspicious EFD activity detected in Mwanza</span>
                                            </div>
                                            <div className="text-[10px] text-red-500 font-bold uppercase cursor-pointer hover:underline">Investigate</div>
                                        </div>
                                        <div className="p-4 rounded-xl bg-[#FFD700]/5 border border-[#FFD700]/10 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Link2 className="w-4 h-4 text-[#FFD700]" />
                                                <span className="text-[10px] text-gray-400">BRELA database sync complete</span>
                                            </div>
                                            <div className="text-[10px] text-gray-400 font-bold uppercase">100% OK</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FFD700] rounded-full blur-[100px] opacity-20 -z-10" />
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-green-500 rounded-full blur-[100px] opacity-10 -z-10" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
