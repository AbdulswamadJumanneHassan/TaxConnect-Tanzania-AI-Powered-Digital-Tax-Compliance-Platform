"use client";

import { motion } from "framer-motion";
import {
    UserPlus,
    Database,
    Cpu,
    Calculator,
    FileCheck
} from "lucide-react";

const steps = [
    {
        id: 1,
        icon: UserPlus,
        title: "Register Business",
        description: "Sign up in seconds. Enter your TIN if you have one, or use our smart flow to register for the first time.",
    },
    {
        id: 2,
        icon: Database,
        title: "Connect Data",
        description: "Securely link your mobile money accounts (M-Pesa, Tigo Pesa) or upload your manual business records.",
    },
    {
        id: 3,
        icon: Cpu,
        title: "AI Analysis",
        description: "Our AI engine categorizes every transaction, identifies tax-deductible expenses, and flags missing receipts.",
    },
    {
        id: 4,
        icon: Calculator,
        title: "Calculations",
        description: "Real-time calculation of your VAT, Income Tax, and other obligations based on current TRA regulations.",
    },
    {
        id: 5,
        icon: FileCheck,
        title: "TRA Compliance",
        description: "Generate and file TRA-compliant reports with one click. Get instant confirmation and filing receipts.",
    },
];

export function HowItWorks() {
    return (
        <section className="py-24 px-6 bg-white overflow-hidden" id="how-it-works">
            <div className="container mx-auto max-w-6xl">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
                    <div className="max-w-2xl">
                        <h2 className="text-4xl md:text-5xl font-black text-[#1A1A1A] mb-4">
                            Compliance in <span className="text-[#F5B800]">5 Simple Steps</span>
                        </h2>
                        <p className="text-gray-600 text-lg">
                            We&apos;ve automated the boring stuff so you can get back to what matters most—running your business.
                        </p>
                    </div>
                </div>

                <div className="relative">
                    {/* Connecting Line (Horizontal on Desktop) */}
                    <div className="hidden lg:block absolute top-[44px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-[#FFD700]/10 via-[#FFD700] to-[#FFD700]/10" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 relative z-10">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <motion.div
                                    key={step.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="flex flex-col items-center lg:items-start text-center lg:text-left"
                                >
                                    <div className="w-16 h-16 rounded-full bg-[#1A1A1A] text-[#FFD700] flex items-center justify-center mb-6 shadow-xl relative">
                                        <Icon className="w-7 h-7" />
                                        <span className="absolute -top-1 -right-1 w-6 h-6 bg-[#FFD700] text-[#1A1A1A] rounded-full text-xs font-black flex items-center justify-center border-2 border-white">
                                            {step.id}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">
                                        {step.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
