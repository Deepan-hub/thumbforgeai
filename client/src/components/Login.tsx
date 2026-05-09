import React, { useEffect, useState } from 'react';
import SoftBackdrop from './SoftBackdrop';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Login = () => {
    const [searchParams] = useSearchParams();
    const [state, setState] = useState(searchParams.get('signup') === 'true' ? 'register' : 'login');
    const { user, login, signUp } = useAuth();
    const navigate = useNavigate();
    const [showPass, setShowPass] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (state === 'login') login(formData);
        else signUp(formData);
    };

    useEffect(() => { if (user) navigate('/'); }, [user]);

    return (
        <>
            <SoftBackdrop />
            <div className='min-h-screen flex items-center justify-center px-4 py-8 pt-24'>
                <div className='w-full max-w-sm'>

                    {/* Card */}
                    <div className='bg-[#1a0f00]/90 border border-orange-900/40 rounded-3xl p-6 shadow-2xl shadow-black/40 backdrop-blur'>

                        {/* Logo + heading inside card */}
                        <div className='text-center mb-6'>
                            <div className='inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 mb-4 shadow-lg shadow-orange-500/30'>
                                <svg className='w-7 h-7 text-white' fill='currentColor' viewBox='0 0 24 24'><polygon points='13 2 3 14 12 14 11 22 21 10 12 10 13 2'/></svg>
                            </div>
                            <h1 className='text-2xl font-black text-white tracking-tight'>
                                {state === 'login' ? 'Welcome back' : 'Create account'}
                            </h1>
                            <p className='text-slate-400 text-sm mt-1'>
                                {state === 'login' ? 'Sign in to continue generating' : 'Start creating stunning thumbnails'}
                            </p>
                        </div>
                        <form onSubmit={handleSubmit} className='space-y-4'>

                            {/* Name field — signup only */}
                            {state !== 'login' && (
                                <div>
                                    <label className='block text-xs font-semibold text-slate-400 mb-1.5 ml-1'>Full Name</label>
                                    <div className='flex items-center gap-3 px-4 h-12 rounded-xl bg-[#0d0800] border border-orange-900/40 focus-within:border-orange-500/70 focus-within:ring-2 focus-within:ring-orange-500/20 transition-all'>
                                        <svg className='w-4 h-4 text-orange-500/60 shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'><circle cx='12' cy='8' r='5'/><path d='M20 21a8 8 0 0 0-16 0'/></svg>
                                        <input type='text' name='name' placeholder='Your name' value={formData.name} onChange={handleChange} required
                                            className='flex-1 bg-transparent text-white placeholder:text-slate-600 text-sm outline-none' />
                                    </div>
                                </div>
                            )}

                            {/* Email */}
                            <div>
                                <label className='block text-xs font-semibold text-slate-400 mb-1.5 ml-1'>Email Address</label>
                                <div className='flex items-center gap-3 px-4 h-12 rounded-xl bg-[#0d0800] border border-orange-900/40 focus-within:border-orange-500/70 focus-within:ring-2 focus-within:ring-orange-500/20 transition-all'>
                                    <svg className='w-4 h-4 text-orange-500/60 shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path d='m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7'/><rect x='2' y='4' width='20' height='16' rx='2'/></svg>
                                    <input type='email' name='email' placeholder='you@email.com' value={formData.email} onChange={handleChange} required
                                        className='flex-1 bg-transparent text-white placeholder:text-slate-600 text-sm outline-none' />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className='block text-xs font-semibold text-slate-400 mb-1.5 ml-1'>Password</label>
                                <div className='flex items-center gap-3 px-4 h-12 rounded-xl bg-[#0d0800] border border-orange-900/40 focus-within:border-orange-500/70 focus-within:ring-2 focus-within:ring-orange-500/20 transition-all'>
                                    <svg className='w-4 h-4 text-orange-500/60 shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'><rect width='18' height='11' x='3' y='11' rx='2'/><path d='M7 11V7a5 5 0 0 1 10 0v4'/></svg>
                                    <input type={showPass ? 'text' : 'password'} name='password' placeholder='••••••••' value={formData.password} onChange={handleChange} required
                                        className='flex-1 bg-transparent text-white placeholder:text-slate-600 text-sm outline-none' />
                                    <button type='button' onClick={() => setShowPass(!showPass)} className='text-slate-500 hover:text-slate-300 transition'>
                                        {showPass
                                            ? <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path d='M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94'/><path d='M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19'/><line x1='1' y1='1' x2='23' y2='23'/></svg>
                                            : <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'/><circle cx='12' cy='12' r='3'/></svg>
                                        }
                                    </button>
                                </div>
                            </div>

                            {/* Forgot password */}
                            {state === 'login' && (
                                <div className='text-right'>
                                    <button type='button' className='text-xs text-orange-400 hover:text-orange-300 transition'>Forgot password?</button>
                                </div>
                            )}

                            {/* Submit */}
                            <button type='submit'
                                className='w-full h-12 rounded-xl font-bold text-white text-sm bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg shadow-orange-500/25 active:scale-[0.98] transition-all mt-2'>
                                {state === 'login' ? 'Sign In' : 'Create Account'}
                            </button>
                        </form>

                        {/* Toggle */}
                        <div className='mt-5 pt-5 border-t border-orange-900/30 text-center'>
                            <p className='text-slate-500 text-sm'>
                                {state === 'login' ? "Don't have an account?" : 'Already have an account?'}
                                <button onClick={() => setState(state === 'login' ? 'register' : 'login')}
                                    className='text-orange-400 font-semibold ml-1.5 hover:text-orange-300 transition'>
                                    {state === 'login' ? 'Sign up' : 'Sign in'}
                                </button>
                            </p>
                        </div>
                    </div>

                    {/* Trust badge */}
                    <p className='text-center text-slate-600 text-xs mt-6'>
                        🔒 Secure · No spam · Cancel anytime
                    </p>
                </div>
            </div>
        </>
    );
};

export default Login;
