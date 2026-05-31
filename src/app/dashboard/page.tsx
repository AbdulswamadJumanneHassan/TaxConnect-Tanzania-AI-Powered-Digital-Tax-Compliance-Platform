"use client";

import { motion } from "framer-motion";
import {
    LayoutDashboard,
    Receipt,
    Wallet,
    Award,
    Settings,
    Bell,
    TrendingUp,
    ArrowUpRight,
    PlusCircle,
    FileText,
    BadgeCheck
} from "lucide-react";
import { Logo } from "@/components/Logo";
import Link from "next/link";

export default function Dashboard() {
    return (
        <main className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden lg:flex">
                <div className="p-6">
                    <Logo />
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {[
                        { icon: LayoutDashboard, label: "Dashboard", active: true },
                        { icon: Receipt, label: "Risiti Zangu" },
                        { icon: Wallet, label: "Miamala" },
                        { icon: Award, label: "Tuzo & Beji" },
                        { icon: FileText, label: "Ripoti" },
                        { icon: Settings, label: "Mipangilio" },
                    ].map((item) => (
                        <button
                            key={item.label}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${item.active ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-500 hover:bg-slate-50"
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <div className="bg-primary/5 p-4 rounded-2xl">
                        <p className="text-[10px] uppercase font-bold text-primary mb-1">Msaada wa AI</p>
                        <p className="text-xs text-slate-600 mb-3">Una swali la kodi leo?</p>
                        <Link href="#" className="text-xs font-bold text-primary hover:underline">Uliza AI sasa</Link>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-800">Muhtasari wa Biashara</h2>
                    <div className="flex items-center gap-4">
                        <button className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-primary transition-colors">
                            <Bell className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
                            <div className="text-right">
                                <p className="text-xs font-bold text-slate-900 leading-none">Juma Haruna</p>
                                <p className="text-[10px] text-slate-400">Haruna Clothing</p>
                            </div>
                            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white font-bold">
                                JH
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-8 overflow-y-auto">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {[
                            { label: "Mauzo ya Leo", value: "254,000 TZS", icon: Wallet, trend: "+12%" },
                            { label: "Risiti za Mwezi", value: "128", icon: Receipt, trend: "+5%" },
                            { label: "Kodi Inayokadiriwa", value: "45,000 TZS", icon: FileText, trend: "-2%" },
                            { label: "Pointi za Tuzo", value: "850", icon: Award, trend: "+50" },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${stat.trend.startsWith("+") ? "bg-green-50 text-green-500" : "bg-red-50 text-red-500"}`}>
                                        {stat.trend}
                                    </span>
                                </div>
                                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                            </motion.div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Chart/Insights Area */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <h3 className="text-xl font-bold">Mwenendo wa Mauzo</h3>
                                        <p className="text-sm text-slate-400">Ukuaji wa biashara mwezi huu</p>
                                    </div>
                                    <button className="flex items-center gap-2 text-primary font-bold text-sm">
                                        Wiki Hii <TrendingUp className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="h-64 flex items-end justify-between gap-2">
                                    {[40, 25, 65, 45, 90, 55, 75].map((h, i) => (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: `${h}%` }}
                                                transition={{ duration: 1, delay: i * 0.1 }}
                                                className="w-full bg-slate-100 rounded-lg relative group cursor-pointer"
                                            >
                                                <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                                            </motion.div>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase">Siku {i + 1}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold">Risiti za Karibuni</h3>
                                    <Link href="#" className="text-primary text-sm font-bold">Tazama Zote</Link>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { name: "Haruna Msaki", amount: "45,000 TZS", time: "Dakika 10 zilizopita" },
                                        { name: "Fatuma Bakari", amount: "12,500 TZS", time: "Saa 1 lililopita" },
                                        { name: "Salehe Juma", amount: "89,000 TZS", time: "Saa 3 zilizopita" },
                                    ].map((r, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary border border-slate-200">
                                                    <Receipt className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold">{r.name}</p>
                                                    <p className="text-[10px] text-slate-400 uppercase font-bold">{r.time}</p>
                                                </div>
                                            </div>
                                            <p className="font-bold text-sm">{r.amount}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right column */}
                        <div className="space-y-8">
                            {/* Rewards Card */}
                            <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-20">
                                    <Award className="w-24 h-24" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Tuzo za Kodi</h3>
                                <p className="text-zinc-400 text-sm mb-6">Endelea kutoa risiti ili kupokea beji rasmi ya TRA.</p>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/40">
                                            <BadgeCheck className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">Mlipakodi Shupavu</p>
                                            <p className="text-[10px] text-zinc-500 uppercase">Imepatikana</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 grayscale opacity-40">
                                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                            <TrendingUp className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">Ukuaji wa Dhahabu</p>
                                            <p className="text-[10px] text-zinc-500 uppercase">90% Imekamilika</p>
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full mt-8 py-4 bg-primary text-white rounded-2xl font-bold text-sm shadow-xl shadow-primary/20">
                                    Tazama Zawadi
                                </button>
                            </div>

                            {/* Add Receipt Button */}
                            <button className="w-full py-6 bg-white border-2 border-dashed border-primary/20 rounded-3xl text-primary font-bold flex flex-col items-center gap-3 hover:bg-primary/5 transition-all">
                                <PlusCircle className="w-10 h-10" />
                                Tengeneza Risiti Mpya
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
