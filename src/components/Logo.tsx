"use client";

import { motion } from "framer-motion";

export function Logo() {
    return (
        <div className="flex items-center gap-2 group cursor-pointer">
            <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.5 }}
                className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all"
            >
                <span className="text-white font-bold text-xl">S</span>
            </motion.div>
            <div className="flex flex-col">
                <span className="font-bold text-xl tracking-tight leading-none text-white">
                    Smart<span className="text-blue-400">Tax</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                    Tanzania
                </span>
            </div>
        </div>
    );
}
