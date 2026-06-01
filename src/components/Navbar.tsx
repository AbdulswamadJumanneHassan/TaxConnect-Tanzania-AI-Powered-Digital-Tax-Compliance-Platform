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
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "py-3 glass" : "py-5 bg-transparent"
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
                            className="text-sm font-medium text-secondary hover:text-primary transition-colors"
                        >
                            {language === "sw" ? link.name : link.enName}
                        </Link>
                    ))}

                    <div className="flex items-center gap-4 ml-4">
                        <button
                            onClick={toggleLanguage}
                            className="flex items-center gap-1.5 text-sm font-semibold text-secondary/70 hover:text-primary transition-colors"
                        >
                            <Globe className="w-4 h-4" />
                            {language === "sw" ? "EN" : "SW"}
                        </button>

                        <Link
                            href="/login"
                            className="px-5 py-2.5 gold-gradient text-secondary text-sm font-bold rounded-xl hover:opacity-90 transition-all shadow-md shadow-primary/30 flex items-center gap-2"
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
                        className="p-2 text-secondary"
                    >
                        <Globe className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-2 text-foreground"
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
                        className="absolute top-full left-0 w-full glass md:hidden border-t border-white/10"
                    >
                        <div className="flex flex-col p-6 gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="text-lg font-medium py-2 border-b border-white/5"
                                >
                                    {language === "sw" ? link.name : link.enName}
                                </Link>
                            ))}
                            <Link
                                href="/login"
                                className="mt-4 px-6 py-3 gold-gradient text-secondary text-center font-bold rounded-xl"
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
