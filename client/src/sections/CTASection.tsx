'use client'
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

export default function CTASection() {
    const navigate = useNavigate();
    return (
        <>
            {/* ── MOBILE ── */}
            <motion.div className="md:hidden mx-4 mt-16 rounded-3xl overflow-hidden border border-orange-500/30 shadow-xl shadow-orange-900/20"
                style={{ background: 'linear-gradient(135deg, #1a0800 0%, #0d0500 50%, #1a0800 100%)' }}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 260, damping: 70 }}>
                {/* Top accent line */}
                <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500" />
                <div className="p-6 text-center">
                    {/* Icon */}
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-orange-500/15 border border-orange-500/30 mb-4">
                        <svg className="w-6 h-6 text-orange-400" fill='currentColor' viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                    </div>
                    <h2 className="text-2xl font-black text-white leading-tight">
                        Ready to go{' '}
                        <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">viral?</span>
                    </h2>
                    <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                        Join thousands of creators using AI to boost their CTR.
                    </p>
                    <button onClick={() => navigate('/generate')}
                        className="mt-5 w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm shadow-lg shadow-orange-500/30 active:scale-[0.98] transition-all">
                        Generate Free Thumbnail ⚡
                    </button>
                    <p className="text-slate-600 text-xs mt-3">No credit card required · 100 free credits</p>
                </div>
            </motion.div>

            {/* ── DESKTOP (unchanged) ── */}
            <motion.div className="hidden md:flex max-w-5xl py-16 mt-40 md:pl-20 md:w-full md:mx-auto flex-row gap-6 items-center justify-between text-left bg-gradient-to-b from-orange-950 to-[#1a0800] border border-orange-800/30 rounded-2xl p-6 text-white shadow-xl shadow-orange-900/20"
                initial={{ y: 150, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}>
                <div>
                    <motion.h1 className="text-[46px] leading-[3.75rem] font-bold bg-gradient-to-r from-white to-amber-400 text-transparent bg-clip-text"
                        initial={{ y: 80, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 280, damping: 70, mass: 1 }}>
                        Ready to go viral?
                    </motion.h1>
                    <motion.p className="text-slate-300 text-lg mt-2"
                        initial={{ y: 80, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 200, damping: 70, mass: 1 }}>
                        Join thousands of creators using AI to boost their CTR.
                    </motion.p>
                </div>
                <motion.button onClick={() => navigate('/generate')}
                    className="px-12 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-full text-sm mt-4 shadow-lg shadow-orange-500/30 active:scale-95 transition-all"
                    initial={{ y: 80, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 280, damping: 70, mass: 1 }}>
                    Generate Free Thumbnail
                </motion.button>
            </motion.div>
        </>
    );
}
