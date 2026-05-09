import { useEffect, useState } from 'react';
import { CheckIcon } from 'lucide-react';
import { motion } from 'motion/react';
import SoftBackdrop from '../components/SoftBackdrop';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../configs/api';
import toast from 'react-hot-toast';

const exchangeRates: Record<string, { symbol: string; rate: number; name: string; flag: string }> = {
    IN: { symbol: '₹', rate: 83.5,  name: 'INR', flag: '🇮🇳' },
    US: { symbol: '$', rate: 1,     name: 'USD', flag: '🇺🇸' },
    GB: { symbol: '£', rate: 0.79,  name: 'GBP', flag: '🇬🇧' },
    DE: { symbol: '€', rate: 0.92,  name: 'EUR', flag: '🇩🇪' },
    AU: { symbol: 'A$', rate: 1.53, name: 'AUD', flag: '🇦🇺' },
    CA: { symbol: 'C$', rate: 1.36, name: 'CAD', flag: '🇨🇦' },
    JP: { symbol: '¥', rate: 149.5, name: 'JPY', flag: '🇯🇵' },
    SG: { symbol: 'S$', rate: 1.34, name: 'SGD', flag: '🇸🇬' },
    AE: { symbol: 'AED', rate: 3.67, name: 'AED', flag: '🇦🇪' },
};

const plans = [
    {
        id: 'basic',
        name: 'Basic',
        priceUSD: 29,
        priceINR: 2499,
        credits: 1000,
        period: 'month',
        popular: false,
        features: [
            '1000 Credits',
            'Standard Quality (5 credits each)',
            'Basic Templates',
            'Standard Resolution',
            'No Watermark',
            'Email Support',
        ],
    },
    {
        id: 'pro',
        name: 'Pro',
        priceUSD: 79,
        priceINR: 6599,
        credits: 5000,
        period: 'month',
        popular: true,
        features: [
            '5000 Credits',
            'Premium Quality (10 credits each)',
            'All Templates',
            '4K Resolution',
            'A/B Testing Tools',
            'Priority Support',
            'Custom Fonts',
            'Brand Kit Analysis',
        ],
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        priceUSD: 199,
        priceINR: 16599,
        credits: 10000,
        period: 'month',
        popular: false,
        features: [
            '10000 Credits',
            'Standard + Premium Quality',
            'Everything in Pro',
            'API Access',
            'Team Collaboration',
            'Custom Branding',
            'Dedicated Account Manager',
        ],
    },
];

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function PricingPage() {
    const { isLoggedIn, credits, setCredits } = useAuth();
    const navigate = useNavigate();
    const [currency, setCurrency] = useState(exchangeRates['US']);
    const [loading, setLoading] = useState(false);
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
    const [detectingLocation, setDetectingLocation] = useState(true);

    useEffect(() => {
        // Detect user location
        const detect = async () => {
            try {
                const res = await fetch('https://ipapi.co/json/');
                const data = await res.json();
                const code = data.country_code;
                if (exchangeRates[code]) setCurrency(exchangeRates[code]);
            } catch {
                const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
                if (tz.includes('Kolkata') || tz.includes('Calcutta')) setCurrency(exchangeRates['IN']);
            } finally {
                setDetectingLocation(false);
            }
        };
        detect();

        // Load Razorpay script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        return () => { document.body.removeChild(script); };
    }, []);

    const formatPrice = (usdPrice: number, inrPrice: number) => {
        if (currency.name === 'INR') return `₹${inrPrice.toLocaleString()}`;
        const converted = Math.round(usdPrice * currency.rate);
        return `${currency.symbol}${converted.toLocaleString()}`;
    };

    const handleBuy = async (plan: typeof plans[0]) => {
        if (!isLoggedIn) {
            toast.error('Please login to purchase credits');
            navigate('/login');
            return;
        }

        setLoadingPlan(plan.id);
        setLoading(true);

        try {
            // Create order on server
            const { data } = await api.post('/api/payment/create-order', { packageId: plan.id });

            // Open Razorpay checkout
            const options = {
                key: data.keyId,
                amount: data.amount,
                currency: data.currency,
                name: 'ThumbForge AI',
                description: `${plan.name} Plan — ${plan.credits} Credits`,
                order_id: data.orderId,
                prefill: {
                    name: data.user.name,
                    email: data.user.email,
                },
                theme: { color: '#f97316' },
                handler: async (response: any) => {
                    try {
                        // Verify payment and add credits
                        const { data: verifyData } = await api.post('/api/payment/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            packageId: plan.id,
                        });
                        setCredits(verifyData.credits);
                        toast.success(verifyData.message);
                        navigate('/generate');
                    } catch (err: any) {
                        toast.error(err?.response?.data?.message || 'Payment verification failed');
                    }
                },
                modal: {
                    ondismiss: () => {
                        setLoading(false);
                        setLoadingPlan(null);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to initiate payment');
            setLoading(false);
            setLoadingPlan(null);
        }
    };

    return (
        <>
            <SoftBackdrop />
            <div className='min-h-screen pt-24 pb-20 px-4 md:px-16 lg:px-24 xl:px-32'>

                {/* Header */}
                <div className='text-center mb-12'>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 70 }}>
                        <span className='text-xs font-bold text-orange-400 uppercase tracking-widest'>Pricing</span>
                        <h1 className='text-3xl md:text-4xl font-black text-white mt-2'>Simple, Transparent Pricing</h1>
                        <p className='text-slate-400 mt-2 text-sm md:text-base'>Choose the plan that fits your creation schedule. Cancel anytime.</p>

                        {/* Credits balance */}
                        {isLoggedIn && (
                            <div className='inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20'>
                                <svg className='w-4 h-4 text-orange-400' fill='currentColor' viewBox='0 0 20 20'><path d='M10 2a8 8 0 100 16A8 8 0 0010 2zm0 14a6 6 0 110-12 6 6 0 010 12zm1-7H9V7h2v2zm0 4H9v-2h2v2z'/></svg>
                                <span className='text-sm text-slate-300'>Your balance: <span className='text-orange-400 font-bold'>{credits} credits</span></span>
                            </div>
                        )}

                        <p className='text-slate-600 text-xs mt-3'>
                            {detectingLocation ? '⏳ Detecting location...' : `${currency.flag} Prices shown in ${currency.name}`}
                        </p>
                    </motion.div>
                </div>

                {/* Plans */}
                <div className='flex flex-col md:flex-row items-stretch justify-center gap-6 max-w-5xl mx-auto'>
                    {plans.map((plan, index) => (
                        <motion.div key={plan.id}
                            className={`relative flex-1 rounded-2xl border overflow-hidden ${plan.popular
                                ? 'border-orange-500/60 shadow-2xl shadow-orange-500/15'
                                : 'border-orange-900/30'
                            }`}
                            style={plan.popular
                                ? { background: 'linear-gradient(135deg, #1a0800, #0d0500)' }
                                : { background: '#1a0f00' }}
                            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, type: 'spring', stiffness: 260, damping: 70 }}>

                            {/* Popular badge */}
                            {plan.popular && (
                                <div className='bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-1.5 text-center'>
                                    <span className='text-xs font-bold text-white uppercase tracking-widest'>⭐ Most Popular</span>
                                </div>
                            )}

                            <div className='p-6'>
                                {/* Plan name + price */}
                                <div className='mb-6'>
                                    <p className='text-slate-400 text-sm font-semibold uppercase tracking-wider'>{plan.name}</p>
                                    <div className='flex items-baseline gap-1 mt-1'>
                                        <span className='text-4xl font-black text-white'>
                                            {detectingLocation ? '...' : formatPrice(plan.priceUSD, plan.priceINR)}
                                        </span>
                                        <span className='text-slate-500 text-sm'>/{plan.period}</span>
                                    </div>
                                    <div className='flex items-center gap-1.5 mt-2'>
                                        <svg className='w-4 h-4 text-orange-400' fill='currentColor' viewBox='0 0 20 20'><path d='M10 2a8 8 0 100 16A8 8 0 0010 2zm0 14a6 6 0 110-12 6 6 0 010 12zm1-7H9V7h2v2zm0 4H9v-2h2v2z'/></svg>
                                        <span className='text-orange-400 font-bold text-sm'>{plan.credits.toLocaleString()} credits</span>
                                    </div>
                                </div>

                                {/* Features */}
                                <ul className='space-y-3 mb-8'>
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className='flex items-center gap-2.5 text-sm text-slate-300'>
                                            <CheckIcon className='size-4 text-orange-500 shrink-0' />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA Button */}
                                <button
                                    onClick={() => handleBuy(plan)}
                                    disabled={loading}
                                    className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed ${
                                        plan.popular
                                            ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/25'
                                            : 'bg-orange-950/60 hover:bg-orange-900/60 text-orange-300 border border-orange-800/50'
                                    }`}>
                                    {loadingPlan === plan.id ? (
                                        <span className='flex items-center justify-center gap-2'>
                                            <svg className='animate-spin w-4 h-4' fill='none' viewBox='0 0 24 24'><circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'/><path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z'/></svg>
                                            Processing...
                                        </span>
                                    ) : 'Get Started'}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Test mode notice */}
                <div className='text-center mt-8'>
                    <p className='text-slate-600 text-xs'>
                        🔒 Secured by Razorpay · Test mode active · Use card <span className='font-mono'>4111 1111 1111 1111</span> for testing
                    </p>
                </div>

                {/* FAQ */}
                <div className='max-w-2xl mx-auto mt-16'>
                    <h2 className='text-xl font-bold text-white text-center mb-6'>Frequently Asked Questions</h2>
                    {[
                        { q: 'Do credits expire?', a: 'No, your credits never expire. Use them whenever you want.' },
                        { q: 'What is a credit?', a: 'Standard generation costs 5 credits, Premium (8K) costs 10 credits.' },
                        { q: 'Can I get a refund?', a: 'We offer a 7-day refund policy if you have used less than 10% of your credits.' },
                        { q: 'Is this a subscription?', a: 'No, this is a one-time credit purchase. You are never charged automatically.' },
                    ].map((faq, i) => (
                        <motion.div key={i}
                            className='border-b border-orange-900/20 py-4'
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 + i * 0.1 }}>
                            <p className='text-white font-semibold text-sm'>{faq.q}</p>
                            <p className='text-slate-400 text-sm mt-1'>{faq.a}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </>
    );
}
