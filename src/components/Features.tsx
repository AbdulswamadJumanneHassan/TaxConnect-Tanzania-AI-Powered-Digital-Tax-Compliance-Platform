"use client";

import { motion } from "framer-motion";
import {
    QrCode,
    MessageSquare,
    Smartphone,
    TrendingUp,
    Globe,
    Award
} from "lucide-react";

const features = [
    {
        icon: <QrCode className="w-6 h-6 text-primary" style={{ color: '#FFD700' }} />,
        title: "Digital Receipt Generator",
        swTitle: "Risiti za Kidijitali",
        description: "Generate and share EFD-equivalent digital receipts via WhatsApp, SMS, or QR code.",
        swDescription: "Tengeneza na tuma risiti za kidijitali zinazotambuliwa na TRA kupitia WhatsApp, SMS au QR code."
    },
    {
        icon: <MessageSquare className="w-6 h-6" style={{ color: '#D4A800' }} />,
        title: "AI Tax Assistant",
        swTitle: "Msaidizi wa AI",
        description: "Get instant answers to your tax questions in Swahili or English from our AI expert.",
        swDescription: "Pata majibu ya papo hapo ya maswali yako ya kodi kwa Kiswahili au Kiingereza kutoka kwa AI."
    },
    {
        icon: <Globe className="w-6 h-6" style={{ color: '#FFD700' }} />,
        title: "Smart Registration",
        swTitle: "Usajili Rahisi",
        description: "Register your business and get an automatic tax profile with Swahili guidance.",
        swDescription: "Sajili biashara yako na upate wasifu wa kodi moja kwa moja kwa muongozo wa Kiswahili."
    },
    {
        icon: <Smartphone className="w-6 h-6" style={{ color: '#D4A800' }} />,
        title: "Mobile Money Insights",
        swTitle: "Ufuatiliaji wa Miamala",
        description: "Categorize business transactions from M-Pesa, Airtel Money, and more automatically.",
        swDescription: "Panga miamala ya biashara kutoka M-Pesa, Airtel Money na nyinginezo moja kwa moja."
    },
    {
        icon: <TrendingUp className="w-6 h-6" style={{ color: '#FFD700' }} />,
        title: "Growth Analytics",
        swTitle: "Uchambuzi wa Ukuaji",
        description: "Track your monthly revenue and get insights to grow your business effectively.",
        swDescription: "Fuatilia mapato yako ya mwezi na upate ushauri wa kukuza biashara yako vizuri."
    },
    {
        icon: <Award className="w-6 h-6" style={{ color: '#D4A800' }} />,
        title: "Tax Rewards Program",
        swTitle: "Tuzo za Walipakodi",
        description: "Earn badges and enjoy faster services for consistent and honest tax filing.",
        swDescription: "Pata beji na huduma za haraka kwa kuwa mlipakodi mwaminifu na thabiti."
    }
];

export function Features() {
    return (
        <section id="features" className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold mb-6"
                    >
                        Suluhisho la <span className="text-primary">Kidigitali</span> kwa Biashara Yako
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-foreground/60 text-lg"
                    >
                        Tunatumia teknolojia ya kisasa kurahisisha kodi na kukuza uchumi wa Tanzania kuanzia kwa mfanyabiashara mdogo.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            id={feature.title === "Tax Rewards Program" ? "rewards" : undefined}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="p-8 rounded-3xl glass hover:border-[#FFD700]/40 transition-all border border-primary/10 group"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3">{feature.swTitle}</h3>
                            <p className="text-foreground/60 text-sm leading-relaxed">
                                {feature.swDescription}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
