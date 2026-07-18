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
    Menu,
    Trash2,
    Check,
    Search,
    SlidersHorizontal
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
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [showNotifications, setShowNotifications] = useState(false);
    const [deleteReceiptId, setDeleteReceiptId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterPayment, setFilterPayment] = useState("Zote");
    const [sortOrder, setSortOrder] = useState("newest");
    const [reportPeriod, setReportPeriod] = useState("this_month");

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

    // --- Reports: period filtering ---
    const reportReceipts = receipts.filter((r) => {
        const d = new Date(r.date);
        const now = new Date();
        if (reportPeriod === "this_month") {
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        }
        if (reportPeriod === "last_month") {
            const lm = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            return d.getMonth() === lm.getMonth() && d.getFullYear() === lm.getFullYear();
        }
        if (reportPeriod === "this_year") {
            return d.getFullYear() === now.getFullYear();
        }
        return true;
    });

    // Chart buckets — last 7 days (month view) or 12 months (year view)
    const chartBuckets: { label: string; total: number }[] = (() => {
        const now = new Date();
        if (reportPeriod === "this_year") {
            const months = ["Jan","Feb","Mac","Apr","Mei","Jun","Jul","Ago","Sep","Okt","Nov","Des"];
            return months.map((label, idx) => ({
                label,
                total: reportReceipts
                    .filter(r => new Date(r.date).getMonth() === idx)
                    .reduce((s, r) => s + r.total, 0),
            }));
        }
        // last 7 days
        return Array.from({ length: 7 }, (_, i) => {
            const day = new Date(now);
            day.setDate(now.getDate() - (6 - i));
            const key = day.toISOString().split("T")[0];
            return {
                label: day.toLocaleDateString("sw-TZ", { weekday: "short" }),
                total: receipts
                    .filter(r => r.date.startsWith(key))
                    .reduce((s, r) => s + r.total, 0),
            };
        });
    })();

    const chartMax = Math.max(...chartBuckets.map(b => b.total), 1);

    // Payment breakdown with real percentages
    const cashCount = reportReceipts.filter(r => r.paymentMethod === "Cash").length;
    const mpesaCount = reportReceipts.filter(r => r.paymentMethod === "M-Pesa").length;
    const otherCount = reportReceipts.filter(r => r.paymentMethod !== "Cash" && r.paymentMethod !== "M-Pesa").length;
    const totalCount = reportReceipts.length || 1;
    const cashPct = Math.round((cashCount / totalCount) * 100);
    const mpesaPct = Math.round((mpesaCount / totalCount) * 100);
    const otherPct = 100 - cashPct - mpesaPct;

    const reportTotal = reportReceipts.reduce((s, r) => s + r.total, 0);

    const downloadReportFiltered = () => {
        if (reportReceipts.length === 0) { alert("Hakuna miamala ya kupakua kwa kipindi hiki."); return; }
        const headers = ["Tarehe", "Mteja", "Kiasi (TZS)", "Njia ya Malipo", "Aina"];
        const rows = reportReceipts.map(r => [
            new Date(r.date).toLocaleString("sw-TZ").replace(/,/g, ""),
            `"${r.customerName}"`,
            r.total,
            r.paymentMethod,
            r.sourceType === "ai-scanned" ? "AI Scanned" : "Manual",
        ]);
        const csv = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = `Ripoti_${reportPeriod}_${new Date().toISOString().split("T")[0]}.csv`;
        a.style.visibility = "hidden"; document.body.appendChild(a); a.click(); document.body.removeChild(a);
    };

    // Filtered & sorted receipts for "Risiti Zangu" tab
    const filteredReceipts = receipts
        .filter((r) => {
            const matchesSearch = searchQuery === "" ||
                r.customerName.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesPayment = filterPayment === "Zote" ||
                r.paymentMethod.toLowerCase() === filterPayment.toLowerCase();
            return matchesSearch && matchesPayment;
        })
        .sort((a, b) => {
            if (sortOrder === "newest") return new Date(b.date).getTime() - new Date(a.date).getTime();
            if (sortOrder === "oldest") return new Date(a.date).getTime() - new Date(b.date).getTime();
            if (sortOrder === "highest") return b.total - a.total;
            if (sortOrder === "lowest") return a.total - b.total;
            return 0;
        });

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

    const handleDeleteReceipt = async (id: string) => {
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/receipts/${id}`, { method: "DELETE" });
            if (res.ok) {
                setDeleteReceiptId(null);
                await fetchReceipts();
                setToastMessage('Risiti imefutwa kikamilifu!');
                setTimeout(() => setToastMessage(null), 3000);
            } else {
                const data = await res.json();
                setToastMessage(data.error || 'Imeshindwa kufuta risiti.');
                setTimeout(() => setToastMessage(null), 3000);
            }
        } catch {
            setToastMessage('Hitilafu ya mtandao. Jaribu tena.');
            setTimeout(() => setToastMessage(null), 3000);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setProfileImage(url);
        }
    };

    const handleSaveSettings = async () => {
        setIsSaving(true);
        const newBusinessName = (document.getElementById('businessNameInput') as HTMLInputElement)?.value;
        const newTin = (document.getElementById('tinInput') as HTMLInputElement)?.value;
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Update local user state
        if (user) {
            setUser({ 
                ...user, 
                businessName: newBusinessName || user.businessName, 
                tin: newTin || user.tin 
            });
        }
        
        setIsSaving(false);
        setToastMessage('Mipangilio imehifadhiwa kikamilifu!');
        setTimeout(() => setToastMessage(null), 3000);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <main className="h-screen overflow-hidden bg-slate-50 flex">
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
                        <div className="relative">
                            <button 
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-primary transition-colors relative"
                            >
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-50"></span>
                            </button>

                            <AnimatePresence>
                                {showNotifications && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden"
                                    >
                                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                                            <h4 className="font-bold text-slate-800 text-sm">Arifa (Alerts)</h4>
                                            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">Mpya 2</span>
                                        </div>
                                        <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                                            <div className="p-4 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3">
                                                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-500 shrink-0 mt-0.5">
                                                    <Award className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800">Umepata pointi 10!</p>
                                                    <p className="text-xs text-slate-500 mt-0.5">Umetengeneza risiti mpya kikamilifu.</p>
                                                    <p className="text-[10px] text-slate-400 mt-1">Sasa hivi</p>
                                                </div>
                                            </div>
                                            <div className="p-4 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0 mt-0.5">
                                                    <Bell className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800">Kumbukumbu ya Kodi</p>
                                                    <p className="text-xs text-slate-500 mt-0.5">Usahau kuwasilisha ritani yako ya kodi kabla ya mwisho wa mwezi.</p>
                                                    <p className="text-[10px] text-slate-400 mt-1">Saa 2 zilizopita</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-3 border-t border-slate-100 text-center">
                                            <button 
                                                onClick={() => setShowNotifications(false)}
                                                className="text-xs font-bold text-primary hover:underline"
                                            >
                                                Tazama zote
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        
                        <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
                            <div className="text-right">
                                <p className="text-xs font-bold text-slate-900 leading-none">{user?.ownerName || "Mtumiaji"}</p>
                                <p className="text-[10px] text-slate-400">{user?.businessName || "Biashara"}</p>
                            </div>
                            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white font-bold overflow-hidden shrink-0">
                                {profileImage ? (
                                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    user?.ownerName?.substring(0, 2).toUpperCase() || "MT"
                                )}
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
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
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

                            {/* Search & Filter Bar */}
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
                                {/* Search */}
                                <div className="relative flex-1">
                                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Tafuta kwa jina la mteja..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:bg-white transition-all"
                                    />
                                </div>
                                {/* Payment filter */}
                                <div className="relative">
                                    <SlidersHorizontal className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                    <select
                                        value={filterPayment}
                                        onChange={(e) => setFilterPayment(e.target.value)}
                                        className="pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:bg-white transition-all appearance-none cursor-pointer w-full sm:w-auto"
                                    >
                                        <option value="Zote">Malipo Yote</option>
                                        <option value="Cash">Pesa Taslimu</option>
                                        <option value="M-Pesa">M-Pesa</option>
                                        <option value="Other">Nyingine</option>
                                    </select>
                                </div>
                                {/* Sort */}
                                <select
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value)}
                                    className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:bg-white transition-all appearance-none cursor-pointer"
                                >
                                    <option value="newest">Mpya Kwanza</option>
                                    <option value="oldest">Zamani Kwanza</option>
                                    <option value="highest">Kiasi Kikubwa</option>
                                    <option value="lowest">Kiasi Kidogo</option>
                                </select>
                            </div>
                            
                            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        {filteredReceipts.length === receipts.length
                                            ? `Jumla ya Risiti: ${receipts.length}`
                                            : `Inaonyesha ${filteredReceipts.length} kati ya ${receipts.length}`}
                                    </p>
                                    {(searchQuery || filterPayment !== "Zote") && (
                                        <button
                                            onClick={() => { setSearchQuery(""); setFilterPayment("Zote"); setSortOrder("newest"); }}
                                            className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors"
                                        >
                                            <X className="w-3.5 h-3.5" /> Futa Vichujio
                                        </button>
                                    )}
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
                                    ) : filteredReceipts.length === 0 ? (
                                        <div className="text-center py-16 bg-slate-50/30">
                                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Search className="w-10 h-10 text-slate-300" />
                                            </div>
                                            <p className="text-slate-500 font-medium">Hakuna risiti zinazolingana na utafutaji wako.</p>
                                            <p className="text-slate-400 text-sm mt-1">Jaribu kutumia maneno tofauti au futa vichujio.</p>
                                        </div>
                                    ) : (
                                        filteredReceipts.map((r) => (
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
                                                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0 border-slate-100">
                                                    <div className="text-left sm:text-right mr-3">
                                                        <p className="font-bold text-lg text-slate-800">{r.total.toLocaleString()} TZS</p>
                                                        <p className="text-[11px] text-primary uppercase font-bold bg-primary/10 px-2 py-0.5 rounded-md inline-block mt-1">{r.paymentMethod}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => setSelectedReceipt(r)}
                                                        className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 sm:opacity-0 group-hover:opacity-100 transition-all hover:text-primary hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm"
                                                    >
                                                        <Eye className="w-5 h-5" />
                                                    </button>

                                                    {deleteReceiptId === r.id ? (
                                                        <div className="flex items-center gap-1.5">
                                                            <button
                                                                onClick={() => handleDeleteReceipt(r.id)}
                                                                disabled={isDeleting}
                                                                className="p-2.5 bg-red-500 rounded-xl text-white hover:bg-red-600 transition-all disabled:opacity-50 shadow-sm"
                                                                title="Thibitisha kufuta"
                                                            >
                                                                {isDeleting ? (
                                                                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                                                ) : (
                                                                    <Check className="w-4 h-4" />
                                                                )}
                                                            </button>
                                                            <button
                                                                onClick={() => setDeleteReceiptId(null)}
                                                                disabled={isDeleting}
                                                                className="p-2.5 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 transition-all"
                                                                title="Ghairi"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => setDeleteReceiptId(r.id)}
                                                            className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 sm:opacity-0 group-hover:opacity-100 transition-all hover:text-red-500 hover:border-red-200 hover:bg-red-50 hover:shadow-sm"
                                                            title="Futa risiti"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    )}
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
                                    <select
                                        value={reportPeriod}
                                        onChange={(e) => setReportPeriod(e.target.value)}
                                        className="bg-white border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-2 outline-none focus:border-primary shadow-sm cursor-pointer hover:bg-slate-50 transition-colors"
                                    >
                                        <option value="this_month">Mwezi Huu</option>
                                        <option value="last_month">Mwezi Uliopita</option>
                                        <option value="this_year">Mwaka Huu</option>
                                    </select>
                                    <button
                                        onClick={downloadReportFiltered}
                                        className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-sm"
                                    >
                                        <FileText className="w-4 h-4" /> Hamisha
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                                {/* Real bar chart */}
                                <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col min-h-[300px]">
                                    <div className="flex items-center justify-between mb-6">
                                        <h4 className="font-bold text-slate-800">Mwenendo wa Mauzo</h4>
                                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg">
                                            {reportReceipts.length} risiti
                                        </span>
                                    </div>
                                    {reportReceipts.length === 0 ? (
                                        <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                                            <TrendingUp className="w-12 h-12 text-slate-200 mb-3" />
                                            <p className="text-slate-400 text-sm">Hakuna data kwa kipindi hiki.</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex-1 flex items-end gap-1.5 pt-4 border-b border-slate-100 relative" style={{ minHeight: 180 }}>
                                                <div className="absolute left-0 top-0 bottom-0 w-full flex flex-col justify-between pointer-events-none opacity-10">
                                                    <div className="border-t border-slate-400 border-dashed w-full" />
                                                    <div className="border-t border-slate-400 border-dashed w-full" />
                                                    <div className="border-t border-slate-400 border-dashed w-full" />
                                                </div>
                                                {chartBuckets.map((b, i) => {
                                                    const pct = chartMax > 0 ? Math.max((b.total / chartMax) * 100, b.total > 0 ? 4 : 0) : 0;
                                                    return (
                                                        <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group">
                                                            <div
                                                                className="w-full bg-primary/15 hover:bg-primary rounded-t-md transition-all cursor-default relative"
                                                                style={{ height: `${pct}%` }}
                                                            >
                                                                {b.total > 0 && (
                                                                    <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg z-10">
                                                                        {b.total.toLocaleString()} TZS
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <div className={`grid mt-2 text-[9px] font-bold text-slate-400 uppercase`} style={{ gridTemplateColumns: `repeat(${chartBuckets.length}, 1fr)` }}>
                                                {chartBuckets.map((b, i) => (
                                                    <span key={i} className="text-center truncate px-0.5">{b.label}</span>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Payment breakdown — real % */}
                                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col min-h-[300px]">
                                    <h4 className="font-bold text-slate-800 mb-6">Mchanganuo wa Malipo</h4>
                                    <div className="space-y-6 flex-1 flex flex-col justify-center">
                                        {[{label:"Pesa Taslimu",count:cashCount,pct:cashPct,color:"bg-blue-500",hover:"group-hover:bg-blue-400"},{label:"M-Pesa",count:mpesaCount,pct:mpesaPct,color:"bg-green-500",hover:"group-hover:bg-green-400"},{label:"Nyingine",count:otherCount,pct:otherPct,color:"bg-purple-500",hover:"group-hover:bg-purple-400"}].map(({label,count,pct,color,hover}) => (
                                            <div key={label} className="group">
                                                <div className="flex justify-between text-sm mb-2">
                                                    <span className="text-slate-600 font-medium flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full ${color}`} />
                                                        {label}
                                                    </span>
                                                    <span className="font-bold text-slate-800">{count} ({pct}%)</span>
                                                </div>
                                                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                                    <div className={`${color} ${hover} h-full rounded-full transition-all`} style={{ width: `${pct}%` }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* VAT scoped to selected period */}
                            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sm:p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <h4 className="font-bold text-lg text-slate-800">Kodi ya Ongezeko la Thamani (VAT)</h4>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    <div className="p-6 bg-slate-50 hover:bg-slate-100 transition-colors rounded-2xl border border-slate-100/80">
                                        <p className="text-[11px] text-slate-500 uppercase tracking-widest font-bold mb-2">Idadi ya Risiti</p>
                                        <p className="text-2xl font-black text-slate-800">{reportReceipts.length}</p>
                                    </div>
                                    <div className="p-6 bg-slate-50 hover:bg-slate-100 transition-colors rounded-2xl border border-slate-100/80">
                                        <p className="text-[11px] text-slate-500 uppercase tracking-widest font-bold mb-2">Mauzo Yanayotozwa VAT</p>
                                        <p className="text-2xl font-black text-slate-800">{reportTotal.toLocaleString()} <span className="text-sm font-bold text-slate-500">TZS</span></p>
                                    </div>
                                    <div className="p-6 bg-primary/5 hover:bg-primary/10 transition-colors rounded-2xl border border-primary/20 shadow-sm shadow-primary/5">
                                        <p className="text-[11px] text-primary uppercase tracking-widest font-bold mb-2">VAT Inayokadiriwa (18%)</p>
                                        <p className="text-2xl font-black text-primary">{(reportTotal * 0.18).toLocaleString()} <span className="text-sm font-bold opacity-70">TZS</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : activeTab === "Mipangilio" ? (
                        <div className="space-y-6 max-w-4xl mx-auto">
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-slate-800">Mipangilio ya Akaunti</h3>
                                <p className="text-sm text-slate-500 mt-1">Dhibiti wasifu wako na mapendeleo ya biashara yako.</p>
                            </div>

                            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                                <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                                    <div className="flex items-center gap-6">
                                        <div className="w-20 h-20 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary font-black text-3xl border border-secondary/20 overflow-hidden shrink-0 relative group">
                                            {profileImage ? (
                                                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                user?.ownerName?.substring(0, 2).toUpperCase() || "MT"
                                            )}
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => document.getElementById('profileImageInput')?.click()}>
                                                <span className="text-white text-[10px] uppercase font-bold tracking-wider">Badili</span>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-xl text-slate-800">{user?.ownerName || "Mtumiaji"}</h4>
                                            <p className="text-sm text-slate-500">{user?.businessName || "Biashara Yangu"}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <button 
                                            onClick={() => document.getElementById('profileImageInput')?.click()}
                                            className="px-4 py-2 bg-slate-50 text-slate-700 rounded-xl text-sm font-bold border border-slate-200 hover:bg-slate-100 transition-colors w-full sm:w-auto"
                                        >
                                            Badili Picha
                                        </button>
                                        <input 
                                            type="file" 
                                            id="profileImageInput" 
                                            accept="image/*" 
                                            className="hidden" 
                                            onChange={handleImageChange} 
                                        />
                                    </div>
                                </div>

                                <div className="p-6 sm:p-8 space-y-8">
                                    {/* Taarifa za Biashara */}
                                    <div>
                                        <h5 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-slate-400" /> Taarifa za Biashara
                                        </h5>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Jina la Biashara</label>
                                                <input type="text" id="businessNameInput" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:bg-white transition-all" defaultValue={user?.businessName || ""} placeholder="Ingiza jina la biashara" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">TIN Namba (TRA)</label>
                                                <input type="text" id="tinInput" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:bg-white transition-all" defaultValue={user?.tin || ""} placeholder="Mfano: 123-456-789" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mipangilio ya Mfumo */}
                                    <div>
                                        <h5 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                            <Settings className="w-4 h-4 text-slate-400" /> Mipangilio ya Mfumo
                                        </h5>
                                        <div className="space-y-3">
                                            <label className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors">
                                                <div>
                                                    <p className="font-bold text-sm text-slate-800">Tuma Risiti Kiotomatiki TRA</p>
                                                    <p className="text-xs text-slate-500">Kila risiti inayotengenezwa itatumwa moja kwa moja kwenye mfumo wa TRA.</p>
                                                </div>
                                                <div className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
                                                    <input type="checkbox" name="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-primary appearance-none cursor-pointer right-0" defaultChecked />
                                                    <div className="toggle-label block overflow-hidden h-6 rounded-full bg-primary cursor-pointer"></div>
                                                </div>
                                            </label>

                                            <label className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors">
                                                <div>
                                                    <p className="font-bold text-sm text-slate-800">Pokea Meseji za Makumbusho</p>
                                                    <p className="text-xs text-slate-500">Tutakukumbusha wakati wa kulipa kodi kabla ya tarehe ya mwisho.</p>
                                                </div>
                                                <div className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
                                                    <input type="checkbox" name="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-slate-300 appearance-none cursor-pointer left-0" />
                                                    <div className="toggle-label block overflow-hidden h-6 rounded-full bg-slate-300 cursor-pointer"></div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-4 border-t border-slate-100">
                                        <button 
                                            onClick={handleSaveSettings}
                                            disabled={isSaving}
                                            className="px-6 py-3 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center min-w-[150px]"
                                        >
                                            {isSaving ? "Inahifadhi..." : "Hifadhi Mabadiliko"}
                                        </button>
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

            {/* Toast Notification */}
            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: 50, x: "-50%" }}
                        className="fixed bottom-8 left-1/2 z-[100] bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3"
                    >
                        <BadgeCheck className="w-5 h-5 text-green-400" />
                        <span className="text-sm font-bold">{toastMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
