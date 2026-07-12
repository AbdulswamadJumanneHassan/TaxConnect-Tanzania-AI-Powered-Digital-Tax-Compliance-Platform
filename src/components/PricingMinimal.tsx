"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Starter",
    description: "Perfect for solo traders",
    price: "Free",
    period: "Always",
    features: [
      "Up to 10 digital receipts/month",
      "Basic tax filing",
      "AI assistant access",
      "Mobile money tracking",
    ],
    cta: "Start Free",
    highlighted: false,
  },
  {
    name: "Professional",
    description: "For growing businesses",
    price: "15,000",
    period: "per month",
    features: [
      "Unlimited digital receipts",
      "Advanced analytics",
      "Priority AI support",
      "Team members (up to 3)",
      "Custom reports",
      "Tax reminders",
    ],
    cta: "Try Free",
    highlighted: true,
  },
  {
    name: "Enterprise",
    description: "For large operations",
    price: "Custom",
    period: "contact us",
    features: [
      "Everything in Professional",
      "Dedicated account manager",
      "API access",
      "Custom integrations",
      "SLA guarantee",
      "Training & onboarding",
    ],
    cta: "Get Quote",
    highlighted: false,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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

export function PricingMinimal() {
  return (
    <section className="py-32 px-6 bg-slate-900 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-yellow-500 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-black text-white mb-4">
            Simple Pricing
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Start free. Scale as you grow. No hidden fees.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
                plan.highlighted
                  ? "md:scale-105 border border-yellow-400/50 bg-gradient-to-br from-yellow-500/20 to-yellow-500/20"
                  : "border border-slate-700 bg-slate-800/50 hover:border-slate-600"
              }`}
            >
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-yellow-500/10" />

              {/* Badge */}
              {plan.highlighted && (
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-500 text-white text-xs font-bold">
                  Popular
                </div>
              )}

              {/* Content */}
              <div className="relative p-8 h-full flex flex-col">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-slate-400 text-sm mb-4">
                    {plan.description}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">
                      {plan.price}
                    </span>
                    <span className="text-slate-400 text-sm">
                      {plan.period}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Link
                  href="/register"
                  className={`group w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                    plan.highlighted
                      ? "bg-gradient-to-r from-yellow-500 to-yellow-500 text-white hover:shadow-lg hover:shadow-yellow-500/50"
                      : "border border-slate-600 text-slate-300 hover:border-yellow-400 hover:text-yellow-300"
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* FAQ note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center text-slate-400"
        >
          <p>All plans include 3 months free. No credit card required.</p>
        </motion.div>
      </div>
    </section>
  );
}
