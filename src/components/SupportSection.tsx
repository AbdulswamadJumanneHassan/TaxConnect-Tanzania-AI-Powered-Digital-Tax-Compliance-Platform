import Link from "next/link";

export function SupportSection() {
    return (
        <section id="support" className="py-24 bg-slate-950 text-white">
            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
                    <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-primary mb-4">Msaada</p>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Tunaweza kukusaidia</h2>
                        <p className="max-w-2xl text-slate-300 leading-relaxed mb-8">
                            Ikiwa unahitaji msaada wa usajili, maswali ya kodi, au ungependa kujifunza zaidi kuhusu zawadi za walipakodi, tupo hapa kwa ajili yako. Tuma barua pepe, tupigie au utumie mojawapo ya rasilimali zetu za msaada.
                        </p>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="rounded-3xl glass border border-white/10 p-6">
                                <p className="text-sm uppercase tracking-[0.3em] text-primary mb-3">Barua pepe</p>
                                <p className="text-lg font-semibold">msaada@smarttax.co.tz</p>
                            </div>
                            <div className="rounded-3xl glass border border-white/10 p-6">
                                <p className="text-sm uppercase tracking-[0.3em] text-primary mb-3">Simu</p>
                                <p className="text-lg font-semibold">+255 700 000 000</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-3xl bg-white/5 border border-white/10 p-10 shadow-2xl">
                        <p className="text-sm uppercase tracking-[0.3em] text-primary mb-4">Huduma za Msaada</p>
                        <ul className="space-y-4 text-slate-300">
                            <li>
                                <Link href="#features" className="font-semibold text-white hover:text-primary transition-colors">
                                    Huduma Zetu za Kodi
                                </Link>
                            </li>
                            <li>
                                <Link href="#about" className="font-semibold text-white hover:text-primary transition-colors">
                                    Kuhusu Sisi
                                </Link>
                            </li>
                            <li>
                                <Link href="/register" className="font-semibold text-white hover:text-primary transition-colors">
                                    Jiunge kwa Msaada wa Moja kwa Moja
                                </Link>
                            </li>
                            <li>
                                <Link href="#demo" className="font-semibold text-white hover:text-primary transition-colors">
                                    Jaribu Demo ya Risiti
                                </Link>
                            </li>
                        </ul>
                        <div className="mt-8">
                            <Link
                                href="#chat"
                                className="inline-flex items-center justify-center w-full py-4 bg-primary text-white rounded-2xl font-bold text-sm hover:bg-primary/90 transition-colors"
                            >
                                {"Uliza kwa AI Sasa"}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
