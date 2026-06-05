"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, X, Bot } from "lucide-react";

export function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "bot", content: "Habari! Mimi ni msaidizi wako wa kodi. Una swali gani leo?" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to latest message
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        // Add a placeholder bot message that we'll update
        setMessages((prev) => [...prev, { role: "bot", content: "" }]);

        try {
            const response = await fetch("/api/ai/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ question: input }),
            });

            if (!response.ok) throw new Error("Failed to fetch");

            const reader = response.body?.getReader();
            if (!reader) throw new Error("No reader available");

            const decoder = new TextDecoder();
            let accumulatedContent = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                accumulatedContent += chunk;

                // Update the last message (the bot message we just added)
                setMessages((prev) => {
                    const next = [...prev];
                    next[next.length - 1] = { ...next[next.length - 1], content: accumulatedContent };
                    return next;
                });
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages((prev) => {
                const next = [...prev];
                next[next.length - 1] = {
                    role: "bot",
                    content: "Samahani, kuna tatizo limejitokeza. Jaribu tena."
                };
                return next;
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/30 hover:scale-110 transition-transform z-50 group"
            >
                <MessageSquare className="w-8 h-8 text-white group-hover:rotate-12 transition-transform" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-white"></span>
                </span>
            </button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed bottom-28 right-8 w-[380px] h-[500px] bg-slate-800/95 backdrop-blur-md rounded-3xl z-50 flex flex-col overflow-hidden border border-slate-700 shadow-2xl shadow-black/50"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white flex items-center justify-between">
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
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${m.role === "user"
                                        ? "bg-blue-600 text-white font-semibold rounded-tr-none"
                                        : "bg-slate-700 text-slate-100 rounded-tl-none"
                                        }`}>
                                        {m.content}
                                    </div>
                                </motion.div>
                            ))}

                            {/* Loading indicator */}
                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex justify-start"
                                >
                                    <div className="bg-slate-700 text-slate-100 p-4 rounded-2xl rounded-tl-none">
                                        <div className="flex gap-2">
                                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100" />
                                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200" />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-slate-700/50 border-t border-slate-700">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter" && !isLoading) {
                                            handleSend();
                                        }
                                    }}
                                    placeholder="Uliza chochote..."
                                    disabled={isLoading}
                                    className="w-full bg-slate-700 border border-slate-600 rounded-2xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm text-white placeholder-slate-400 disabled:opacity-50"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={isLoading || !input.trim()}
                                    className="absolute right-2 top-1.5 p-1.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
