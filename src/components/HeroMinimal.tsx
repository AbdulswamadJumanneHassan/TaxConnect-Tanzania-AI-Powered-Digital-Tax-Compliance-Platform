"use client";

import { motion } from "framer-motion";
import { ArrowRight, Code2 } from "lucide-react";
import Link from "next/link";

export function HeroMinimal() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-12 overflow-hidden bg-[#1A1A1A]">
      {/* Subtle background grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(255, 215, 0, .05) 25%, rgba(255, 215, 0, .05) 26%, transparent 27%, transparent 74%, rgba(255, 215, 0, .05) 75%, rgba(255, 215, 0, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 215, 0, .05) 25%, rgba(255, 215, 0, .05) 26%, transparent 27%, transparent 74%, rgba(255, 215, 0, .05) 75%, rgba(255, 215, 0, .05) 76%, transparent 77%, transparent)`,
          backgroundSize: "60px 60px"
        }} />
      </div>

      {/* Animated gradient orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-1/4 -left-40 w-[500px] h-[500px] bg-[#FFD700] rounded-full blur-[120px]"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        className="absolute bottom-1/4 -right-40 w-[500px] h-[500px] bg-[#FFD700] rounded-full blur-[120px]"
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#FFD700]/30 bg-[#FFD700]/10 mb-8 backdrop-blur-sm"
          >
            <Code2 className="w-4 h-4 text-[#FFD700]" />
          </motion.div>
          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-6xl md:text-8xl font-black text-white mb-8 leading-tight tracking-tight"
          >
            Tax Made
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FFE84D] to-[#FFD700]">
              Simple
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            <strong>Your AI Tax Assistant for Tanzania.</strong>
            <br />
            Understand taxes, prepare compliant reports, and stay ahead of filing deadlines—all in one intelligent platform.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link
              href="/register"
              className="group px-10 py-5 bg-[#FFD700] text-[#1A1A1A] font-black rounded-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 shadow-xl shadow-yellow-500/20"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#demo"
              className="px-10 py-5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/5 transition-all duration-300"
            >
              Watch Video Pitch
            </Link>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-6 md:gap-12 text-sm text-slate-400"
          >
            <div>
              <p className="text-lg font-bold text-white mb-1">AI Powered</p>
            </div>
            <div className="hidden md:block w-px bg-slate-700" />
            <div>
              <p className="text-lg font-bold text-white mb-1">Prototype Ready</p>
            </div>
            <div className="hidden md:block w-px bg-slate-700" />
            <div>
              <p className="text-lg font-bold text-white mb-1">Built for Tanzania</p>
            </div>
            <div className="hidden md:block w-px bg-slate-700" />
            <div>
              <p className="text-lg font-bold text-white mb-1">Competition Prototype</p>
            </div>
            <div className="hidden md:block w-px bg-slate-700" />
            <div>
              <p className="text-lg font-bold text-white mb-1">Ready for Pilot Testing</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
