"use client";

import { Logo } from "./Logo";
import { Mail, Phone, MapPin, Send, MessageCircle, Globe } from "lucide-react";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="pt-24 pb-12 border-t border-white/5 bg-slate-950 text-white">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <Logo />
                        <p className="mt-6 text-zinc-400 text-sm leading-relaxed">
                            Tanzania's leading AI platform for tax compliance and business growth. Empowering small traders one digital receipt at a time.
                        </p>
                        <div className="flex gap-4 mt-8">
                            {[Globe, MessageCircle, Send].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full border border-primary/30 flex items-center justify-center hover:bg-primary hover:text-secondary transition-colors">
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Pahala pa Haraka</h4>
                        <ul className="space-y-4 text-sm text-zinc-400">
                            <li><Link href="#features" className="hover:text-primary">Huduma Zetu</Link></li>
                            <li><Link href="#about" className="hover:text-primary">Kuhusu Sisi</Link></li>
                            <li><Link href="/register" className="hover:text-primary">Jisajili Sasa</Link></li>
                            <li><Link href="#demo" className="hover:text-primary">Tazama Demo</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Msaada</h4>
                        <ul className="space-y-4 text-sm text-zinc-400">
                            <li><Link href="#" className="hover:text-primary">Maswali ya Kawaida</Link></li>
                            <li><Link href="#" className="hover:text-primary">Sheria za Kodi</Link></li>
                            <li><Link href="#" className="hover:text-primary">Sera ya Ufaragha</Link></li>
                            <li><Link href="#" className="hover:text-primary">Wasiliana Nasi</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Wasiliana</h4>
                        <ul className="space-y-4 text-sm text-zinc-400">
                            <li className="flex items-center gap-3">
                                <MapPin className="w-4 h-4 text-primary" />
                                <span>Samora Avenue, Dar es Salaam</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-primary" />
                                <span>+255 700 000 000</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-primary" />
                                <span>msaada@smarttax.co.tz</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-12 border-t border-white/5 text-center text-zinc-500 text-xs">
                    <p>&copy; {new Date().getFullYear()} Smart Tax Tanzania. Haki zote zimehifadhiwa.</p>
                </div>
            </div>
        </footer>
    );
}
