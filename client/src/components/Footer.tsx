import { footerData } from '../data/footer';
import { DribbbleIcon, LinkedinIcon, TwitterIcon, YoutubeIcon } from 'lucide-react';
import { motion } from 'motion/react';
import type { IFooterLink } from '../types';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className='mt-20 border-t border-orange-900/20'>

            {/* ── MOBILE ── */}
            <div className='md:hidden px-5 pt-8 pb-10'>
                {/* Logo + tagline */}
                <div className='flex items-center gap-3 mb-6'>
                    <Link to='/'>
                        <img className='h-7 w-auto' src='/favicon.svg' alt='ThumbForge AI' width={28} height={28} />
                    </Link>
                    <div>
                        <p className='text-white font-bold text-sm'>ThumbForge AI</p>
                        <p className='text-slate-600 text-xs'>AI Thumbnails for Creators</p>
                    </div>
                </div>

                {/* Links grid */}
                <div className='grid grid-cols-2 gap-6 mb-8'>
                    {footerData.map((section, index) => (
                        <div key={index}>
                            <p className='text-slate-200 font-bold text-sm mb-3'>{section.title}</p>
                            <ul className='space-y-2.5'>
                                {section.links.map((link: IFooterLink, i: number) => (
                                    <li key={i}>
                                        <Link to={link.href} className='text-slate-500 text-sm hover:text-orange-400 transition'>
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Socials */}
                <div className='flex items-center gap-5 mb-6'>
                    {[
                        { icon: <DribbbleIcon className='size-5' />, href: '#' },
                        { icon: <LinkedinIcon className='size-5' />, href: '#' },
                        { icon: <TwitterIcon className='size-5' />, href: '#' },
                        { icon: <YoutubeIcon className='size-5' />, href: '#' },
                    ].map((s, i) => (
                        <a key={i} href={s.href} target='_blank' rel='noreferrer'
                            className='text-slate-500 hover:text-orange-400 active:text-orange-300 transition'>
                            {s.icon}
                        </a>
                    ))}
                </div>

                {/* Copyright */}
                <div className='pt-5 border-t border-orange-900/20'>
                    <p className='text-slate-600 text-xs'>
                        &copy; {new Date().getFullYear()} ThumbForge AI. All rights reserved.
                    </p>
                </div>
            </div>

            {/* ── DESKTOP (unchanged) ── */}
            <motion.div className='hidden md:flex flex-wrap justify-between overflow-hidden gap-10 md:gap-20 py-6 px-16 lg:px-24 xl:px-32 text-[13px] text-gray-500'
                initial={{ x: -150, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 280, damping: 70, mass: 1 }}>
                <div className='flex flex-wrap items-start gap-10 md:gap-35'>
                    <Link to='/'>
                        <img className='size-8 aspect-square' src='/favicon.svg' alt='footer logo' width={32} height={32} />
                    </Link>
                    {footerData.map((section, index) => (
                        <div key={index}>
                            <p className='text-slate-100 font-semibold'>{section.title}</p>
                            <ul className='mt-2 space-y-2'>
                                {section.links.map((link: IFooterLink, index: number) => (
                                    <li key={index}>
                                        <Link to={link.href} className='hover:text-orange-600 transition'>{link.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <motion.div className='flex flex-col items-end gap-2'
                    initial={{ x: 150, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 280, damping: 70, mass: 1 }}>
                    <p className='max-w-60'>Making every customer feel valued—no matter the size of your audience.</p>
                    <div className='flex items-center gap-4 mt-3'>
                        <a href='#' target='_blank' rel='noreferrer'><DribbbleIcon className='size-5 hover:text-orange-500' /></a>
                        <a href='#' target='_blank' rel='noreferrer'><LinkedinIcon className='size-5 hover:text-orange-500' /></a>
                        <a href='#' target='_blank' rel='noreferrer'><TwitterIcon className='size-5 hover:text-orange-500' /></a>
                        <a href='' target='_blank' rel='noreferrer'><YoutubeIcon className='size-6 hover:text-orange-500' /></a>
                    </div>
                    <p className='mt-3 text-center'>&copy; {new Date().getFullYear()} <a href='#'>ThumbForge AI</a></p>
                </motion.div>
            </motion.div>
        </footer>
    );
}
