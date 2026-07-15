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
    X,
    ScanLine,
    Cpu,
    Menu
} from "lucide-react";
import { Logo } from "@/components/Logo";
import Link from "next/link";
import { ReceiptModal } from "@/components/ReceiptModal";
import { DigitalReceipt } from "@/components/DigitalReceipt";
import { ReceiptScanModal } from "@/components/ReceiptScanModal";

import { JWTPayload } from "@/lib/auth";
import { StoredReceipt } from "@/lib/receipt-store";

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<JWTPayload | null>(null);
    const [receipts, setReceipts] = useState<StoredReceipt[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReceipt, setSelectedReceipt] = useState<StoredReceipt | null>(null);
    const [isScanModalOpen, setIsScanModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("Dashboard");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

    const downloadReport = () => {
        if (receipts.length === 0) {
            alert("Hakuna miamala ya kupakua.");
            return;
        }

        const headers = ["Tarehe", "Mteja", "Kiasi (TZS)", "Njia ya Malipo", "Aina"];
        const rows = receipts.map(r => [
            new Date(r.date).toLocaleString('sw-TZ').replace(/,/g, ''),
            `"${r.customerName}"`,
            r.total,
            r.paymentMethod,
            r.sourceType === "ai-scanned" ? "AI Scanned" : "Manual"
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(e => e.join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Ripoti_ya_Miamala_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 flex">
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:flex ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="p-6 flex items-center justify-between">
                    <Logo />
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {[
                        { icon: LayoutDashboard, label: "Dashboard" },
                        { icon: ReceiptIcon, label: "Risiti Zangu" },
                        { icon: Wallet, label: "Miamala" },
                        { icon: Award, label: "Tuzo & Beji" },
                        { icon: FileText, label: "Ripoti" },
                        { icon: Settings, label: "Mipangilio" },
                    ].map((item) => (
                        <button
                            key={item.label}
                            onClick={() => {
                                setActiveTab(item.label);
                                setIsSidebarOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === item.label ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-500 hover:bg-slate-50"
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </button>
                    ))}

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-yellow-500 hover:bg-yellow-50 transition-all mt-8"
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
                <header className="h-20 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <button 
                            className="lg:hidden p-2 -ml-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu className="w-5 h-5 md:w-6 md:h-6" />
                        </button>
                        <h2 className="text-lg md:text-xl font-bold text-slate-800">
                            {activeTab === "Dashboard" ? "Muhtasari wa Biashara" : activeTab}
                        </h2>
                    </div>
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

                <div className="p-4 md:p-8 overflow-y-auto">
                    {activeTab === "Dashboard" ? (
                        <>
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
                                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${stat.trend.startsWith("+") ? "bg-yellow-50 text-yellow-500" : "bg-yellow-50 text-yellow-500"}`}>
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
                                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary border border-slate-200 relative">
                                                        <ReceiptIcon className="w-5 h-5" />
                                                        {r.sourceType === "ai-scanned" && (
                                                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                                                                <Cpu className="w-2.5 h-2.5 text-white" />
                                                            </span>
                                                        )}
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

                            {/* Scan Receipt with AI Button */}
                            <button
                                onClick={() => setIsScanModalOpen(true)}
                                className="w-full py-6 bg-slate-900 border-2 border-slate-700 rounded-3xl text-primary font-bold flex flex-col items-center gap-3 hover:bg-slate-800 transition-all"
                            >
                                <ScanLine className="w-10 h-10" />
                                <span className="flex flex-col items-center">
                                    <span>Scan Receipt with AI</span>
                                    <span className="text-[10px] font-normal text-slate-400 uppercase tracking-widest mt-1">Powered by Gemini</span>
                                </span>
                            </button>

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
                        </>
                    ) : activeTab === "Risiti Zangu" ? (
                        <div className="space-y-6 max-w-5xl mx-auto">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-800">Risiti Zangu Zote</h3>
                                    <p className="text-sm text-slate-500 mt-1">Tazama na dhibiti risiti zako zote ulizotoa.</p>
                                </div>
                                <div className="flex gap-3 w-full sm:w-auto">
                                    <button 
                                        onClick={() => setIsScanModalOpen(true)}
                                        className="flex-1 sm:flex-none px-4 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
                                    >
                                        <ScanLine className="w-5 h-5" /> Scan Risiti
                                    </button>
                                    <button 
                                        onClick={() => setIsModalOpen(true)}
                                        className="flex-1 sm:flex-none px-4 py-3 bg-primary text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors"
                                    >
                                        <PlusCircle className="w-5 h-5" /> Mpya
                                    </button>
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Jumla ya Risiti: {receipts.length}</p>
                                </div>
                                <div className="divide-y divide-slate-100">
                                    {receipts.length === 0 ? (
                                        <div className="text-center py-16 bg-slate-50/30">
                                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <ReceiptIcon className="w-10 h-10 text-slate-300" />
                                            </div>
                                            <p className="text-slate-500 font-medium">Huna risiti yoyote kwa sasa.</p>
                                            <p className="text-slate-400 text-sm mt-1">Anza kwa kutengeneza au kuscan risiti mpya.</p>
                                        </div>
                                    ) : (
                                        receipts.map((r) => (
                                            <div key={r.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 hover:bg-slate-50 transition-colors group gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary border border-slate-200 relative shadow-sm shrink-0">
                                                        <ReceiptIcon className="w-6 h-6" />
                                                        {r.sourceType === "ai-scanned" && (
                                                            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-slate-900 rounded-full flex items-center justify-center shadow-sm border-2 border-white">
                                                                <Cpu className="w-3 h-3 text-white" />
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-base font-bold text-slate-800">{r.customerName}</p>
                                                        <div className="flex flex-wrap items-center gap-2 mt-1">
                                                            <p className="text-[11px] text-slate-600 uppercase font-bold bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
                                                                {new Date(r.date).toLocaleDateString('sw-TZ', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                            </p>
                                                            <p className="text-[11px] text-slate-500 uppercase font-bold">
                                                                {new Date(r.date).toLocaleTimeString('sw-TZ', { hour: '2-digit', minute: '2-digit' })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0 border-slate-100">
                                                    <div className="text-left sm:text-right">
                                                        <p className="font-bold text-lg text-slate-800">{r.total.toLocaleString()} TZS</p>
                                                        <p className="text-[11px] text-primary uppercase font-bold bg-primary/10 px-2 py-0.5 rounded-md inline-block mt-1">{r.paymentMethod}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => setSelectedReceipt(r)}
                                                        className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 sm:opacity-0 group-hover:opacity-100 transition-all hover:text-primary hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm"
                                                    >
                                                        <Eye className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : activeTab === "Miamala" ? (
                        <div className="space-y-6 max-w-5xl mx-auto">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-800">Miamala Yako</h3>
                                    <p className="text-sm text-slate-500 mt-1">Fuatilia mauzo na makadirio ya kodi kwa urahisi.</p>
                                </div>
                                <button 
                                    onClick={downloadReport}
                                    className="px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors shadow-sm"
                                >
                                    <FileText className="w-5 h-5" /> Pakua Ripoti
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                                    <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-500 mb-4">
                                        <Wallet className="w-6 h-6" />
                                    </div>
                                    <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Jumla ya Mauzo</p>
                                    <h3 className="text-2xl font-bold text-slate-900">{receipts.reduce((sum, r) => sum + r.total, 0).toLocaleString()} TZS</h3>
                                </div>
                                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mb-4">
                                        <TrendingUp className="w-6 h-6" />
                                    </div>
                                    <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Miamala Leo</p>
                                    <h3 className="text-2xl font-bold text-slate-900">{receipts.filter(r => r.date.startsWith(new Date().toISOString().split("T")[0])).length}</h3>
                                </div>
                                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                                    <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-4">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Kodi Inayokadiriwa (5%)</p>
                                    <h3 className="text-2xl font-bold text-slate-900">{(receipts.reduce((sum, r) => sum + r.total, 0) * 0.05).toLocaleString()} TZS</h3>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Historia ya Miamala</p>
                                </div>
                                <div className="divide-y divide-slate-100">
                                    {receipts.length === 0 ? (
                                        <div className="text-center py-16 bg-slate-50/30">
                                            <p className="text-slate-500 font-medium">Hakuna miamala bado.</p>
                                        </div>
                                    ) : (
                                        receipts.map((r) => (
                                            <div key={r.id} className="flex items-center justify-between p-6 hover:bg-slate-50 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-500 shrink-0">
                                                        <ArrowUpRight className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800 line-clamp-1">Mauzo - {r.customerName}</p>
                                                        <p className="text-[11px] text-slate-500 mt-1">{new Date(r.date).toLocaleString('sw-TZ')}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-green-500 text-sm sm:text-base">+{r.total.toLocaleString()} TZS</p>
                                                    <p className="text-[10px] text-slate-400 uppercase font-bold mt-1">{r.paymentMethod}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : activeTab === "Tuzo & Beji" ? (
                        <div className="space-y-6 max-w-5xl mx-auto">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-800">Tuzo & Beji Zako</h3>
                                    <p className="text-sm text-slate-500 mt-1">Kamilisha malengo ya kodi na ujishindie pointi.</p>
                                </div>
                                <div className="bg-primary/10 text-primary px-5 py-3 rounded-xl font-bold flex items-center gap-3 shadow-sm border border-primary/20">
                                    <Award className="w-5 h-5" />
                                    <span>Pointi Zako: {(receipts.length * 10).toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Mlipakodi Shupavu */}
                                <div className="bg-white p-6 rounded-3xl shadow-sm border border-primary/20 relative overflow-hidden group hover:shadow-md transition-all">
                                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all"></div>
                                    <div className="flex items-start gap-4 mb-4 relative z-10">
                                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0 border border-primary/20">
                                            <BadgeCheck className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg text-slate-800">Mlipakodi Shupavu</h4>
                                            <p className="text-xs text-slate-500 mt-1">Imetolewa kwa kuanza kutumia mfumo na kutoa risiti yako ya kwanza.</p>
                                        </div>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2.5 mb-2 relative z-10">
                                        <div className="bg-primary h-2.5 rounded-full w-full"></div>
                                    </div>
                                    <p className="text-[10px] font-bold text-primary uppercase tracking-wider relative z-10">Imepatikana</p>
                                </div>

                                {/* Ukuaji wa Dhahabu */}
                                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden opacity-75 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                                    <div className="flex items-start gap-4 mb-4 relative z-10">
                                        <div className="w-14 h-14 bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-500 shrink-0">
                                            <TrendingUp className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg text-slate-800">Ukuaji wa Dhahabu</h4>
                                            <p className="text-xs text-slate-500 mt-1">Tengeneza risiti 50 ndani ya mwezi mmoja kupata beji hii.</p>
                                        </div>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2.5 mb-2 relative z-10">
                                        <div className="bg-yellow-400 h-2.5 rounded-full transition-all" style={{ width: `${Math.min((receipts.length / 50) * 100, 100)}%` }}></div>
                                    </div>
                                    <div className="flex justify-between items-center relative z-10">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{receipts.length} / 50 Risiti</p>
                                        <p className="text-[10px] font-bold text-yellow-500 uppercase tracking-wider">{Math.round(Math.min((receipts.length / 50) * 100, 100))}% Imekamilika</p>
                                    </div>
                                </div>
                                
                                {/* Nyota wa Kidigitali */}
                                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden opacity-75 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                                    <div className="flex items-start gap-4 mb-4 relative z-10">
                                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 shrink-0">
                                            <ScanLine className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg text-slate-800">Nyota wa Kidigitali</h4>
                                            <p className="text-xs text-slate-500 mt-1">Tumia AI Scan kuingiza risiti 10 kwa urahisi.</p>
                                        </div>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2.5 mb-2 relative z-10">
                                        <div className="bg-blue-400 h-2.5 rounded-full transition-all" style={{ width: `${Math.min((receipts.filter(r => r.sourceType === "ai-scanned").length / 10) * 100, 100)}%` }}></div>
                                    </div>
                                    <div className="flex justify-between items-center relative z-10">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{receipts.filter(r => r.sourceType === "ai-scanned").length} / 10 Risiti</p>
                                        <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">{Math.round(Math.min((receipts.filter(r => r.sourceType === "ai-scanned").length / 10) * 100, 100))}% Imekamilika</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-slate-900 text-white rounded-3xl p-8 mt-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                                <div className="absolute -right-10 -top-10 opacity-10">
                                    <Award className="w-64 h-64" />
                                </div>
                                <div className="relative z-10 max-w-lg">
                                    <h3 className="text-2xl font-bold mb-2 text-primary">Pata Punguzo la Kodi</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        Kusanya pointi 1,000 na upate <strong className="text-white">punguzo la 2%</strong> kwenye kodi yako inayokadiriwa mwezi huu. Endelea kutumia mfumo huu kuwa mlipakodi bora wa mfano.
                                    </p>
                                </div>
                                <div className="relative z-10 text-center bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/10 min-w-[200px]">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Pointi Zilizobaki</p>
                                    <h2 className="text-3xl font-bold text-white">{Math.max(1000 - (receipts.length * 10), 0).toLocaleString()}</h2>
                                    <div className="w-full bg-white/10 rounded-full h-1 mt-4 overflow-hidden">
                                        <div className="bg-primary h-1 rounded-full transition-all" style={{ width: `${Math.min(((receipts.length * 10) / 1000) * 100, 100)}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : activeTab === "Ripoti" ? (
                        <div className="space-y-6 max-w-5xl mx-auto">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-800">Ripoti za Biashara</h3>
                                    <p className="text-sm text-slate-500 mt-1">Uchambuzi wa kina wa mauzo na kodi zako.</p>
                                </div>
                                <div className="flex gap-2">
                                    <select className="bg-white border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-2 outline-none focus:border-primary shadow-sm cursor-pointer hover:bg-slate-50 transition-colors">
                                        <option>Mwezi Huu</option>
                                        <option>Mwezi Uliopita</option>
                                        <option>Mwaka Huu</option>
                                    </select>
                                    <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-sm">
                                        <FileText className="w-4 h-4" /> Hamisha
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                                <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-center min-h-[300px]">
                                    <div className="flex items-center justify-between mb-6">
                                        <h4 className="font-bold text-slate-800">Mwenendo wa Mauzo</h4>
                                        <p className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-lg">+12.5%</p>
                                    </div>
                                    {/* Placeholder for a chart */}
                                    <div className="flex-1 flex items-end gap-2 mt-4 pt-4 border-b border-slate-100 relative">
                                        {/* Y-axis labels placeholder */}
                                        <div className="absolute left-0 top-0 bottom-0 w-full flex flex-col justify-between pointer-events-none opacity-20 text-[10px] text-slate-500">
                                            <div className="border-t border-slate-300 border-dashed w-full"></div>
                                            <div className="border-t border-slate-300 border-dashed w-full"></div>
                                            <div className="border-t border-slate-300 border-dashed w-full"></div>
                                        </div>

                                        {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
                                            <div key={i} className="flex-1 bg-primary/10 rounded-t-lg relative group transition-all hover:bg-primary cursor-pointer z-10" style={{ height: `${h}%` }}>
                                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                                                    Siku {i + 1}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between mt-3 text-[10px] font-bold text-slate-400 uppercase">
                                        <span>J3</span><span>J4</span><span>J5</span><span>Alh</span><span>Ij</span><span>Jmo</span><span>Jpi</span>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col min-h-[300px]">
                                    <h4 className="font-bold text-slate-800 mb-6">Mchanganuo wa Malipo</h4>
                                    
                                    <div className="space-y-6 flex-1 flex flex-col justify-center">
                                        <div className="group">
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-slate-600 font-medium flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div>Pesa Taslimu</span>
                                                <span className="font-bold text-slate-800">
                                                    {receipts.filter(r => r.paymentMethod === 'Cash' || r.paymentMethod === 'CASH').length}
                                                </span>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                                <div className="bg-blue-500 h-full rounded-full transition-all group-hover:bg-blue-400" style={{ width: '45%' }}></div>
                                            </div>
                                        </div>
                                        <div className="group">
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-slate-600 font-medium flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div>Miamala ya Simu</span>
                                                <span className="font-bold text-slate-800">
                                                    {receipts.filter(r => r.paymentMethod !== 'Cash' && r.paymentMethod !== 'CASH' && r.paymentMethod !== 'Card' && r.paymentMethod !== 'Bank').length}
                                                </span>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                                <div className="bg-green-500 h-full rounded-full transition-all group-hover:bg-green-400" style={{ width: '35%' }}></div>
                                            </div>
                                        </div>
                                        <div className="group">
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-slate-600 font-medium flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-purple-500"></div>Benki / Kadi</span>
                                                <span className="font-bold text-slate-800">
                                                    {receipts.filter(r => r.paymentMethod === 'Card' || r.paymentMethod === 'Bank').length}
                                                </span>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                                <div className="bg-purple-500 h-full rounded-full transition-all group-hover:bg-purple-400" style={{ width: '20%' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sm:p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <h4 className="font-bold text-lg text-slate-800">Kodi ya Ongezeko la Thamani (VAT)</h4>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    <div className="p-6 bg-slate-50 hover:bg-slate-100 transition-colors rounded-2xl border border-slate-100/80">
                                        <p className="text-[11px] text-slate-500 uppercase tracking-widest font-bold mb-2">Mauzo Yasiyotozwa VAT</p>
                                        <p className="text-2xl font-black text-slate-400">0 <span className="text-sm font-bold text-slate-400">TZS</span></p>
                                    </div>
                                    <div className="p-6 bg-slate-50 hover:bg-slate-100 transition-colors rounded-2xl border border-slate-100/80">
                                        <p className="text-[11px] text-slate-500 uppercase tracking-widest font-bold mb-2">Mauzo Yanayotozwa VAT</p>
                                        <p className="text-2xl font-black text-slate-800">{receipts.reduce((sum, r) => sum + r.total, 0).toLocaleString()} <span className="text-sm font-bold text-slate-500">TZS</span></p>
                                    </div>
                                    <div className="p-6 bg-primary/5 hover:bg-primary/10 transition-colors rounded-2xl border border-primary/20 shadow-sm shadow-primary/5">
                                        <p className="text-[11px] text-primary uppercase tracking-widest font-bold mb-2">VAT Inayokadiriwa (18%)</p>
                                        <p className="text-2xl font-black text-primary">{(receipts.reduce((sum, r) => sum + r.total, 0) * 0.18).toLocaleString()} <span className="text-sm font-bold opacity-70">TZS</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                                <FileText className="w-10 h-10 text-slate-300" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-2">Inakuja Hivi Punde</h3>
                            <p className="text-slate-500 max-w-md">
                                Ukurasa wa "{activeTab}" unajengwa. Tafadhali rudi baadaye ili kuona vipengele vipya.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <ReceiptModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchReceipts}
            />

            <ReceiptScanModal
                isOpen={isScanModalOpen}
                onClose={() => setIsScanModalOpen(false)}
                onSave={() => fetchReceipts()}
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
