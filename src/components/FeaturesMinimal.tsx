"use client";

import { motion } from "framer-motion";
import {
  QrCode,
  MessageCircle,
  Smartphone,
  TrendingUp,
  Globe,
  Zap,
} from "lucide-react";

const features = [
  {
    id: 1,
    icon: QrCode,
    title: "Digital Receipts",
    description: "TRA-verified receipts generated instantly. Share via WhatsApp, SMS, or QR.",
  },
  {
    id: 2,
    icon: MessageCircle,
    title: "AI Assistant",
    description: "Ask tax questions anytime. Responses in Swahili or English.",
  },
  {
    id: 3,
    icon: Smartphone,
    title: "M-Pesa Connected",
    description: "Auto-categorize transactions from M-Pesa, Airtel Money & more.",
  },
  {
    id: 4,
    icon: TrendingUp,
    title: "Growth Analytics",
    description: "Track revenue, see insights, make data-driven decisions.",
  },
  {
    id: 5,
    icon: Globe,
    title: "Smart Registration",
    description: "Register your business in minutes. Get your tax profile instantly.",
  },
  {
    id: 6,
    icon: Zap,
    title: "Tax Rewards",
    description: "Earn badges and unlock faster services for consistent filing.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export function FeaturesMinimal() {
  return (
    <section className="py-32 px-6 bg-slate-900 relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-yellow-500 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-black text-white mb-4">
            Everything you need
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl">
            Comprehensive tools built specifically for Tanzanian businesses. One platform for compliance, growth, and peace of mind.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.id}
                variants={itemVariants}
                className="group"
              >
                <div className="p-8 rounded-lg border border-slate-700 bg-slate-800/50 backdrop-blur-sm hover:border-yellow-400/50 hover:bg-slate-800/80 transition-all duration-300 h-full">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500/20 to-yellow-500/20 flex items-center justify-center mb-6 group-hover:from-yellow-500/40 group-hover:to-yellow-500/40 transition-all">
                    <Icon className="w-6 h-6 text-yellow-400" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-yellow-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
