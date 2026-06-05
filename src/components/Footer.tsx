"use client";

import { Logo } from "./Logo";
import { Mail, Phone, MapPin, Send, MessageCircle, Globe } from "lucide-react";
import Link from "next/link";

export function Footer() {
    return (
        <footer id="support" className="pt-24 pb-12 border-t border-slate-800 bg-slate-950 text-white">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <Logo />
                        <p className="mt-6 text-slate-400 text-sm leading-relaxed">
                            Tanzania&apos;s leading AI platform for tax compliance and business growth. Empowering small traders one digital receipt at a time.
                        </p>
                        <div className="flex gap-4 mt-8">
                            {[Globe, MessageCircle, Send].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full border border-blue-500/30 text-slate-400 flex items-center justify-center hover:border-blue-400 hover:text-blue-400 transition-colors">
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 text-white">Pahala pa Haraka</h4>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li><Link href="#features" className="hover:text-blue-400 transition-colors">Huduma Zetu</Link></li>
                            <li><Link href="#about" className="hover:text-blue-400 transition-colors">Kuhusu Sisi</Link></li>
                            <li><Link href="/register" className="hover:text-blue-400 transition-colors">Jisajili Sasa</Link></li>
                            <li><Link href="#demo" className="hover:text-blue-400 transition-colors">Tazama Demo</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 text-white">Msaada</h4>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Maswali ya Kawaida</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Sheria za Kodi</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Sera ya Ufaragha</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Wasiliana Nasi</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 text-white">Wasiliana</h4>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li className="flex items-center gap-3">
                                <MapPin className="w-4 h-4 text-blue-400" />
                                <span>Samora Avenue, Dar es Salaam</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-blue-400" />
                                <span>+255 700 000 000</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-blue-400" />
                                <span>msaada@taxconnect.co.tz</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-12 border-t border-slate-800 text-center text-slate-600 text-xs">
                    <p>&copy; {new Date().getFullYear()} TaxConnect Tanzania. Haki zote zimehifadhiwa.</p>
                </div>
            </div>
        </footer>
    );
}
