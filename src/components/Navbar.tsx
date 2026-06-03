"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe, LogIn } from "lucide-react";
import { Logo } from "./Logo";
import Link from "next/link";

const navLinks = [
    { name: "Huduma", enName: "Services", href: "#features" },
    { name: "Kuhusu", enName: "About", href: "#about" },
    { name: "Msaada", enName: "Support", href: "#support" },
    { name: "Zawadi", enName: "Rewards", href: "#rewards" },
];

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [language, setLanguage] = useState<"sw" | "en">("sw");

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleLanguage = () => {
        setLanguage(language === "sw" ? "en" : "sw");
    };

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled 
                ? "py-3 bg-slate-950/80 backdrop-blur-md border-b border-slate-800" 
                : "py-5 bg-transparent"
            }`}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                <Logo />

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-slate-300 hover:text-blue-400 transition-colors duration-200"
                        >
                            {language === "sw" ? link.name : link.enName}
                        </Link>
                    ))}

                    <div className="flex items-center gap-4 ml-4">
                        <button
                            onClick={toggleLanguage}
                            className="flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-blue-400 transition-colors duration-200"
                        >
                            <Globe className="w-4 h-4" />
                            {language === "sw" ? "EN" : "SW"}
                        </button>

                        <Link
                            href="/login"
                            className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-bold rounded-lg hover:shadow-lg hover:shadow-blue-500/40 transition-all duration-200 flex items-center gap-2"
                        >
                            <LogIn className="w-4 h-4" />
                            {language === "sw" ? "Ingia" : "Login"}
                        </Link>
                    </div>
                </div>

                {/* Mobile Toggle */}
                <div className="md:hidden flex items-center gap-4">
                    <button
                        onClick={toggleLanguage}
                        className="p-2 text-slate-300"
                    >
                        <Globe className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-2 text-slate-300"
                    >
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 w-full bg-slate-950/95 backdrop-blur-md md:hidden border-t border-slate-800"
                    >
                        <div className="flex flex-col p-6 gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="text-lg font-medium py-2 border-b border-slate-800 text-slate-300 hover:text-blue-400 transition-colors"
                                >
                                    {language === "sw" ? link.name : link.enName}
                                </Link>
                            ))}
                            <Link
                                href="/login"
                                className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-center font-bold rounded-lg hover:shadow-lg hover:shadow-blue-500/40 transition-all"
                            >
                                {language === "sw" ? "Ingia Sasa" : "Login Now"}
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
