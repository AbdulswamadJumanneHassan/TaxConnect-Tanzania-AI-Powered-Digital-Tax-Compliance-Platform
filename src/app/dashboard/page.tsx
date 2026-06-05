"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Receipt as ReceiptIcon,
    Wallet,
    Award,
    Settings,
    Bell,
    TrendingUp,
    ArrowUpRight,
    PlusCircle,
    FileText,
    BadgeCheck,
    LogOut,
    Eye,
    X
} from "lucide-react";
import { Logo } from "@/components/Logo";
import Link from "next/link";
import { ReceiptModal } from "@/components/ReceiptModal";
import { DigitalReceipt } from "@/components/DigitalReceipt";

import { JWTPayload } from "@/lib/auth";
import { StoredReceipt } from "@/lib/receipt-store";

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<JWTPayload | null>(null);
    const [receipts, setReceipts] = useState<StoredReceipt[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReceipt, setSelectedReceipt] = useState<StoredReceipt | null>(null);

    const fetchSession = async () => {
        try {
            const res = await fetch("/api/auth/session");
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            } else {
                router.push("/login");
            }
        } catch (error) {
            console.error("Failed to fetch session", error);
        }
    };

    const fetchReceipts = async () => {
        try {
            const res = await fetch("/api/receipts");
            if (res.ok) {
                const data = await res.json();
                setReceipts(data.receipts);
            }
        } catch (error) {
            console.error("Failed to fetch receipts", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const init = async () => {
            await fetchSession();
            await fetchReceipts();
        };
        init();
    }, [router]);

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    // Calculate stats
    const today = new Date().toISOString().split("T")[0];
    const dailySales = receipts
        .filter(r => r.date.startsWith(today))
        .reduce((sum, r) => sum + r.total, 0);

    const monthlyReceipts = receipts.filter(r => {
        const rDate = new Date(r.date);
        const now = new Date();
        return rDate.getMonth() === now.getMonth() && rDate.getFullYear() === now.getFullYear();
    }).length;

    const estimatedTax = dailySales * 0.05; // 5% flat estimation for demo

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

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
                        { icon: ReceiptIcon, label: "Risiti Zangu" },
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

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-500 hover:bg-red-50 transition-all mt-8"
                    >
                        <LogOut className="w-5 h-5" />
                        Ondoka
                    </button>
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <div className="bg-primary/5 p-4 rounded-2xl">
                        <p className="text-[10px] uppercase font-bold text-primary mb-1">Msaada wa AI</p>
                        <p className="text-xs text-slate-600 mb-3">Una swali la kodi leo?</p>
                        <Link href="/#chat" className="text-xs font-bold text-primary hover:underline">Uliza AI sasa</Link>
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
                                <p className="text-xs font-bold text-slate-900 leading-none">{user?.ownerName || "Mtumiaji"}</p>
                                <p className="text-[10px] text-slate-400">{user?.businessName || "Biashara"}</p>
                            </div>
                            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white font-bold">
                                {user?.ownerName?.substring(0, 2).toUpperCase() || "MT"}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-8 overflow-y-auto">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {[
                            { label: "Mauzo ya Leo", value: `${dailySales.toLocaleString()} TZS`, icon: Wallet, trend: "+100%" },
                            { label: "Risiti za Mwezi", value: monthlyReceipts.toString(), icon: ReceiptIcon, trend: `+${monthlyReceipts}` },
                            { label: "Kodi Inayokadiriwa", value: `${estimatedTax.toLocaleString()} TZS`, icon: FileText, trend: "5%" },
                            { label: "Pointi za Tuzo", value: (receipts.length * 10).toString(), icon: Award, trend: "+10" },
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
                                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${stat.trend.startsWith("+") ? "bg-green-50 text-green-500" : "bg-blue-50 text-blue-500"}`}>
                                        {stat.trend}
                                    </span>
                                </div>
                                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                            </motion.div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Area */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold">Risiti za Karibuni</h3>
                                    <Link href="#" className="text-primary text-sm font-bold">Tazama Zote</Link>
                                </div>
                                <div className="space-y-4">
                                    {receipts.length === 0 ? (
                                        <div className="text-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-100">
                                            <p className="text-slate-400 text-sm">Hujatoa risiti yoyote leo. Anza sasa!</p>
                                        </div>
                                    ) : (
                                        receipts.slice(0, 5).map((r, i) => (
                                            <div key={r.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary border border-slate-200">
                                                        <ReceiptIcon className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold">{r.customerName}</p>
                                                        <p className="text-[10px] text-slate-400 uppercase font-bold">
                                                            {new Date(r.date).toLocaleTimeString('sw-TZ', { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="text-right">
                                                        <p className="font-bold text-sm">{r.total.toLocaleString()} TZS</p>
                                                        <p className="text-[10px] text-primary uppercase font-bold">{r.paymentMethod}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => setSelectedReceipt(r)}
                                                        className="p-2 bg-white rounded-lg text-slate-400 opacity-0 group-hover:opacity-100 transition-all hover:text-primary"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
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
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="w-full py-6 bg-white border-2 border-dashed border-primary/20 rounded-3xl text-primary font-bold flex flex-col items-center gap-3 hover:bg-primary/5 transition-all"
                            >
                                <PlusCircle className="w-10 h-10" />
                                Tengeneza Risiti Mpya
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <ReceiptModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchReceipts}
            />

            <AnimatePresence>
                {selectedReceipt && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedReceipt(null)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-sm max-h-[90vh] overflow-y-auto rounded-3xl"
                        >
                            <button
                                onClick={() => setSelectedReceipt(null)}
                                className="absolute top-4 right-4 z-10 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <DigitalReceipt
                                receipt={{
                                    id: selectedReceipt.id,
                                    customer: selectedReceipt.customerName,
                                    items: selectedReceipt.items,
                                    total: selectedReceipt.total,
                                    date: new Date(selectedReceipt.date).toLocaleString(),
                                    qrValue: selectedReceipt.qrCode
                                }}
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </main>
    );
}
