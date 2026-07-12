"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";

const benefits = [
  "Bure kwa miezi 3 - walipata bado",
  "Hakuna kadi ya mkopo inayohitajika",
  "Usaidizi 24/7 kwa Kiswahili",
  "Kazi na TRA rasmi",
  "Usalama kamili wa data",
];

export function ShowcaseMinimal() {
  return (
    <section className="py-32 px-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Background elements */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-5"
      >
        <div className="absolute inset-0 border border-yellow-500 rounded-full" />
        <div className="absolute inset-12 border border-yellow-500 rounded-full" />
      </motion.div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-black text-white mb-8 leading-tight">
              Built for Tanzania
            </h2>

            <p className="text-lg text-slate-300 mb-8 leading-relaxed">
              Not a global platform adapted for Tanzania. We built Smart Tax from the ground up for Tanzanian traders, with compliance, mobile money, and Swahili at the core.
            </p>

            {/* Benefits */}
            <div className="space-y-4 mb-12">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-500 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-slate-300">{benefit}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-500 text-white font-semibold rounded-lg hover:shadow-2xl hover:shadow-yellow-500/30 transition-all duration-300 group"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Right - Visual Demo */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative">
              {/* Phone/Card Visual */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="rounded-2xl border border-yellow-400/20 bg-gradient-to-br from-yellow-500/10 to-yellow-500/10 p-8 backdrop-blur-sm overflow-hidden"
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-yellow-500/5" />

                <div className="relative z-10 space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">
                        Digital Receipt
                      </p>
                      <p className="text-2xl font-bold text-white">TSh 125,000</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400 mb-1">Tax (18%)</p>
                      <p className="text-xl font-bold text-yellow-400">TSh 22,500</p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-3 py-6 border-y border-slate-700/50">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Business</span>
                      <span className="text-white font-semibold">Duka la Dawa</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Date</span>
                      <span className="text-white font-semibold">3 Jun 2026</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Receipt ID</span>
                      <span className="text-white font-semibold">#12045</span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                    <span className="text-sm text-slate-300">
                      Verified with TRA
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Floating Badge */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                className="absolute -top-8 -right-8 px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-500/80 to-yellow-500/80 backdrop-blur-sm text-white text-sm font-semibold whitespace-nowrap"
              >
                ✨ Instant approval
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
