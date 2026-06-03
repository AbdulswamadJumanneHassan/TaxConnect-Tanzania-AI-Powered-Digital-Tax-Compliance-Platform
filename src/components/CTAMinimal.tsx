"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTAMinimal() {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-900 to-slate-950" />

      {/* Animated background */}
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl opacity-50"
      />

      <div className="container mx-auto max-w-3xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
            Ready to simplify tax compliance?
          </h2>

          <p className="text-lg text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of Tanzanian businesses that are already saving time, reducing stress, and staying compliant with Smart Tax.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Start Free Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#contact"
              className="px-8 py-4 border border-slate-600 text-slate-300 font-semibold rounded-lg hover:border-blue-400 hover:text-blue-300 transition-all duration-300"
            >
              Questions? Let's Talk
            </Link>
          </div>

          <p className="text-slate-500 text-sm mt-8">
            No credit card required. Free for 3 months.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
