"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Shield, TrendingUp } from "lucide-react";
import Link from "next/link";

export function Hero() {
    return (
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
            {/* TRA Yellow Background Decor */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 tra-hero-bg opacity-10" />
                <div className="absolute top-0 right-0 w-2/3 h-full opacity-15 blur-3xl">
                    <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary rounded-full" />
                    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent rounded-full" />
                </div>
            </div>

            <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/40 bg-primary/10 mb-6">
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                            Digitalizing Tanzania&apos;s Economy
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight text-secondary">
                        Kodi Inayolipika, <br />
                        <span className="text-primary text-glow">Biashara Inayokua.</span>
                    </h1>

                    <p className="text-lg text-secondary/70 mb-8 max-w-lg leading-relaxed">
                        Smart Tax Tanzania inakusaidia kurahisisha ulipaji kodi, kutengeneza risiti za kidijitali, na kukuza biashara yako kwa kutumia akili mnemba (AI).
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 mb-10">
                        <Link
                            href="/register"
                            className="px-8 py-4 gold-gradient text-secondary font-bold rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-2 group"
                        >
                            Anza Sasa Bure
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="#demo"
                            className="px-8 py-4 border-2 border-primary/50 text-secondary font-bold rounded-2xl hover:bg-primary/10 transition-all flex items-center justify-center gap-2"
                        >
                            Tazama Jinsi Inavyofanya Kazi
                        </Link>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-secondary/60">
                        <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-primary" />
                            <span>Salama &amp; Rasmi</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            <span>Kukuza Biashara</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="relative"
                >
                    {/* Main Visual Element */}
                    <div className="relative z-10 rounded-3xl overflow-hidden border-2 border-primary/30 shadow-2xl shadow-primary/20">
                        <div className="tra-hero-bg aspect-video rounded-2xl flex items-center justify-center overflow-hidden">
                            <div className="text-center p-8">
                                <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-secondary/20">
                                    <CheckCircle className="w-12 h-12 text-secondary" />
                                </div>
                                <h3 className="text-2xl font-black mb-2 text-secondary">Smart Compliance</h3>
                                <p className="text-sm text-secondary/70 font-medium">Integrated with Mobile Money &amp; TRA</p>
                            </div>
                        </div>

                        {/* Floating UI Elements */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute top-10 -left-6 glass-dark p-4 rounded-2xl shadow-2xl"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                                    <span className="text-primary font-black text-xs">TZS</span>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase text-zinc-400">Mapato Leo</p>
                                    <p className="font-bold text-white">250,000</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                            className="absolute bottom-10 -right-6 glass-dark p-4 rounded-2xl shadow-2xl"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                                    <span className="text-primary font-black text-xs">EFD</span>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase text-zinc-400">Risiti Zilizotolewa</p>
                                    <p className="font-bold text-white">128</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Background Glow */}
                    <div className="absolute -inset-4 bg-primary/15 blur-3xl -z-10 rounded-full" />
                </motion.div>
            </div>
        </section>
    );
}
