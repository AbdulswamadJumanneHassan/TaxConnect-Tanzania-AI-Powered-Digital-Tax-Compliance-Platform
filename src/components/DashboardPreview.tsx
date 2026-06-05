"use client";

import { motion } from "framer-motion";
import {
    BarChart3,
    LayoutDashboard,
    PieChart,
    Search,
    Bell,
    ArrowUpRight
} from "lucide-react";

export function DashboardPreview() {
    return (
        <section className="py-24 px-6 bg-[#1A1A1A] overflow-hidden" id="dashboard">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                        Actionable <span className="text-[#FFD700]">Insights</span>
                    </h2>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        Everything starts with data. Our dashboard gives you a panoramic view of your business
                        health and tax compliance status in real-time.
                    </p>
                </div>

                <div className="relative">
                    {/* Dashboard Frame */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}
                        className="rounded-3xl border border-white/10 bg-slate-900 shadow-2xl p-4 md:p-8 relative z-10"
                    >
                        {/* Mock Dashboard UI */}
                        <div className="grid grid-cols-12 gap-6">
                            {/* Sidebar Mock */}
                            <div className="hidden lg:block col-span-3 space-y-6">
                                <div className="flex items-center gap-3 mb-8 px-2">
                                    <div className="w-8 h-8 rounded-lg bg-[#FFD700] flex items-center justify-center">
                                        <LayoutDashboard className="w-5 h-5 text-[#1A1A1A]" />
                                    </div>
                                    <span className="font-bold text-white">TaxConnect</span>
                                </div>
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className={`h-10 rounded-xl ${i === 1 ? 'bg-white/10' : ''} flex items-center px-4 gap-3`}>
                                        <div className="w-4 h-4 rounded bg-white/20" />
                                        <div className={`h-2 rounded bg-white/10 ${i === 1 ? 'w-24 bg-white/30' : 'w-16'}`} />
                                    </div>
                                ))}
                            </div>

                            {/* Main Content Mock */}
                            <div className="col-span-12 lg:col-span-9 space-y-6">
                                {/* Stats Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {[
                                        { label: "Total Revenue", value: "TSh 12.4M", icon: BarChart3, color: "text-[#FFD700]" },
                                        { label: "Tax Liability", value: "TSh 1.8M", icon: PieChart, color: "text-blue-400" },
                                        { label: "Pending Issues", value: "2 Alerts", icon: Bell, color: "text-red-400" }
                                    ].map((stat, i) => (
                                        <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                            <div className="flex justify-between items-start mb-4">
                                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                                <ArrowUpRight className="w-4 h-4 text-gray-500" />
                                            </div>
                                            <div className="text-gray-500 text-xs mb-1 uppercase tracking-wider">{stat.label}</div>
                                            <div className="text-xl font-bold text-white">{stat.value}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Main Graph Area */}
                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 h-64 relative overflow-hidden">
                                    <div className="flex justify-between items-center mb-8">
                                        <div className="text-sm font-bold text-white">Revenue Growth</div>
                                        <div className="flex gap-2">
                                            <div className="px-3 py-1 rounded-full bg-white/10 text-[10px] text-gray-400">Weekly</div>
                                            <div className="px-3 py-1 rounded-full bg-[#FFD700]/20 text-[10px] text-[#FFD700]">Monthly</div>
                                        </div>
                                    </div>

                                    {/* Abstract Graph Lines */}
                                    <div className="absolute bottom-12 left-6 right-6 h-32 flex items-end gap-2">
                                        {[40, 70, 45, 90, 65, 80, 100, 85, 95, 75, 60, 40].map((h, i) => (
                                            <div
                                                key={i}
                                                className="flex-1 bg-gradient-to-t from-[#FFD700]/40 to-[#FFD700] rounded-t-sm"
                                                style={{ height: `${h}%` }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Bottom Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                        <div className="text-sm font-bold text-white mb-4">Top AI Insights</div>
                                        <div className="space-y-3">
                                            <div className="p-3 rounded-lg bg-[#FFD700]/5 border border-[#FFD700]/10 text-xs text-gray-400">
                                                <span className="text-[#FFD700] font-bold">Tip:</span> Deduct TSh 450k for office repairs.
                                            </div>
                                            <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/10 text-xs text-gray-400">
                                                <span className="text-blue-400 font-bold">Info:</span> VAT filing due in 3 days.
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                        <div className="text-center">
                                            <Search className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                                            <div className="text-xs text-gray-500 italic">Advanced filters enabled</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Background Globs */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-30 pointer-events-none">
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[160px]" />
                        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FFD700] rounded-full blur-[160px]" />
                    </div>
                </div>
            </div>
        </section>
    );
}
