'use client'
import SectionTitle from "../components/SectionTitle"
import { pricingData } from "../data/pricing";
import type { IPricing } from "../types";
import { CheckIcon } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Exchange rates relative to USD (hardcoded for reliability)
const exchangeRates: Record<string, { symbol: string; rate: number; name: string; flag: string }> = {
    IN: { symbol: '₹', rate: 83.5,  name: 'INR', flag: '🇮🇳' },
    US: { symbol: '$', rate: 1,     name: 'USD', flag: '🇺🇸' },
    GB: { symbol: '£', rate: 0.79,  name: 'GBP', flag: '🇬🇧' },
    DE: { symbol: '€', rate: 0.92,  name: 'EUR', flag: '🇩🇪' },
    FR: { symbol: '€', rate: 0.92,  name: 'EUR', flag: '🇫🇷' },
    IT: { symbol: '€', rate: 0.92,  name: 'EUR', flag: '🇮🇹' },
    ES: { symbol: '€', rate: 0.92,  name: 'EUR', flag: '🇪🇸' },
    AU: { symbol: 'A$', rate: 1.53, name: 'AUD', flag: '🇦🇺' },
    CA: { symbol: 'C$', rate: 1.36, name: 'CAD', flag: '🇨🇦' },
    JP: { symbol: '¥', rate: 149.5, name: 'JPY', flag: '🇯🇵' },
    CN: { symbol: '¥', rate: 7.24,  name: 'CNY', flag: '🇨🇳' },
    AE: { symbol: 'AED', rate: 3.67,name: 'AED', flag: '🇦🇪' },
    SA: { symbol: 'SAR', rate: 3.75,name: 'SAR', flag: '🇸🇦' },
    SG: { symbol: 'S$', rate: 1.34, name: 'SGD', flag: '🇸🇬' },
    BR: { symbol: 'R$', rate: 4.97, name: 'BRL', flag: '🇧🇷' },
    MX: { symbol: 'MX$', rate: 17.1,name: 'MXN', flag: '🇲🇽' },
    KR: { symbol: '₩', rate: 1325,  name: 'KRW', flag: '🇰🇷' },
    PK: { symbol: '₨', rate: 278,   name: 'PKR', flag: '🇵🇰' },
    BD: { symbol: '৳', rate: 110,   name: 'BDT', flag: '🇧🇩' },
    NG: { symbol: '₦', rate: 1550,  name: 'NGN', flag: '🇳🇬' },
    ZA: { symbol: 'R',  rate: 18.6, name: 'ZAR', flag: '🇿🇦' },
    NZ: { symbol: 'NZ$',rate: 1.63, name: 'NZD', flag: '🇳🇿' },
    CH: { symbol: 'Fr', rate: 0.90, name: 'CHF', flag: '🇨🇭' },
    SE: { symbol: 'kr', rate: 10.4, name: 'SEK', flag: '🇸🇪' },
    NO: { symbol: 'kr', rate: 10.6, name: 'NOK', flag: '🇳🇴' },
    DK: { symbol: 'kr', rate: 6.88, name: 'DKK', flag: '🇩🇰' },
    PH: { symbol: '₱', rate: 56.5,  name: 'PHP', flag: '🇵🇭' },
    MY: { symbol: 'RM', rate: 4.72, name: 'MYR', flag: '🇲🇾' },
    TH: { symbol: '฿', rate: 35.1,  name: 'THB', flag: '🇹🇭' },
    ID: { symbol: 'Rp', rate: 15600,name: 'IDR', flag: '🇮🇩' },
    TR: { symbol: '₺', rate: 32.5,  name: 'TRY', flag: '🇹🇷' },
    RU: { symbol: '₽', rate: 91.5,  name: 'RUB', flag: '🇷🇺' },
    NL: { symbol: '€', rate: 0.92,  name: 'EUR', flag: '🇳🇱' },
    BE: { symbol: '€', rate: 0.92,  name: 'EUR', flag: '🇧🇪' },
    AT: { symbol: '€', rate: 0.92,  name: 'EUR', flag: '🇦🇹' },
    PL: { symbol: 'zł', rate: 4.02, name: 'PLN', flag: '🇵🇱' },
    HK: { symbol: 'HK$',rate: 7.82, name: 'HKD', flag: '🇭🇰' },
};

export default function PricingSection() {
    const navigate = useNavigate();
    const [currency, setCurrency] = useState(exchangeRates['US']);
    const [countryCode, setCountryCode] = useState('US');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const detectCurrency = async () => {
            try {
                const res = await fetch('https://ipapi.co/json/');
                const data = await res.json();
                const code = data.country_code;
                setCountryCode(code);
                if (exchangeRates[code]) {
                    setCurrency(exchangeRates[code]);
                } else {
                    // Fallback to USD for unknown countries
                    setCurrency(exchangeRates['US']);
                }
            } catch {
                // Fallback: use timezone to guess
                const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
                if (tz.includes('Kolkata') || tz.includes('Calcutta')) setCurrency(exchangeRates['IN']);
                else if (tz.includes('London')) setCurrency(exchangeRates['GB']);
                else if (tz.includes('Berlin') || tz.includes('Paris') || tz.includes('Rome')) setCurrency(exchangeRates['DE']);
                else if (tz.includes('Tokyo')) setCurrency(exchangeRates['JP']);
                else if (tz.includes('Sydney')) setCurrency(exchangeRates['AU']);
                else if (tz.includes('Dubai')) setCurrency(exchangeRates['AE']);
                else if (tz.includes('Singapore')) setCurrency(exchangeRates['SG']);
            } finally {
                setLoading(false);
            }
        };

        detectCurrency();
    }, []);

    const formatPrice = (usdPrice: number) => {
        const converted = Math.round(usdPrice * currency.rate);
        // Format large numbers nicely
        if (converted >= 1000) {
            return `${currency.symbol}${converted.toLocaleString()}`;
        }
        return `${currency.symbol}${converted}`;
    };

    return (
        <div id="pricing" className="px-4 md:px-16 lg:px-24 xl:px-32">
            <SectionTitle text1="Pricing" text2="Simple Pricing" text3="Choose the plan that fits your creation schedule. Cancel anytime." />

            <p className="text-center text-slate-500 text-xs mt-3">
                {loading ? '⏳ Detecting your location...' : `${currency.flag} Prices shown in ${currency.name}`}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-8 mt-12">
                {pricingData.map((plan: IPricing, index: number) => (
                    <motion.div key={index}
                        className={`w-72 text-center p-6 pb-16 rounded-2xl border transition-all ${plan.mostPopular ? 'bg-gradient-to-b from-orange-950 to-[#1a0f00] border-orange-500/60 relative shadow-xl shadow-orange-500/10' : 'bg-[#1a0f00] border-orange-900/30 hover:border-orange-700/50'}`}
                        initial={{ y: 150, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
                        transition={{ delay: index * 0.15, type: "spring", stiffness: 320, damping: 70, mass: 1 }}>
                        {plan.mostPopular && (
                            <p className="absolute px-3 text-sm -top-3.5 left-3.5 py-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full font-semibold">Most Popular</p>
                        )}
                        <p className="font-semibold text-slate-200">{plan.name}</p>
                        <h1 className="text-3xl font-bold mt-1 text-white">
                            {loading ? '...' : formatPrice(plan.price)}
                            <span className="text-slate-500 font-normal text-sm">/{plan.period}</span>
                        </h1>
                        <ul className="list-none text-slate-300 mt-6 space-y-2 text-left">
                            {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-center gap-2">
                                    <CheckIcon className="size-4.5 text-orange-500 shrink-0" />
                                    <p>{feature}</p>
                                </li>
                            ))}
                        </ul>
                        <button type="button" onClick={() => navigate('/pricing')}
                            className={`w-full py-2.5 rounded-xl font-semibold mt-7 transition-all active:scale-95 ${plan.mostPopular ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/25' : 'bg-orange-950/60 hover:bg-orange-900/60 text-orange-300 border border-orange-800/50'}`}>
                            Get Started
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
