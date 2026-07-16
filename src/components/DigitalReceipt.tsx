"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { QrCode, Download, Share2, Printer, Plus, Trash2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface ReceiptProps {
    receipt?: {
        id: string;
        customer: string;
        items: Array<{ description: string; quantity: number; price: number }>;
        total: number;
        date: string;
        qrValue: string;
    };
    onDownload?: () => void;
}

export function DigitalReceipt({ receipt }: ReceiptProps) {
    const [demoItems, setDemoItems] = useState([
        { id: 1, name: "Nguo ya Watoto", price: 25000, qty: 2 },
        { id: 2, name: "Viatu vya Kiume", price: 45000, qty: 1 },
    ]);

    const addItem = () => {
        const newItem = { id: Date.now(), name: "Bidhaa Mpya", price: 0, qty: 1 };
        setDemoItems([...demoItems, newItem]);
    };

    const removeItem = (id: number) => {
        setDemoItems(demoItems.filter(item => item.id !== id));
    };

    const updateItem = (id: number, field: string, value: any) => {
        setDemoItems(demoItems.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const isDemo = !receipt;
    const items = receipt ? receipt.items.map((item, i) => ({ id: i, name: item.description, price: item.price, qty: item.quantity })) : demoItems;
    const total = receipt ? receipt.total : items.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const tax = total * 0.18; // 18% VAT
    const customer = receipt ? receipt.customer : "Mteja wa Jaribio";
    const date = receipt ? receipt.date : new Date().toLocaleString();
    const qrValue = receipt ? receipt.qrValue : `https://smarttax.co.tz/receipt/${Date.now()}`;

    const handleDownload = () => {
        const receiptId = receipt?.id?.substring(0, 8) || "DEMO";
        const grandTotal = (total + tax).toLocaleString();
        const vatAmount = tax.toLocaleString();
        const subtotal = total.toLocaleString();

        const rowsHtml = items
            .map(
                (item) =>
                    `<tr>
                        <td style="padding:8px 4px;border-bottom:1px solid #f1f5f9;font-size:12px">${item.name}</td>
                        <td style="padding:8px 4px;border-bottom:1px solid #f1f5f9;font-size:12px;text-align:center">${item.qty}</td>
                        <td style="padding:8px 4px;border-bottom:1px solid #f1f5f9;font-size:12px;text-align:right">${(item.price * item.qty).toLocaleString()} TZS</td>
                    </tr>`
            )
            .join("");

        const html = `<!DOCTYPE html>
<html lang="sw">
<head>
  <meta charset="UTF-8" />
  <title>Risiti ${receiptId} — TaxPilot-AI-Tanzania</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Courier New', monospace; background: #fff; padding: 32px; max-width: 420px; margin: 0 auto; }
    .header { text-align: center; border-bottom: 2px dashed #e2e8f0; padding-bottom: 16px; margin-bottom: 16px; }
    .header h1 { font-size: 18px; font-weight: 900; letter-spacing: 1px; }
    .header p { font-size: 11px; color: #64748b; margin-top: 4px; }
    .tin { font-size: 11px; font-weight: 700; color: #F5B800; margin-top: 6px; }
    .meta { display: flex; justify-content: space-between; font-size: 9px; color: #94a3b8; text-transform: uppercase; font-weight: 700; margin-top: 10px; }
    .customer { margin-bottom: 12px; }
    .customer-label { font-size: 9px; color: #94a3b8; text-transform: uppercase; font-weight: 700; }
    .customer-name { font-size: 13px; font-weight: 700; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; font-size: 11px; color: #64748b; border-bottom: 1px solid #e2e8f0; padding: 6px 4px; }
    th:nth-child(2) { text-align: center; }
    th:last-child { text-align: right; }
    .totals { border-top: 2px dashed #e2e8f0; margin-top: 16px; padding-top: 12px; }
    .totals-row { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px; }
    .totals-grand { display: flex; justify-content: space-between; font-size: 16px; font-weight: 900; border-top: 1px solid #e2e8f0; padding-top: 8px; margin-top: 6px; }
    .watermark { text-align: center; margin-top: 24px; font-size: 9px; color: #94a3b8; }
    .tra-badge { display: inline-block; border: 1px solid #F5B800; color: #F5B800; font-size: 9px; font-weight: 700; padding: 2px 8px; border-radius: 4px; margin-top: 6px; letter-spacing: 2px; }
    @media print { body { padding: 0; } @page { margin: 12mm; size: A5 portrait; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>SMART TAX TANZANIA</h1>
    <p>Kariakoo Market, Dar es Salaam</p>
    <p class="tin">TIN: 123-456-789</p>
    <div class="meta"><span>ID: ${receiptId}</span><span>${date}</span></div>
  </div>
  <div class="customer">
    <p class="customer-label">Mteja:</p>
    <p class="customer-name">${customer}</p>
  </div>
  <table>
    <thead><tr><th>Item</th><th style="text-align:center">Qty</th><th style="text-align:right">Bei</th></tr></thead>
    <tbody>${rowsHtml}</tbody>
  </table>
  <div class="totals">
    <div class="totals-row"><span>Subtotal:</span><span>${subtotal} TZS</span></div>
    <div class="totals-row"><span>VAT (18%):</span><span>${vatAmount} TZS</span></div>
    <div class="totals-grand"><span>TOTAL:</span><span>${grandTotal} TZS</span></div>
  </div>
  <div class="watermark">
    <p>Risiti hii imethibitishwa na TaxPilot-AI-Tanzania</p>
    <span class="tra-badge">TRA VERIFIED</span>
  </div>
</body>
</html>`;

        const win = window.open("", "_blank", "width=500,height=700");
        if (!win) return;
        win.document.write(html);
        win.document.close();
        win.focus();
        setTimeout(() => {
            win.print();
        }, 300);
    };

    const receiptContent = (
        <div className="bg-white text-slate-900 p-8 rounded-lg shadow-2xl min-h-[500px] flex flex-col font-mono relative overflow-hidden">
            {/* TRA Watermark for "real" receipts */}
            {!isDemo && (
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none -rotate-45">
                    <p className="text-6xl font-black">TRA VERIFIED</p>
                </div>
            )}

            <div className="text-center border-b-2 border-dashed border-slate-200 pb-6 mb-6">
                <h4 className="font-bold text-xl mb-1">SMART TAX TANZANIA</h4>
                <p className="text-xs">Kariakoo Market, Dar es Salaam</p>
                <p className="text-xs font-bold text-primary mt-1">TIN: 123-456-789</p>
                <div className="mt-4 flex justify-between text-[10px] text-slate-400 uppercase font-bold px-2">
                    <span>ID: {receipt?.id?.substring(0, 8) || "DEMO"}</span>
                    <span>{date}</span>
                </div>
            </div>

            <div className="flex-1">
                <div className="mb-4 text-xs">
                    <p className="font-bold text-slate-400 uppercase text-[9px] mb-1">Mteja:</p>
                    <p className="font-bold">{customer}</p>
                </div>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-100 italic">
                            <th className="text-left py-2">Item</th>
                            <th className="text-right py-2">Qty</th>
                            <th className="text-right py-2">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr key={item.id} className="border-b border-slate-50">
                                <td className="py-2 text-xs">{item.name}</td>
                                <td className="text-right py-2 text-xs">{item.qty}</td>
                                <td className="text-right py-2 text-xs">{(item.price * item.qty).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="border-t-2 border-dashed border-slate-200 pt-6 mt-6 space-y-2">
                <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>{total.toLocaleString()} TZS</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span>VAT (18%):</span>
                    <span>{tax.toLocaleString()} TZS</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-slate-100">
                    <span>TOTAL:</span>
                    <span>{(total + tax).toLocaleString()} TZS</span>
                </div>
            </div>

            <div className="mt-8 flex flex-col items-center">
                <div className="bg-white p-2 border border-slate-200 rounded-lg mb-4">
                    <QRCodeSVG value={qrValue} size={100} />
                </div>
                <p className="text-[10px] text-slate-400">Scan to verify receipt</p>
            </div>
        </div>
    );

    if (!isDemo) {
        return (
            <div>
                {receiptContent}
                <button
                    onClick={handleDownload}
                    className="mt-4 w-full flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                    <Download className="w-5 h-5" />
                    Download / Print Receipt
                </button>
            </div>
        );
    }

    return (
        <section id="demo" className="py-24">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">Tengeneza <span className="text-primary italic">Risiti</span> Popote</h2>
                    <p className="text-foreground/60">Jaribu kutengeneza risiti yako ya kwanza ya kidijitali hapa.</p>
                </div>

                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-start">
                    {/* Editor */}
                    <div className="glass p-8 rounded-3xl border border-white/20">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Plus className="w-5 h-5 text-primary" /> Maelezo ya Risiti
                        </h3>

                        <div className="space-y-4">
                            {demoItems.map((item) => (
                                <div key={item.id} className="flex gap-3 items-end">
                                    <div className="flex-1">
                                        <label className="text-[10px] uppercase font-bold text-zinc-500 mb-1 block">Bidhaa</label>
                                        <input
                                            type="text"
                                            value={item.name}
                                            onChange={(e) => updateItem(item.id, "name", e.target.value)}
                                            className="w-full bg-white/50 border border-white/20 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-slate-800"
                                        />
                                    </div>
                                    <div className="w-24">
                                        <label className="text-[10px] uppercase font-bold text-zinc-500 mb-1 block">Bei</label>
                                        <input
                                            type="number"
                                            value={item.price}
                                            onChange={(e) => updateItem(item.id, "price", Number(e.target.value))}
                                            className="w-full bg-white/50 border border-white/20 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-slate-800"
                                        />
                                    </div>
                                    <div className="w-16">
                                        <label className="text-[10px] uppercase font-bold text-zinc-500 mb-1 block">Idadi</label>
                                        <input
                                            type="number"
                                            value={item.qty}
                                            onChange={(e) => updateItem(item.id, "qty", Number(e.target.value))}
                                            className="w-full bg-white/50 border border-white/20 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-slate-800"
                                        />
                                    </div>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="p-2 text-yellow-500 hover:bg-yellow-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}

                            <button
                                onClick={addItem}
                                className="w-full py-3 border-2 border-dashed border-primary/30 rounded-2xl text-primary font-bold text-sm hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
                            >
                                <Plus className="w-4 h-4" /> Ongeza Bidhaa
                            </button>
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="relative">
                        {receiptContent}

                        {/* Action Buttons */}
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2 w-[90%]">
                            <button
                                onClick={handleDownload}
                                className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold shadow-xl flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                            >
                                <Download className="w-5 h-5" /> Download
                            </button>
                            <button className="flex-1 bg-secondary text-white py-4 rounded-2xl font-bold shadow-xl flex items-center justify-center gap-2 hover:scale-105 transition-transform">
                                <Share2 className="w-5 h-5" /> Share
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
