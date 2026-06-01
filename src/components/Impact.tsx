"use client";

import { motion } from "framer-motion";

const stats = [
    { value: "1M+", label: "Small Businesses", swLabel: "Biashara Ndogo" },
    { value: "30%", label: "Revenue Increase", swLabel: "Ongezeko la Mapato" },
    { value: "100%", label: "Digital Compliance", swLabel: "Ufuataji wa Sheria" },
    { value: "24/7", label: "AI Support", swLabel: "Msaada wa AI" },
];

export function Impact() {
    return (
        <section id="about" className="py-24 bg-primary/5">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center gap-16">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex-1"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-8 italic">
                            Matokeo <span className="text-primary text-glow">Chanya</span> kwa Taifa Letu
                        </h2>
                        <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
                            Kwa kurasimisha biashara ndogo ndogo, tunasaidia kuongeza wigo wa kodi ambao unasaidia serikali kuboresha huduma za jamii kama barabara, shule, na hospitali.
                        </p>

                        <div className="space-y-4">
                            {[
                                "Kuongeza Mapato ya Serikali",
                                "Kurasimisha Sekta Isiyo Rasmi",
                                "Kupunguza Ukwepaji Kodi",
                                "Kuboresha Huduma za Jamii"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-primary rounded-full" />
                                    </div>
                                    <span className="font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <div className="flex-1 grid grid-cols-2 gap-4">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-8 glass rounded-3xl text-center flex flex-col items-center justify-center border border-primary/20"
                            >
                                <div className="text-3xl md:text-5xl font-extrabold text-primary mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-sm font-semibold uppercase tracking-wider opacity-60">
                                    {stat.swLabel}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
