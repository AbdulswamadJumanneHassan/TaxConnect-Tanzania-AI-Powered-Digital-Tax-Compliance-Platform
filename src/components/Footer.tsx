"use client";

import { Logo } from "./Logo";
import { Mail, Phone, MapPin, Send, MessageCircle, Globe } from "lucide-react";
import Link from "next/link";

export function Footer() {
    return (
        <footer id="support" className="pt-24 pb-12 border-t border-[#FFD700]/10 bg-[#1A1A1A] text-white">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <Logo />
                        <p className="mt-6 text-gray-400 text-sm leading-relaxed">
                            An AI-powered tax compliance platform built for Tanzanian businesses. Empowering small traders one digital receipt at a time.
                        </p>
                        <div className="flex gap-4 mt-8">
                            {[Globe, MessageCircle, Send].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full border border-white/10 text-gray-500 flex items-center justify-center hover:border-[#FFD700] hover:text-[#FFD700] transition-all">
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 text-white uppercase text-xs tracking-widest">Pahala pa Haraka</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link href="#features" className="hover:text-[#FFD700] transition-colors">Huduma Zetu</Link></li>
                            <li><Link href="#about" className="hover:text-[#FFD700] transition-colors">Kuhusu Sisi</Link></li>
                            <li><Link href="/register" className="hover:text-[#FFD700] transition-colors">Jisajili Sasa</Link></li>
                            <li><Link href="#demo" className="hover:text-[#FFD700] transition-colors">Tazama Demo</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 text-white uppercase text-xs tracking-widest">Msaada</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link href="#" className="hover:text-[#FFD700] transition-colors">Maswali ya Kawaida</Link></li>
                            <li><Link href="#" className="hover:text-[#FFD700] transition-colors">Sheria za Kodi</Link></li>
                            <li><Link href="#" className="hover:text-[#FFD700] transition-colors">Sera ya Ufaragha</Link></li>
                            <li><Link href="#" className="hover:text-[#FFD700] transition-colors">Wasiliana Nasi</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 text-white uppercase text-xs tracking-widest">Wasiliana</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li className="flex items-center gap-3">
                                <MapPin className="w-4 h-4 text-[#FFD700]" />
                                <span>Udom-Cive, Dodoma</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-[#FFD700]" />
                                <span>+255 786546636</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-[#FFD700]" />
                                <span>msaada@taxpilot-ai-tanzania.co.tz</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-12 border-t border-white/5 text-center text-gray-600 text-[10px] uppercase tracking-widest leading-relaxed">
                    <p>&copy; {new Date().getFullYear()} TaxPilot-AI-Tanzania. Haki zote zimehifadhiwa.</p>
                </div>
            </div>
        </footer>
    );
}
