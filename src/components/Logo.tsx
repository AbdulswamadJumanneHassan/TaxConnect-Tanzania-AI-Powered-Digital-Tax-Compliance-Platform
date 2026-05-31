"use client";

import { motion } from "framer-motion";

export function Logo() {
    return (
        <div className="flex items-center gap-2 group cursor-pointer">
            <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.5 }}
                className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg group-hover:bg-primary-dark transition-colors"
            >
                <span className="text-white font-bold text-xl">S</span>
            </motion.div>
            <div className="flex flex-col">
                <span className="font-bold text-xl tracking-tight leading-none text-foreground">
                    Smart<span className="text-primary">Tax</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-secondary font-semibold">
                    Tanzania
                </span>
            </div>
        </div>
    );
}
