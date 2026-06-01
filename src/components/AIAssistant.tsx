"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, X, Bot, User } from "lucide-react";

export function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "bot", content: "Habari! Mimi ni msaidizi wako wa kodi. Una swali gani leo?", swContent: "Habari! Mimi ni msaidizi wako wa kodi. Una swali gani leo?" }
    ]);
    const [input, setInput] = useState("");

    useEffect(() => {
        const openChatIfHash = () => {
            if (typeof window !== "undefined" && window.location.hash === "#chat") {
                setIsOpen(true);
            }
        };

        openChatIfHash();
        window.addEventListener("hashchange", openChatIfHash);

        return () => window.removeEventListener("hashchange", openChatIfHash);
    }, []);

    const handleSend = () => {
        if (!input.trim()) return;

        setMessages([...messages, { role: "user", content: input, swContent: input }]);
        setInput("");

        // Simulate AI response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: "bot",
                content: "Asante kwa swali lako. Kwa biashara ya Kariakoo, unapaswa kulipa kodi ya mapato (Income Tax) na kodi ya ongezeko la thamani (VAT) ikiwa mauzo yako yanazidi milioni 100 kwa mwaka.",
                swContent: "Asante kwa swali lako. Kwa biashara ya Kariakoo, unapaswa kulipa kodi ya mapato (Income Tax) na kodi ya ongezeko la thamani (VAT) ikiwa mauzo yako yanazidi milioni 100 kwa mwaka."
            }]);
        }, 1000);
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 w-16 h-16 gold-gradient rounded-full flex items-center justify-center shadow-2xl shadow-primary/30 hover:scale-110 transition-transform z-50 group"
            >
                <MessageSquare className="w-8 h-8 text-secondary group-hover:rotate-12 transition-transform" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-secondary"></span>
                </span>
            </button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed bottom-28 right-8 w-[380px] h-[500px] glass rounded-3xl z-50 flex flex-col overflow-hidden border border-white/20 shadow-2xl"
                    >
                        {/* Header */}
                        <div className="gold-gradient p-6 text-secondary flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                    <Bot className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold">Msaidizi wa Kodi (AI)</h3>
                                    <p className="text-xs opacity-70">Tunatumia AI kusaidia biashara yako</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="hover:bg-white/10 p-2 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {messages.map((m, i) => (
                                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${m.role === "user"
                                            ? "bg-primary text-secondary font-semibold rounded-tr-none border border-primary-dark/20"
                                            : "bg-white/50 text-foreground rounded-tl-none border border-primary/20"
                                        }`}>
                                        {m.content}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-white/30 border-t border-white/20">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                                    placeholder="Uliza chochote..."
                                    className="w-full bg-white/50 border border-white/30 rounded-2xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                                />
                                <button
                                    onClick={handleSend}
                                    className="absolute right-2 top-1.5 p-1.5 gold-gradient text-secondary rounded-xl hover:opacity-90 transition-colors"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
