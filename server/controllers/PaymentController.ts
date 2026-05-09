import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import User from '../models/User.js';

// Lazily initialize Razorpay so .env is loaded first
const getRazorpay = () => {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        throw new Error('Razorpay keys missing. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to server/.env');
    }
    return new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
};

// Credit packages
export const creditPackages = [
    { id: 'basic', name: 'Basic', credits: 1000, priceINR: 2499, priceUSD: 29 },
    { id: 'pro', name: 'Pro', credits: 5000, priceINR: 6599, priceUSD: 79, popular: true },
    { id: 'enterprise', name: 'Enterprise', credits: 10000, priceINR: 16599, priceUSD: 199 },
];

// Create Razorpay order
export const createOrder = async (req: Request, res: Response) => {
    try {
        const { packageId } = req.body;
        const { userId } = req.session;

        const pkg = creditPackages.find(p => p.id === packageId);
        if (!pkg) return res.status(400).json({ message: 'Invalid package' });

        const user = await User.findById(userId);
        if (!user) return res.status(401).json({ message: 'User not found' });

        const razorpay = getRazorpay();
        const order = await razorpay.orders.create({
            amount: pkg.priceINR * 100, // paise
            currency: 'INR',
            receipt: `rcpt_${(userId as string).slice(-8)}_${Date.now().toString().slice(-8)}`,
            notes: {
                userId: userId as string,
                packageId,
                credits: pkg.credits.toString(),
            },
        });

        res.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
            package: pkg,
            user: { name: user.name, email: user.email },
        });
    } catch (error: any) {
        console.log('Create order error:', error?.message || error);
        res.status(500).json({ message: error?.message || 'Failed to create order' });
    }
};

// Verify payment and add credits
export const verifyPayment = async (req: Request, res: Response) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, packageId } = req.body;
        const { userId } = req.session;

        // Verify signature
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET as string)
            .update(body)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ message: 'Payment verification failed' });
        }

        const pkg = creditPackages.find(p => p.id === packageId);
        if (!pkg) return res.status(400).json({ message: 'Invalid package' });

        // Add credits to user
        const user = await User.findById(userId);
        if (!user) return res.status(401).json({ message: 'User not found' });

        user.credits += pkg.credits;
        await user.save();

        res.json({
            message: `${pkg.credits} credits added to your account!`,
            credits: user.credits,
        });
    } catch (error: any) {
        console.log('Verify payment error:', error);
        res.status(500).json({ message: error.message });
    }
};
