"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { motion } from "framer-motion";

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // Validation
        if (!email || !password) {
            setError("Tafadhali jaza sehemu zote");
            setLoading(false);
            return;
        }

        // Simulate authentication
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        // Redirect to dashboard
        router.push("/dashboard");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col">
            {/* Header */}
            <header className="py-6 px-4 bg-white shadow-sm">
                <div className="max-w-7xl mx-auto">
                    <Link href="/">
                        <Logo />
                    </Link>
                </div>
            </header>

            {/* Login Form */}
            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary to-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <LogIn className="w-8 h-8 text-slate-900" />
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">
                                Karibu Tena
                            </h1>
                            <p className="text-slate-600">
                                Ingia kwa akaunti yako
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium"
                            >
                                {error}
                            </motion.div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email Field */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Barua Pepe / Jina la Mtumiaji
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@example.com"
                                        disabled={loading}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Neno la Siri
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        disabled={loading}
                                        className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={loading}
                                        className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        disabled={loading}
                                        className="w-4 h-4 rounded border-slate-300 bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                    <span className="text-sm text-slate-700">
                                        Nikumbuke
                                    </span>
                                </label>
                                <Link
                                    href="#"
                                    className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                                >
                                    Nilisahau neno la siri?
                                </Link>
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Ingiajaaa...
                                    </>
                                ) : (
                                    "Ingia"
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="flex items-center gap-3 my-6">
                            <div className="flex-1 h-px bg-slate-300"></div>
                            <span className="text-sm text-slate-600">Au</span>
                            <div className="flex-1 h-px bg-slate-300"></div>
                        </div>

                        {/* Social Login */}
                        <div className="space-y-2">
                            <button
                                type="button"
                                disabled={loading}
                                className="w-full py-3 bg-slate-100 border border-slate-300 text-slate-900 rounded-xl hover:bg-slate-200 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Ingia kwa Google
                            </button>
                        </div>

                        {/* Sign Up Link */}
                        <div className="mt-8 text-center">
                            <p className="text-slate-700 text-sm">
                                Huna akaunti? {" "}
                                <Link
                                    href="/register"
                                    className="text-primary font-semibold hover:text-primary-dark transition-colors"
                                >
                                    Jisajili
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Footer Link */}
                    <div className="mt-8 text-center">
                        <Link
                            href="/"
                            className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
                        >
                            ← Rudi nyumbani
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
