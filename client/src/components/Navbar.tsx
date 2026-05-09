import { MenuIcon } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { isLoggedIn, user, logout, credits } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [generateOpen, setGenerateOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const scrollTo = (id: string) => {
        setIsOpen(false);
        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(() => {
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const scrollToTop = () => {
        setIsOpen(false);
        if (location.pathname !== '/') {
            navigate('/');
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <>
            <motion.nav className='fixed top-0 z-50 flex items-center justify-between w-full py-4 px-6 md:px-16 lg:px-24 xl:px-32 backdrop-blur border-b border-orange-900/20'
                initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 250, damping: 70, mass: 1 }}>
                <Link to='/'>
                    <img src='/logo.svg' alt='logo' className='h-8.5 w-auto' />
                </Link>

                {/* Desktop links */}
                <div className='hidden md:flex items-center gap-8'>
                    {isLoggedIn ? (
                        <>
                            <Link to='/' className='hover:text-orange-400 transition'>Home</Link>

                            {/* Generate Dropdown */}
                            <div className='relative' onMouseEnter={() => setGenerateOpen(true)} onMouseLeave={() => setGenerateOpen(false)}>
                                <button className='flex items-center gap-1 hover:text-orange-400 transition'>
                                    Generate
                                    <svg className={`w-4 h-4 transition-transform duration-200 ${generateOpen ? 'rotate-180' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7'/></svg>
                                </button>
                                {generateOpen && (
                                    <div className='absolute top-6 left-0 pt-2 w-52'>
                                        <div className='bg-[#1a0f00] border border-orange-900/40 rounded-xl shadow-xl overflow-hidden'>
                                            <Link to='/generate' className='flex items-center gap-2 px-4 py-3 text-sm hover:bg-orange-950/60 hover:text-orange-400 transition'>
                                                ✨ Generate Thumbnail
                                            </Link>
                                            <Link to='/recreate' className='flex items-center gap-2 px-4 py-3 text-sm hover:bg-orange-950/60 hover:text-orange-400 transition border-t border-orange-900/30'>
                                                🔄 Recreate Thumbnail
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <Link to='/my-generation' className='hover:text-orange-400 transition'>My Generations</Link>
                            <Link to='/pricing' className='text-orange-400 font-semibold hover:text-orange-300 transition'>Buy Credits</Link>
                        </>
                    ) : (
                        <>
                            <button onClick={scrollToTop} className='hover:text-orange-400 transition'>Home</button>
                            <button onClick={() => scrollTo('features')} className='hover:text-orange-400 transition'>Features</button>
                            <button onClick={() => scrollTo('how-it-works')} className='hover:text-orange-400 transition'>How it works</button>
                            <button onClick={() => scrollTo('pricing')} className='hover:text-orange-400 transition'>Pricing</button>
                        </>
                    )}
                </div>

                <div className='flex items-center gap-2'>
                    {isLoggedIn ? (
                        <div className='relative group'>
                            <button className='rounded-full size-8 bg-orange-500/20 border-2 border-orange-500/30 text-orange-300 font-semibold'>{user?.name.charAt(0).toUpperCase()}</button>
                            <div className='absolute hidden group-hover:block top-8 right-0 pt-2'>
                                <div className='bg-[#1a0f00] border border-orange-800/50 rounded-xl shadow-xl overflow-hidden min-w-[200px]'>
                                    <div className='px-4 py-3 border-b border-orange-900/40'>
                                        <p className='text-sm font-semibold text-white'>{user?.name}</p>
                                        <p className='text-xs text-slate-400 mt-0.5'>{user?.email}</p>
                                    </div>
                                    <Link to='/pricing' className='flex items-center gap-3 px-4 py-2.5 text-sm text-slate-200 hover:bg-orange-950/60 hover:text-orange-400 transition'>
                                        <svg className='w-4 h-4 text-orange-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'/></svg>
                                        <span className={credits < 10 ? 'text-red-400' : ''}>{credits} Credit{credits !== 1 ? 's' : ''}</span>
                                    </Link>
                                    <button onClick={() => logout()} className='w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-200 hover:bg-orange-950/60 hover:text-orange-400 transition border-t border-orange-900/30'>
                                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'/></svg>
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className='hidden md:flex items-center gap-3'>
                            <button onClick={() => navigate('/login')} className='px-5 py-2.5 border border-orange-500/40 text-orange-400 hover:bg-orange-500/10 font-semibold active:scale-95 transition-all rounded-full'>
                                Sign In
                            </button>
                            <button onClick={() => navigate('/login?signup=true')} className='px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold active:scale-95 transition-all rounded-full shadow-lg shadow-orange-500/25'>
                                Get Started Free
                            </button>
                        </div>
                    )}
                    <button onClick={() => setIsOpen(true)} className='md:hidden'>
                        <MenuIcon size={26} className='active:scale-90 transition' />
                    </button>
                </div>
            </motion.nav>

            {/* Mobile — bottom sheet */}
            <>
                {/* Backdrop */}
                <div onClick={() => setIsOpen(false)}
                    className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} />

                {/* Bottom Sheet */}
                <div className={`fixed bottom-0 left-0 right-0 z-50 md:hidden transition-transform duration-400 ease-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
                    <div className='bg-[#0f0700] border-t border-orange-900/40 rounded-t-3xl overflow-hidden shadow-2xl shadow-black/60'>
                        {/* Handle */}
                        <div className='flex justify-center pt-3 pb-1'>
                            <div className='w-10 h-1 rounded-full bg-orange-900/60' />
                        </div>

                        {/* User info */}
                        {isLoggedIn && (
                            <div className='mx-4 mt-3 mb-1 flex items-center gap-3 px-4 py-3 rounded-2xl bg-orange-950/40 border border-orange-900/30'>
                                <div className='w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm shrink-0'>
                                    {user?.name.charAt(0).toUpperCase()}
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <p className='text-white font-semibold text-sm truncate'>{user?.name}</p>
                                    <p className='text-slate-500 text-xs truncate'>{user?.email}</p>
                                </div>
                                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${credits < 10 ? 'bg-red-500/15 text-red-400 border border-red-500/25' : 'bg-orange-500/15 text-orange-400 border border-orange-500/25'}`}>
                                    <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'><path d='M10 2a8 8 0 100 16A8 8 0 0010 2zm0 14a6 6 0 110-12 6 6 0 010 12zm1-7H9V7h2v2zm0 4H9v-2h2v2z'/></svg>
                                    {credits}
                                </div>
                            </div>
                        )}

                        {/* Nav links */}
                        <nav className='px-4 py-3 space-y-1'>
                            {(isLoggedIn ? [
                                { to: '/', label: 'Home', icon: <svg className='w-4.5 h-4.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'/></svg> },
                                { to: '/generate', label: 'Generate Thumbnail', icon: <svg className='w-4.5 h-4.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'><polygon strokeLinejoin='round' strokeWidth={2} points='13 2 3 14 12 14 11 22 21 10 12 10 13 2'/></svg> },
                                { to: '/recreate', label: 'Recreate Thumbnail', icon: <svg className='w-4.5 h-4.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'/></svg> },
                                { to: '/my-generation', label: 'My Generations', icon: <svg className='w-4.5 h-4.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'><rect strokeLinejoin='round' strokeWidth={2} x='3' y='3' width='18' height='18' rx='2'/><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 9h18'/></svg> },
                                { to: '/pricing', label: 'Buy Credits', icon: <svg className='w-4.5 h-4.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'/></svg>, highlight: true },
                            ] : [
                                { to: '/', label: 'Home', onClick: scrollToTop, icon: <svg className='w-4.5 h-4.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'/></svg> },
                                { to: '/#features', label: 'Features', onClick: () => scrollTo('features'), icon: <svg className='w-4.5 h-4.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z'/></svg> },
                                { to: '/#how-it-works', label: 'How it works', onClick: () => scrollTo('how-it-works'), icon: <svg className='w-4.5 h-4.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'><circle cx='12' cy='12' r='10' strokeWidth={2}/><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3'/></svg> },
                                { to: '/#pricing', label: 'Pricing', onClick: () => scrollTo('pricing'), icon: <svg className='w-4.5 h-4.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'/></svg>, highlight: true },
                            ]).map((item: any) => (
                                <button key={item.to} onClick={item.onClick || (() => { setIsOpen(false); navigate(item.to); })}
                                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${item.highlight ? 'text-orange-400 bg-orange-500/10 border border-orange-500/20' : 'text-slate-300 hover:text-white hover:bg-orange-950/40'}`}>
                                    <span className='text-orange-400'>{item.icon}</span>
                                    {item.label}
                                </button>
                            ))}
                        </nav>

                        {/* Bottom actions */}
                        <div className='px-4 pb-8 pt-2 border-t border-orange-900/20 mt-1'>
                            {isLoggedIn ? (
                                <button onClick={() => { setIsOpen(false); logout(); }}
                                    className='w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-red-500/25 bg-red-500/8 text-red-400 text-sm font-semibold active:scale-95 transition-all'>
                                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'/></svg>
                                    Logout
                                </button>
                            ) : (
                                <Link to='/login?signup=true' onClick={() => setIsOpen(false)}
                                    className='w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-bold shadow-lg shadow-orange-500/25 active:scale-95 transition-all'>
                                    Get Started Free
                                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 7l5 5m0 0l-5 5m5-5H6'/></svg>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </>
        </>
    );
}
