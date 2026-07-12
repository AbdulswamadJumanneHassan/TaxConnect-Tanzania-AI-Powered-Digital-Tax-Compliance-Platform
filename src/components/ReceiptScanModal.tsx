"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X, Upload, ScanLine, CheckCircle2, AlertTriangle, Info,
    Building2, Hash, Calendar, Banknote, Percent, Shield,
    ChevronRight, Cpu, FileText, Sparkles, TriangleAlert
} from "lucide-react";
import type { ReceiptAnalysis } from "@/app/api/ai/analyze-receipt/route";

interface ReceiptScanModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (analysis: ReceiptAnalysis) => void;
}

type Screen = "upload" | "scanning" | "results";

const SEVERITY_COLORS = {
    LOW: "bg-yellow-50 text-yellow-600 border-yellow-100",
    MEDIUM: "bg-yellow-50 text-yellow-700 border-yellow-100",
    HIGH: "bg-yellow-50 text-yellow-600 border-yellow-100",
} as const;

const SEVERITY_ICONS = {
    LOW: Info,
    MEDIUM: TriangleAlert,
    HIGH: AlertTriangle,
} as const;

const SCAN_STEPS = [
    { label: "Extracting text (OCR)", icon: FileText },
    { label: "Parsing tax fields", icon: Building2 },
    { label: "Detecting anomalies", icon: Shield },
    { label: "Generating recommendations", icon: Sparkles },
];

export function ReceiptScanModal({ isOpen, onClose, onSave }: ReceiptScanModalProps) {
    const [screen, setScreen] = useState<Screen>("upload");
    const [dragOver, setDragOver] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<ReceiptAnalysis | null>(null);
    const [error, setError] = useState("");
    const [scanStep, setScanStep] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = useCallback((f: File) => {
        setFile(f);
        setError("");
        if (f.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (e) => setPreview(e.target?.result as string);
            reader.readAsDataURL(f);
        } else {
            setPreview(null); // PDF — no image preview
        }
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setDragOver(false);
            const dropped = e.dataTransfer.files[0];
            if (dropped) handleFile(dropped);
        },
        [handleFile]
    );

    const handleAnalyze = async () => {
        if (!file) return;
        setError("");
        setScreen("scanning");
        setScanStep(0);

        // Animate through steps
        const stepInterval = setInterval(() => {
            setScanStep((prev) => {
                if (prev < SCAN_STEPS.length - 1) return prev + 1;
                clearInterval(stepInterval);
                return prev;
            });
        }, 900);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/ai/analyze-receipt", {
                method: "POST",
                body: formData,
            });

            clearInterval(stepInterval);
            setScanStep(SCAN_STEPS.length - 1);

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Analysis failed");
            }

            const data = await res.json();
            setAnalysis(data.analysis);

            // Brief pause before showing results
            await new Promise((r) => setTimeout(r, 600));
            setScreen("results");
        } catch (err) {
            clearInterval(stepInterval);
            setError(err instanceof Error ? err.message : "Tatizo limetokea");
            setScreen("upload");
        }
    };

    const handleSave = async () => {
        if (!analysis) return;
        setIsSaving(true);
        try {
            // Build a receipt from the analysis and save it
            const items = [
                {
                    description: `${analysis.category} — ${analysis.businessName}`,
                    quantity: 1,
                    price: analysis.amountPaid,
                },
            ];
            const res = await fetch("/api/receipts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customerName: analysis.businessName || "Risiti ya AI",
                    items,
                    total: analysis.amountPaid,
                    paymentMethod: "Other",
                    sourceType: "ai-scanned",
                    aiAnalysis: analysis,
                }),
            });
            if (!res.ok) throw new Error("Save failed");
            onSave(analysis);
            handleClose();
        } catch {
            setError("Imeshindwa kuhifadhi risiti. Jaribu tena.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleClose = () => {
        setScreen("upload");
        setFile(null);
        setPreview(null);
        setAnalysis(null);
        setError("");
        setScanStep(0);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleClose}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            <Cpu className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">AI Receipt Scanner</h3>
                            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                                Powered by Gemini Vision
                            </p>
                        </div>
                    </div>
                    <button onClick={handleClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-6 h-6 text-slate-400" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto">
                    <AnimatePresence mode="wait">
                        {/* ─── UPLOAD SCREEN ─── */}
                        {screen === "upload" && (
                            <motion.div
                                key="upload"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="p-8"
                            >
                                <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                                    Upload a receipt image or PDF. Our AI will extract all tax details,
                                    detect compliance issues, and generate recommendations.
                                </p>

                                {/* Drop Zone */}
                                <div
                                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                    onDragLeave={() => setDragOver(false)}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`relative border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all ${dragOver
                                        ? "border-primary bg-primary/5 scale-[1.01]"
                                        : file
                                            ? "border-yellow-400 bg-yellow-50"
                                            : "border-slate-200 hover:border-primary/40 hover:bg-slate-50"
                                        }`}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp,application/pdf"
                                        className="hidden"
                                        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                                    />

                                    {preview ? (
                                        <img
                                            src={preview}
                                            alt="Receipt preview"
                                            className="max-h-48 object-contain rounded-xl mb-4 shadow-md"
                                        />
                                    ) : (
                                        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-4 ${file ? "bg-yellow-100 text-yellow-500" : "bg-slate-100 text-slate-400"}`}>
                                            {file ? <CheckCircle2 className="w-10 h-10" /> : <Upload className="w-10 h-10" />}
                                        </div>
                                    )}

                                    {file ? (
                                        <div className="text-center">
                                            <p className="font-bold text-slate-800">{file.name}</p>
                                            <p className="text-xs text-slate-400 mt-1">
                                                {(file.size / 1024).toFixed(1)} KB • Click to change
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <p className="font-bold text-slate-700">Drop receipt here</p>
                                            <p className="text-sm text-slate-400 mt-1">or click to browse</p>
                                            <p className="text-xs text-slate-300 mt-3">JPG · PNG · WEBP · PDF</p>
                                        </div>
                                    )}
                                </div>

                                {error && (
                                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-100 rounded-2xl text-yellow-600 text-sm font-medium">
                                        {error}
                                    </div>
                                )}

                                <button
                                    onClick={handleAnalyze}
                                    disabled={!file}
                                    className="mt-6 w-full flex items-center justify-center gap-3 bg-primary text-white px-8 py-5 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
                                >
                                    <ScanLine className="w-5 h-5" />
                                    Analyze with AI
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </motion.div>
                        )}

                        {/* ─── SCANNING SCREEN ─── */}
                        {screen === "scanning" && (
                            <motion.div
                                key="scanning"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="p-12 flex flex-col items-center justify-center min-h-[400px]"
                            >
                                {/* Pulsing ring */}
                                <div className="relative mb-8">
                                    <motion.div
                                        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.15, 0.3] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="absolute inset-0 rounded-full bg-primary"
                                    />
                                    <div className="relative w-24 h-24 bg-primary rounded-full flex items-center justify-center shadow-2xl shadow-primary/30">
                                        <Cpu className="w-12 h-12 text-white" />
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Analyzing Receipt…</h3>
                                <p className="text-slate-400 text-sm mb-10">Gemini AI is reading your receipt</p>

                                {/* Step progress */}
                                <div className="w-full max-w-xs space-y-3">
                                    {SCAN_STEPS.map((step, i) => {
                                        const Icon = step.icon;
                                        const done = i < scanStep;
                                        const active = i === scanStep;
                                        return (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.15 }}
                                                className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${done ? "bg-yellow-50" : active ? "bg-primary/5" : "bg-slate-50"}`}
                                            >
                                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${done ? "bg-yellow-500 text-white" : active ? "bg-primary text-white" : "bg-slate-200 text-slate-400"}`}>
                                                    {done ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                                                </div>
                                                <span className={`text-sm font-medium ${done ? "text-yellow-700" : active ? "text-primary" : "text-slate-400"}`}>
                                                    {step.label}
                                                </span>
                                                {active && (
                                                    <motion.div
                                                        animate={{ opacity: [1, 0, 1] }}
                                                        transition={{ duration: 1, repeat: Infinity }}
                                                        className="ml-auto w-2 h-2 bg-primary rounded-full"
                                                    />
                                                )}
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}

                        {/* ─── RESULTS SCREEN ─── */}
                        {screen === "results" && analysis && (
                            <motion.div
                                key="results"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="p-8 space-y-6"
                            >
                                {/* Compliance Score */}
                                <div className={`p-5 rounded-2xl flex items-center gap-5 ${analysis.complianceScore >= 80
                                    ? "bg-yellow-50 border border-yellow-100"
                                    : analysis.complianceScore >= 50
                                        ? "bg-yellow-50 border border-yellow-100"
                                        : "bg-yellow-50 border border-yellow-100"
                                    }`}
                                >
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black flex-shrink-0 ${analysis.complianceScore >= 80 ? "bg-yellow-500 text-white" : analysis.complianceScore >= 50 ? "bg-yellow-500 text-white" : "bg-yellow-500 text-white"}`}>
                                        {analysis.complianceScore}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">TRA Compliance Score</p>
                                        <p className="text-xl font-bold text-slate-900">
                                            {analysis.complianceScore >= 80 ? "Compliant ✓" : analysis.complianceScore >= 50 ? "Needs Attention" : "Non-Compliant"}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-0.5">{analysis.category}</p>
                                    </div>
                                </div>

                                {/* Extracted Fields */}
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Extracted Data</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { label: "Business", value: analysis.businessName, icon: Building2 },
                                            { label: "Receipt No.", value: analysis.receiptNumber || "—", icon: Hash },
                                            { label: "Date", value: analysis.dateTime || "—", icon: Calendar },
                                            { label: "Amount Paid", value: analysis.amountPaid ? `${analysis.amountPaid.toLocaleString()} TZS` : "—", icon: Banknote },
                                            { label: "VAT", value: analysis.vatAmount ? `${analysis.vatAmount.toLocaleString()} TZS` : "Not found", icon: Percent },
                                            { label: "TIN", value: analysis.tin || "Not found", icon: Shield },
                                        ].map(({ label, value, icon: Icon }) => (
                                            <div key={label} className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3">
                                                <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-primary border border-slate-200 flex-shrink-0">
                                                    <Icon className="w-4 h-4" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
                                                    <p className="text-sm font-bold text-slate-800 truncate">{value}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Anomalies */}
                                {analysis.anomalies.length > 0 && (
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                                            Detected Issues ({analysis.anomalies.length})
                                        </p>
                                        <div className="space-y-2">
                                            {analysis.anomalies.map((a, i) => {
                                                const Icon = SEVERITY_ICONS[a.severity];
                                                return (
                                                    <div key={i} className={`p-4 rounded-2xl border flex items-start gap-3 ${SEVERITY_COLORS[a.severity]}`}>
                                                        <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                        <div>
                                                            <p className="text-xs font-bold">{a.type.replace(/_/g, " ")}</p>
                                                            <p className="text-xs opacity-80 mt-0.5">{a.description}</p>
                                                        </div>
                                                        <span className="ml-auto text-[9px] font-black uppercase tracking-wider opacity-60 flex-shrink-0">
                                                            {a.severity}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Recommendations */}
                                {analysis.recommendations.length > 0 && (
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                                            Recommendations
                                        </p>
                                        <div className="space-y-2">
                                            {analysis.recommendations.map((rec, i) => (
                                                <div key={i} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-2xl border border-yellow-100">
                                                    <Sparkles className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                                                    <p className="text-xs text-yellow-800">{rec}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {error && (
                                    <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-2xl text-yellow-600 text-sm font-medium">
                                        {error}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer — Results only */}
                {screen === "results" && analysis && (
                    <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center gap-4 sticky bottom-0">
                        <button
                            onClick={() => { setScreen("upload"); setFile(null); setPreview(null); setAnalysis(null); }}
                            className="flex items-center gap-2 px-6 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-200 transition-all text-sm"
                        >
                            Scan Another
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex-1 flex items-center justify-center gap-3 bg-primary text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60"
                        >
                            {isSaving ? "Saving…" : (
                                <>
                                    <CheckCircle2 className="w-5 h-5" />
                                    Save to Records
                                </>
                            )}
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
