'use client'
import SectionTitle from "../components/SectionTitle";
import { ArrowRightIcon, MailIcon, UserIcon } from "lucide-react";
import { motion } from "motion/react";

export default function ContactSection() {
    return (
        <div>
            {/* ── MOBILE ── */}
            <div className="md:hidden px-4 pt-12 pb-6">
                <div className="mb-6">
                    <span className="text-[11px] font-bold text-orange-400 uppercase tracking-widest">Contact</span>
                    <h2 className="text-2xl font-black text-white mt-1">Get in touch</h2>
                    <p className="text-slate-400 text-sm mt-1">Have questions? We'd love to hear from you.</p>
                </div>

                <form onSubmit={(e) => e.preventDefault()} className='space-y-4'>
                    <div>
                        <label className='block text-xs font-semibold text-slate-400 mb-1.5 ml-1'>Your name</label>
                        <div className='flex items-center gap-3 px-4 h-12 rounded-xl bg-[#1a0f00] border border-orange-900/40 focus-within:border-orange-500/70 focus-within:ring-2 focus-within:ring-orange-500/20 transition-all'>
                            <UserIcon className='size-4 text-orange-500/60 shrink-0' />
                            <input name='name' type="text" placeholder='Enter your name'
                                className='flex-1 bg-transparent text-white placeholder:text-slate-600 text-sm outline-none' />
                        </div>
                    </div>
                    <div>
                        <label className='block text-xs font-semibold text-slate-400 mb-1.5 ml-1'>Email address</label>
                        <div className='flex items-center gap-3 px-4 h-12 rounded-xl bg-[#1a0f00] border border-orange-900/40 focus-within:border-orange-500/70 focus-within:ring-2 focus-within:ring-orange-500/20 transition-all'>
                            <MailIcon className='size-4 text-orange-500/60 shrink-0' />
                            <input name='email' type="email" placeholder='your@email.com'
                                className='flex-1 bg-transparent text-white placeholder:text-slate-600 text-sm outline-none' />
                        </div>
                    </div>
                    <div>
                        <label className='block text-xs font-semibold text-slate-400 mb-1.5 ml-1'>Message</label>
                        <textarea name='message' rows={5} placeholder='Tell us how we can help...'
                            className='resize-none w-full px-4 py-3 rounded-xl border border-orange-900/40 bg-[#1a0f00] text-white placeholder:text-slate-600 text-sm focus:border-orange-500/70 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all' />
                    </div>
                    <button type='submit'
                        className='w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm shadow-lg shadow-orange-500/25 active:scale-[0.98] transition-all'>
                        Send Message
                        <ArrowRightIcon className="size-4" />
                    </button>
                </form>
            </div>

            {/* ── DESKTOP (unchanged) ── */}
            <div className="hidden md:block px-16 lg:px-24 xl:px-32">
                <SectionTitle text1="Contact" text2="Grow your channel" text3="Have questions about our AI? Ready to scale your views? Let's talk." />
                <form onSubmit={(e) => e.preventDefault()} className='grid sm:grid-cols-2 gap-3 sm:gap-5 max-w-2xl mx-auto text-slate-300 mt-16 w-full'>
                    <motion.div initial={{ y: 150, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}>
                        <p className='mb-2 font-medium text-slate-200'>Your name</p>
                        <div className='flex items-center pl-3 rounded-xl border border-orange-900/40 bg-[#1a0f00] focus-within:border-orange-500 transition-all'>
                            <UserIcon className='size-5 text-orange-500/70' />
                            <input name='name' type="text" placeholder='Enter your name' className='w-full p-3 outline-none bg-transparent text-white placeholder:text-slate-500' />
                        </div>
                    </motion.div>
                    <motion.div initial={{ y: 150, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 280, damping: 70, mass: 1 }}>
                        <p className='mb-2 font-medium text-slate-200'>Email id</p>
                        <div className='flex items-center pl-3 rounded-xl border border-orange-900/40 bg-[#1a0f00] focus-within:border-orange-500 transition-all'>
                            <MailIcon className='size-5 text-orange-500/70' />
                            <input name='email' type="email" placeholder='Enter your email' className='w-full p-3 outline-none bg-transparent text-white placeholder:text-slate-500' />
                        </div>
                    </motion.div>
                    <motion.div className='sm:col-span-2' initial={{ y: 150, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 240, damping: 70, mass: 1 }}>
                        <p className='mb-2 font-medium text-slate-200'>Message</p>
                        <textarea name='message' rows={8} placeholder='Enter your message' className='resize-none w-full p-3 outline-none rounded-xl border border-orange-900/40 bg-[#1a0f00] text-white placeholder:text-slate-500 focus:border-orange-500 transition-all' />
                    </motion.div>
                    <motion.button type='submit' className='w-max flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold px-10 py-3 rounded-full shadow-lg shadow-orange-500/25 active:scale-95 transition-all'
                        initial={{ y: 150, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 280, damping: 70, mass: 1 }}>
                        Submit
                        <ArrowRightIcon className="size-5" />
                    </motion.button>
                </form>
            </div>
        </div>
    );
}
