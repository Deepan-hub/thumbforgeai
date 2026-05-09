import { CheckIcon } from "lucide-react";
import TiltedImage from "../components/TiltImage";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const specialFeatures = ["No design skills needed", "Fast generation", "High CTR templates"];

export default function HeroSection() {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();

    const handleGenerate = () => navigate(isLoggedIn ? '/generate' : '/login');
    const handleRecreate = () => navigate(isLoggedIn ? '/recreate' : '/login');

    return (
        <div className="relative flex flex-col items-center justify-center overflow-x-hidden">

            {/* Background glows */}
            <div className="absolute top-20 md:top-40 -z-10 left-0 md:left-1/4 size-64 md:size-96 bg-orange-600 blur-[120px] md:blur-[300px] opacity-25 md:opacity-40 rounded-full" />
            <div className="absolute top-60 md:top-80 -z-10 right-0 md:right-1/4 size-48 md:size-72 bg-amber-500 blur-[100px] md:blur-[250px] opacity-15 md:opacity-20 rounded-full" />

            {/* ══════════════════ MOBILE ══════════════════ */}
            <div className="md:hidden w-full min-h-screen flex flex-col px-5 pt-20 pb-16">

                {/* Top badge */}
                <motion.div className="flex justify-center"
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                    <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/25 rounded-full px-4 py-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                        <span className="text-[11px] font-semibold text-orange-400 tracking-wider uppercase">AI-Powered · Free to Try</span>
                    </div>
                </motion.div>

                {/* Heading */}
                <motion.div className="mt-6 text-center"
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }}>
                        <h1 className="text-[2.2rem] font-black leading-[1.15] text-white tracking-tight">
                            AI Thumbnail Generator<br />
                            <span className="relative inline-block mt-1">
                                for your{' '}
                                <span className="relative z-10 px-2 rounded-xl text-white bg-gradient-to-r from-orange-500 to-amber-500 whitespace-nowrap inline-block">
                                    Videos.
                                </span>
                            </span>
                        </h1>
                    
                </motion.div>

                {/* CTA Buttons */}
                <motion.div className="mt-8 flex flex-col gap-3"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.5 }}>
                    <button onClick={handleGenerate}
                        className="relative w-full overflow-hidden rounded-2xl py-4 font-bold text-white text-sm tracking-wide shadow-2xl shadow-orange-500/40 active:scale-[0.97] transition-all"
                        style={{ background: 'linear-gradient(135deg, #f97316, #f59e0b, #f97316)', backgroundSize: '200%' }}>
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                            Generate Thumbnail Now
                        </span>
                    </button>
                    <button onClick={handleRecreate}
                        className="w-full flex items-center justify-center gap-2 rounded-2xl py-4 text-sm font-semibold text-slate-300 border border-white/10 bg-white/5 backdrop-blur-sm active:scale-[0.97] transition-all">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Recreate Existing Thumbnail
                    </button>
                </motion.div>

                {/* Trust pills */}
                <motion.div className="flex flex-wrap justify-center gap-2 mt-6"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35, duration: 0.5 }}>
                    {specialFeatures.map((f, i) => (
                        <span key={i} className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-white/4 border border-white/8 rounded-full px-3 py-1">
                            <CheckIcon className="size-3 text-orange-400 shrink-0" />{f}
                        </span>
                    ))}
                </motion.div>

                {/* Before/After — premium glass cards */}
                <motion.div className="mt-10"
                    initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 200, damping: 60 }}>

                    {/* Label */}
                    <div className="flex items-center gap-3 mb-5">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-orange-900/40" />
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">See the difference</span>
                        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-orange-900/40" />
                    </div>

                    <div className="flex flex-col gap-3">
                        {/* WITHOUT AI */}
                        <motion.div
                            className="rounded-2xl overflow-hidden border border-white/8 bg-white/3 backdrop-blur-sm"
                            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 260, damping: 70 }}>
                            <div className="px-4 py-2 bg-[#0d0800]/80 border-b border-white/5 flex items-center gap-2">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 rounded-full bg-red-500/60" />
                                    <div className="w-2 h-2 rounded-full bg-yellow-500/30" />
                                    <div className="w-2 h-2 rounded-full bg-green-500/20" />
                                </div>
                                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest ml-1">Without AI</span>
                            </div>
                            <div className="p-4 flex items-center gap-4">
                                <div className="shrink-0 w-16 h-12 rounded-lg bg-[#111] border border-white/5 flex items-center justify-center">
                                    <div className="space-y-1.5 w-10">
                                        <div className="h-1.5 bg-[#333] rounded-full" />
                                        <div className="h-1.5 bg-[#2a2a2a] rounded-full w-3/4" />
                                        <div className="h-1.5 bg-[#222] rounded-full w-1/2" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-slate-400 text-xs font-medium">Plain boring text thumbnail</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-[10px] text-red-400/80 bg-red-500/10 border border-red-500/20 rounded-full px-2 py-0.5">CTR: 1.2% 😴</span>
                                        <span className="text-[10px] text-slate-600">Gets ignored</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* WITH AI */}
                        <motion.div
                            className="rounded-2xl overflow-hidden border border-orange-500/40"
                            style={{ background: 'linear-gradient(135deg, #1a0f00, #0d0800)', boxShadow: '0 0 30px rgba(249,115,22,0.15), inset 0 1px 0 rgba(249,115,22,0.1)' }}
                            initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 260, damping: 70 }}>
                            <div className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 flex items-center gap-2">
                                <div className="flex gap-1">
                                    {[...Array(3)].map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/40" />)}
                                </div>
                                <span className="text-[10px] font-bold text-white uppercase tracking-widest ml-1">✅ ThumbForge AI</span>
                            </div>
                            <div className="p-4 flex items-center gap-4">
                                <div className="shrink-0 w-16 h-14 rounded-lg bg-gradient-to-br from-[#1a0500] to-[#0d0300] border border-orange-500/30 flex items-center justify-center overflow-hidden">
                                    <div className="text-center">
                                        <p className="text-xs font-black bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent leading-none">REACT</p>
                                        <p className="text-[9px] font-black text-white leading-none">MASTER</p>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-white text-xs font-semibold">Eye-catching AI thumbnail</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-[10px] text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded-full px-2 py-0.5">CTR: 8.7% 🚀</span>
                                        <span className="text-[10px] text-orange-300/60">7x boost</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* ══════════════════ DESKTOP ══════════════════ */}
            <div className="hidden md:flex flex-col items-center w-full px-16 lg:px-24 xl:px-32">

                <motion.h1 className="text-5xl lg:text-6xl font-bold max-w-3xl text-center mt-44"
                    initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 240, damping: 70, mass: 1 }}>
                    AI Thumbnail Generator for your{" "}
                    <span className="px-3 rounded-xl text-white bg-gradient-to-r from-orange-500 to-amber-500 whitespace-nowrap inline-block mt-2">Videos.</span>
                </motion.h1>

                {/* Before / After */}
                <motion.div className="w-full max-w-3xl mt-16"
                    initial={{ y: 80, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 240, damping: 70, mass: 1 }}>
                    <div className="grid grid-cols-2 gap-6">
                        <motion.div className="rounded-2xl overflow-hidden border border-orange-900/30 bg-[#1a0f00]"
                            initial={{ y: 150, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 240, damping: 70, mass: 1 }}>
                            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0d0800] border-b border-orange-900/30">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">❌ Without AI</span>
                            </div>
                            <div className="h-40 bg-[#111] flex flex-col items-center justify-center gap-3 px-6">
                                <div className="w-4/5 h-2 bg-[#2a2a2a] rounded-full"/>
                                <p className="text-sm text-[#444] font-medium text-center">How to Learn React in 2 Hours - Full Tutorial for Beginners</p>
                                <div className="flex gap-2">
                                    <div className="w-12 h-1.5 bg-[#2a2a2a] rounded-full"/>
                                    <div className="w-8 h-1.5 bg-[#2a2a2a] rounded-full"/>
                                </div>
                                <p className="text-xs text-[#333]">😴 CTR: 1.2%</p>
                            </div>
                            <div className="p-4 space-y-1.5">
                                <p className="text-slate-200 text-sm font-semibold">Plain Text Thumbnail</p>
                                <p className="text-slate-500 text-xs">↓ Boring, no visual appeal</p>
                                <p className="text-slate-500 text-xs">↓ Gets ignored in feed</p>
                                <p className="text-slate-500 text-xs">↓ Low click-through rate</p>
                            </div>
                        </motion.div>

                        <motion.div className="rounded-2xl overflow-hidden border border-orange-500/50 bg-[#1a0f00]"
                            style={{ boxShadow: '0 0 24px rgba(249,115,22,0.2)' }}
                            initial={{ y: 150, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
                            transition={{ delay: 0.15, type: "spring", stiffness: 320, damping: 70, mass: 1 }}>
                            <div className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500">
                                <span className="text-xs font-bold text-white uppercase tracking-widest">✅ ThumbForge AI</span>
                            </div>
                            <div className="h-40 bg-gradient-to-br from-[#0d0500] to-[#1a0800] flex items-center justify-center relative overflow-hidden">
                                <div className="absolute top-2 right-2 w-28 h-28 rounded-full bg-orange-500/20 blur-2xl"/>
                                <div className="relative z-10 text-center px-4">
                                    <p className="text-4xl font-black bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent leading-none">REACT</p>
                                    <p className="text-2xl font-black text-white leading-none mt-1">MASTER</p>
                                    <p className="text-[10px] text-orange-400 tracking-widest uppercase mt-2">Full Course 2025</p>
                                </div>
                                <div className="absolute top-2 right-2 flex gap-1">
                                    {[...Array(3)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-amber-400 rounded-full"/>)}
                                </div>
                                <div className="absolute bottom-2 left-2 bg-black/60 border border-orange-500/50 rounded-full px-2 py-0.5 text-[9px] text-orange-400 font-bold">⚡ AI Generated</div>
                            </div>
                            <div className="p-4 space-y-1.5">
                                <p className="text-white text-sm font-semibold">AI-Powered Thumbnail</p>
                                <p className="text-orange-400 text-xs">↑ Eye-catching design</p>
                                <p className="text-orange-400 text-xs">↑ Stands out in feed</p>
                                <p className="text-orange-400 text-xs">↑ CTR boosted to 8.7%</p>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div className="flex items-center justify-center gap-4 mt-8 w-full"
                    initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}>
                    <button onClick={handleGenerate}
                        className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-full px-7 h-11 shadow-lg shadow-orange-500/25 transition-all active:scale-95">
                        Generate now
                    </button>
                    <button onClick={handleRecreate}
                        className="flex items-center gap-2 border border-orange-800/50 hover:bg-orange-950/50 text-slate-300 transition rounded-full px-6 h-11">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>Recreate Thumbnail</span>
                    </button>
                </motion.div>

                {/* Feature pills */}
                <div className="flex flex-wrap justify-center items-center gap-14 mt-12">
                    {specialFeatures.map((feature, index) => (
                        <motion.p className="flex items-center gap-2" key={index}
                            initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
                            transition={{ delay: index * 0.2, duration: 0.3 }}>
                            <CheckIcon className="size-5 text-orange-500" />
                            <span className="text-slate-400">{feature}</span>
                        </motion.p>
                    ))}
                </div>

                <TiltedImage />
            </div>
        </div>
    );
}
