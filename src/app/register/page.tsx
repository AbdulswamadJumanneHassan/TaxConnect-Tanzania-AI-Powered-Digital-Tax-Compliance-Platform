"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, User, Building, ShieldCheck, HelpCircle } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function RegisterPage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        ownerName: "",
        businessName: "",
        category: "",
        location: "",
        estRevenue: "",
    });

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    return (
        <main className="min-h-screen bg-slate-50 flex flex-col">
            <nav className="p-6">
                <div className="container mx-auto flex justify-between items-center">
                    <Link href="/"><Logo /></Link>
                    <div className="flex gap-2">
                        {[1, 2, 3].map((s) => (
                            <div
                                key={s}
                                className={`w-10 h-1.5 rounded-full transition-colors ${s <= step ? "bg-primary" : "bg-slate-200"}`}
                            />
                        ))}
                    </div>
                </div>
            </nav>

            <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-xl">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100"
                            >
                                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                                    <User className="w-8 h-8 text-primary" />
                                </div>
                                <h2 className="text-3xl font-bold mb-2 text-slate-900">Karibu Smart Tax</h2>
                                <p className="text-slate-500 mb-8">Tafadhali tuambie kuhusu wewe na biashara yako ili tuanze.</p>

                                <div className="space-y-6">
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">Jina Lako Kamili</label>
                                        <input
                                            type="text"
                                            placeholder="Mf. Juma Haruna"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                            onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">Jina la Biashara</label>
                                        <input
                                            type="text"
                                            placeholder="Mf. Haruna Clothing Store"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                        />
                                    </div>
                                    <button
                                        onClick={nextStep}
                                        className="w-full bg-primary text-white py-5 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 mt-4"
                                    >
                                        Endelea <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100"
                            >
                                <button onClick={prevStep} className="flex items-center gap-2 text-slate-400 text-sm mb-6 hover:text-primary transition-colors">
                                    <ArrowLeft className="w-4 h-4" /> Rudi nyuma
                                </button>
                                <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6">
                                    <Building className="w-8 h-8 text-secondary" />
                                </div>
                                <h2 className="text-3xl font-bold mb-2 text-slate-900">Aina ya Biashara</h2>
                                <p className="text-slate-500 mb-8">Hii inatusaidia kujua kodi unazopaswa kulipa.</p>

                                <div className="grid grid-cols-1 gap-4 mb-8">
                                    {[
                                        "Duka la Rejareja",
                                        "Huduma za Chakula",
                                        "Uchukuzi & Logistiki",
                                        "Huduma za Kitaalamu"
                                    ].map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setFormData({ ...formData, category: cat })}
                                            className={`p-5 rounded-2xl border-2 text-left transition-all flex justify-between items-center ${formData.category === cat ? "border-primary bg-primary/5" : "border-slate-100 hover:border-slate-200"
                                                }`}
                                        >
                                            <span className="font-semibold">{cat}</span>
                                            {formData.category === cat && <Check className="w-5 h-5 text-primary" />}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={nextStep}
                                    className="w-full bg-primary text-white py-5 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    Endelea <ArrowRight className="w-5 h-5" />
                                </button>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100"
                            >
                                <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6">
                                    <ShieldCheck className="w-8 h-8 text-green-500" />
                                </div>
                                <h2 className="text-3xl font-bold mb-2 text-slate-900">Wasifu wa Kodi</h2>
                                <p className="text-slate-500 mb-8">Hongera! Tumetengeneza wasifu wako wa kodi.</p>

                                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 mb-8">
                                    <h4 className="font-bold mb-4 flex items-center gap-2">
                                        <HelpCircle className="w-4 h-4 text-primary" /> Unachopaswa Kujua:
                                    </h4>
                                    <ul className="space-y-4">
                                        <li className="flex gap-3 items-start text-sm">
                                            <div className="mt-1 w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                                            <p><strong>Kodi ya Mapato:</strong> Utalipa kulingana na mauzo yako ya mwaka.</p>
                                        </li>
                                        <li className="flex gap-3 items-start text-sm">
                                            <div className="mt-1 w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                                            <p><strong>Digital Receipts:</strong> Tumia mfumo wetu kutoa risiti ili kutambulika rasmi.</p>
                                        </li>
                                        <li className="flex gap-3 items-start text-sm">
                                            <div className="mt-1 w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                                            <p><strong>M-Pesa Business:</strong> Unganisha akaunti yako ya malipo kufanya mahesabu rahisi.</p>
                                        </li>
                                    </ul>
                                </div>

                                <Link
                                    href="/dashboard"
                                    className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                                >
                                    Maliza & Fungua Dashboard
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </main>
    );
}
