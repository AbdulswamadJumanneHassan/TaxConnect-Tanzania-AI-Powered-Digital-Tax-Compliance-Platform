"use client";

import { motion } from "framer-motion";

export function Logo() {
    return (
        <div className="flex items-center gap-2 group cursor-pointer">
            <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.5 }}
                className="w-10 h-10 bg-[#FFD700] rounded-lg flex items-center justify-center shadow-lg shadow-yellow-500/30 group-hover:shadow-yellow-500/50 transition-all"
            >
                <span className="text-[#1A1A1A] font-black text-xl">T</span>
            </motion.div>
            <div className="flex flex-col">
                <span className="font-black text-xl tracking-tighter leading-none text-white">
                    Tax<span className="text-[#FFD700]">Connect</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                    Tanzania
                </span>
            </div>
        </div>
    );
}
