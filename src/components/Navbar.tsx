"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe, LogIn, LogOut, LayoutDashboard } from "lucide-react";
import { Logo } from "./Logo";
import Link from "next/link";
import { useRouter } from "next/navigation";

const navLinks = [
    { name: "Huduma", enName: "Services", href: "#features" },
    { name: "Kuhusu", enName: "About", href: "#about" },
    { name: "Msaada", enName: "Support", href: "#support" },
    { name: "Zawadi", enName: "Rewards", href: "#rewards" },
];

import { JWTPayload } from "@/lib/auth";

export function Navbar({ user }: { user?: JWTPayload | null }) {
    const router = useRouter();
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

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            router.refresh();
            router.push("/");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
                ? "py-3 bg-[#1A1A1A]/90 backdrop-blur-md border-b border-[#FFD700]/10"
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
                            className="text-sm font-bold text-gray-400 hover:text-[#FFD700] transition-colors duration-200"
                        >
                            {language === "sw" ? link.name : link.enName}
                        </Link>
                    ))}

                    <div className="flex items-center gap-6 ml-4">
                        <button
                            onClick={toggleLanguage}
                            className="flex items-center gap-1.5 text-xs font-black text-gray-500 hover:text-[#FFD700] transition-colors duration-200 uppercase tracking-widest"
                        >
                            <Globe className="w-4 h-4" />
                            {language === "sw" ? "EN" : "SW"}
                        </button>

                        <button
                            onClick={user ? handleLogout : () => router.push("/login")}
                            className="px-6 py-2.5 bg-[#FFD700] text-[#1A1A1A] text-xs font-black rounded-xl hover:scale-105 transition-all duration-200 flex items-center gap-2 shadow-lg shadow-yellow-500/10"
                        >
                            <LogIn className="w-4 h-4" />
                            LOGIN
                        </button>
                    </div>
                </div>

                {/* Mobile Toggle */}
                <div className="md:hidden flex items-center gap-4">
                    <button
                        onClick={toggleLanguage}
                        className="p-2 text-gray-400"
                    >
                        <Globe className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-2 text-gray-200"
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
                        className="absolute top-full left-0 w-full bg-[#1A1A1A]/95 backdrop-blur-md md:hidden border-t border-white/5"
                    >
                        <div className="flex flex-col p-6 gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="text-lg font-bold py-3 border-b border-white/5 text-gray-300 hover:text-[#FFD700] transition-colors"
                                >
                                    {language === "sw" ? link.name : link.enName}
                                </Link>
                            ))}
                            <button
                                onClick={user ? handleLogout : () => { setIsOpen(false); router.push("/login"); }}
                                className="mt-4 px-6 py-4 bg-[#FFD700] text-[#1A1A1A] text-center font-black rounded-2xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                            >
                                <LogIn className="w-5 h-5" />
                                LOGIN
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
