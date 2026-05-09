import type { IPricing } from "../types";

export const pricingData: IPricing[] = [
    {
        name: "Basic",
        price: 29,
        priceINR: 2499,
        period: "month",
        features: [
            "1000 Credits",
            "Standard Quality (5 credits each)",
            "Basic Templates",
            "Standard Resolution",
            "No Watermark",
            "Email Support"
        ],
        mostPopular: false
    },
    {
        name: "Pro",
        price: 79,
        priceINR: 6599,
        period: "month",
        features: [
            "5000 Credits",
            "Premium Quality (10 credits each)",
            "All Templates",
            "4K Resolution",
            "A/B Testing Tools",
            "Priority Support",
            "Custom Fonts",
            "Brand Kit Analysis"
        ],
        mostPopular: true
    },
    {
        name: "Enterprise",
        price: 199,
        priceINR: 16599,
        period: "month",
        features: [
            "10000 Credits",
            "Standard + Premium Quality",
            "Everything in Pro",
            "API Access",
            "Team Collaboration",
            "Custom Branding",
            "Dedicated Account Manager"
        ],
        mostPopular: false
    }
];
