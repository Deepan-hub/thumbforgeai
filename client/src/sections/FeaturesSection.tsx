import SectionTitle from "../components/SectionTitle";
import { motion } from "motion/react";
import { featuresData } from "../data/features";
import type { IFeature } from "../types";

const steps = [
    { num: 1, title: 'Enter Title', desc: 'Type your video topic', icon: <svg width="22" height="22" fill="none" stroke="#F97316" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/></svg> },
    { num: 2, title: 'Pick Style', desc: 'Choose design & colors', icon: <svg width="22" height="22" fill="none" stroke="#F97316" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg> },
    { num: 3, title: 'AI Generates', desc: 'Get thumbnail instantly', icon: <svg width="22" height="22" fill="none" stroke="#F97316" strokeWidth="2" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> },
    { num: 4, title: 'Download', desc: 'Publish on YouTube', icon: <svg width="22" height="22" fill="none" stroke="#F97316" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> },
];

export default function FeaturesSection() {
    return (
        <div id="features" className="overflow-x-hidden">
            <div id="how-it-works" style={{position:'absolute', marginTop:'-80px'}} />

            {/* ══════════════════ MOBILE ══════════════════ */}
            <div className="md:hidden px-5 pt-12 pb-10">

                {/* How It Works — premium timeline */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 220, damping: 65 }}>
                    <div className="flex items-center justify-center gap-2 mb-8">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-orange-500/40" />
                        <span className="text-[11px] font-bold text-orange-400 uppercase tracking-widest">How It Works</span>
                        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-orange-500/40" />
                    </div>

                    <div className="relative pl-6">
                        {/* Vertical timeline line */}
                        <div className="absolute left-[23px] top-6 bottom-6 w-px bg-gradient-to-b from-orange-500/60 via-amber-500/30 to-transparent" />

                        {steps.map((step, i) => (
                            <motion.div key={i} className="flex gap-4 mb-7 last:mb-0"
                                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                                transition={{ delay: i * 0.1, type: "spring", stiffness: 260, damping: 70 }}>
                                {/* Icon circle */}
                                <div className="shrink-0 w-11 h-11 rounded-xl bg-[#1a0f00] border border-orange-500/50 flex items-center justify-center relative z-10"
                                    style={{ boxShadow: '0 0 14px rgba(249,115,22,0.3)' }}>
                                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white text-[9px] font-black">{step.num}</span>
                                    {step.icon}
                                </div>
                                {/* Text */}
                                <div className="pt-1">
                                    <p className="text-white font-bold text-sm">{step.title}</p>
                                    <p className="text-slate-500 text-xs mt-0.5">{step.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Section heading */}
                <motion.div className="mt-12"
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 220, damping: 65 }}>
                    <span className="text-[11px] font-bold text-orange-400 uppercase tracking-widest">Features</span>
                    <h2 className="text-2xl font-black text-white mt-1 leading-tight">Why use our<br />generator?</h2>
                    <p className="text-slate-400 text-sm mt-2">Create stunning thumbnails that get clicks, without the hassle.</p>
                </motion.div>

                {/* Feature cards — stacked full width on mobile */}
                <div className="mt-6 flex flex-col gap-4">
                    {featuresData.map((feature: IFeature, index: number) => (
                        <motion.div key={index}
                            className={index === 1 ? 'p-px rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600' : ''}
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                            transition={{ delay: index * 0.1, type: "spring", stiffness: 260, damping: 70 }}>
                            <div className="flex items-start gap-4 p-4 rounded-2xl border border-orange-900/30 bg-[#1a0f00]">
                                <div className="shrink-0 w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                                    <img src={feature.icon} alt={feature.title} className="w-5 h-5"
                                        style={{ filter: 'brightness(0) saturate(100%) invert(55%) sepia(90%) saturate(500%) hue-rotate(360deg) brightness(1.1)' }} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-white font-bold text-sm">{feature.title}</h3>
                                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">{feature.description}</p>
                                </div>
                                {index === 1 && (
                                    <span className="shrink-0 text-[9px] font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded-full px-2 py-0.5 mt-0.5">Popular</span>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* ══════════════════ DESKTOP ══════════════════ */}
            <div className="hidden md:block px-16 lg:px-24 xl:px-32">
                {/* How It Works */}
                <motion.div className="w-full max-w-4xl mt-12 mx-auto"
                    initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 240, damping: 70, mass: 1 }}>
                    <p className="text-center text-orange-400 font-semibold text-xs tracking-widest uppercase mb-6">How It Works</p>
                    <div className="flex items-center justify-center">
                        {steps.map((step, i) => (
                            <div key={i} className="flex items-center">
                                <motion.div className="flex flex-col items-center text-center w-32 lg:w-40"
                                    initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
                                    transition={{ delay: i * 0.15, type: "spring", stiffness: 280, damping: 70 }}>
                                    <div className="relative w-16 h-16 rounded-2xl bg-[#1a0f00] border border-orange-500/60 flex items-center justify-center"
                                        style={{ boxShadow: '0 0 12px rgba(249,115,22,0.4), 0 0 24px rgba(249,115,22,0.15)' }}>
                                        <span className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white text-[10px] font-bold">{step.num}</span>
                                        {step.icon}
                                    </div>
                                    <p className="text-white font-semibold text-xs mt-3">{step.title}</p>
                                    <p className="text-slate-500 text-[10px] mt-1">{step.desc}</p>
                                </motion.div>
                                {i < 3 && (
                                    <div className="h-px w-8 lg:w-14 mb-8 shrink-0"
                                        style={{ background: 'linear-gradient(to right, #F97316, #FBBF24, #3a1f00)' }} />
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>

                <SectionTitle text1="Features" text2="Why use our generator?" text3="Create stunning thumbnails that get clicks, without the hassle." />

                <div className="flex flex-wrap items-stretch justify-center gap-6 mt-16">
                    {featuresData.map((feature: IFeature, index: number) => (
                        <motion.div key={index}
                            className={`w-80 ${index === 1 ? 'p-px rounded-[13px] bg-gradient-to-br from-orange-500 to-amber-700' : ''}`}
                            initial={{ y: 150, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
                            transition={{ delay: index * 0.15, type: "spring", stiffness: 320, damping: 70, mass: 1 }}>
                            <div className="h-full p-6 rounded-xl space-y-4 border border-orange-900/40 bg-[#1a0f00] hover:border-orange-700/60 transition-all">
                                <img src={feature.icon} alt={feature.title} className="w-7 h-7"
                                    style={{ filter: 'brightness(0) saturate(100%) invert(55%) sepia(90%) saturate(500%) hue-rotate(360deg) brightness(1.1)' }} />
                                <h3 className="text-base font-semibold text-white">{feature.title}</h3>
                                <p className="text-slate-400 line-clamp-2 pb-4">{feature.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
