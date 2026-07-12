"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2, Receipt, CreditCard, Banknote, Check } from "lucide-react";
import { ReceiptItem } from "@/lib/receipt-store";

interface ReceiptModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function ReceiptModal({ isOpen, onClose, onSuccess }: ReceiptModalProps) {
    const [customerName, setCustomerName] = useState("");
    const [paymentMethod, setPaymentMethod] = useState<"Cash" | "M-Pesa" | "Other">("Cash");
    const [items, setItems] = useState<ReceiptItem[]>([{ description: "", quantity: 1, price: 0 }]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const addItem = () => {
        setItems([...items, { description: "", quantity: 1, price: 0 }]);
    };

    const removeItem = (index: number) => {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index));
        }
    };

    const updateItem = (index: number, field: keyof ReceiptItem, value: string | number) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (items.some(item => !item.description || item.price <= 0)) {
            setError("Tafadhali jaza bidhaa zote na bei zake.");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/receipts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customerName,
                    paymentMethod,
                    items,
                    total,
                }),
            });

            if (res.ok) {
                onSuccess();
                onClose();
                // Reset form
                setCustomerName("");
                setItems([{ description: "", quantity: 1, price: 0 }]);
                setPaymentMethod("Cash");
            } else {
                const data = await res.json();
                setError(data.error || "Imeshindwa kuhifadhi risiti");
            }
        } catch (err) {
            setError("Tatizo la mtandao limetokea.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
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
                            <Receipt className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Tengeneza Risiti</h3>
                            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Risiti ya Digitali TRA</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="overflow-y-auto p-8 flex-1">
                    <div className="space-y-8">
                        {/* Customer Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Jina la Mteja (Optional)</label>
                                <input
                                    type="text"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    placeholder="Mf. Haruna Juma"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Njia ya Malipo</label>
                                <div className="flex items-center gap-2 p-1 bg-slate-50 rounded-2xl border border-slate-200">
                                    {(["Cash", "M-Pesa", "Other"] as const).map((method) => (
                                        <button
                                            key={method}
                                            type="button"
                                            onClick={() => setPaymentMethod(method)}
                                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs transition-all ${paymentMethod === method
                                                    ? "bg-white text-primary shadow-sm ring-1 ring-slate-200"
                                                    : "text-slate-400 hover:text-slate-600"
                                                }`}
                                        >
                                            {method === "Cash" && <Banknote className="w-4 h-4" />}
                                            {method === "M-Pesa" && <CreditCard className="w-4 h-4" />}
                                            {method}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Items Section */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Bidhaa & Mauzo</label>
                                <button
                                    type="button"
                                    onClick={addItem}
                                    className="flex items-center gap-1 text-primary text-xs font-bold hover:underline"
                                >
                                    <Plus className="w-3 h-3" /> Ongeza Bidhaa
                                </button>
                            </div>

                            <div className="space-y-4">
                                {items.map((item, index) => (
                                    <div key={index} className="flex gap-4 items-end animate-in fade-in slide-in-from-top-2">
                                        <div className="flex-[2]">
                                            <input
                                                type="text"
                                                value={item.description}
                                                onChange={(e) => updateItem(index, "description", e.target.value)}
                                                placeholder="Maelezo ya bidhaa"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
                                            />
                                        </div>
                                        <div className="w-24">
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value) || 0)}
                                                placeholder="Qnty"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium text-center"
                                            />
                                        </div>
                                        <div className="w-32">
                                            <input
                                                type="number"
                                                value={item.price}
                                                onChange={(e) => updateItem(index, "price", parseInt(e.target.value) || 0)}
                                                placeholder="Bei"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeItem(index)}
                                            disabled={items.length === 1}
                                            className="p-4 text-yellow-400 hover:text-yellow-500 hover:bg-yellow-50 rounded-2xl transition-all disabled:opacity-30"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-2xl text-yellow-600 text-sm font-medium">
                                {error}
                            </div>
                        )}
                    </div>
                </form>

                {/* Footer */}
                <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between sticky bottom-0 z-10">
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Jumla Kuu</p>
                        <p className="text-2xl font-black text-slate-900">{total.toLocaleString()} TZS</p>
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex items-center gap-3 bg-primary text-white px-10 py-5 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60"
                    >
                        {isSubmitting ? "Inahifadhi..." : (
                            <>
                                Maliza & Tengeneza <Check className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
