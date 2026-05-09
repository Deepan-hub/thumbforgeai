import { setServers } from 'dns';

// Force Google DNS for SRV lookups (fixes ECONNREFUSED on MongoDB Atlas)
setServers(['8.8.8.8', '8.8.4.4']);

import express, { Request, Response } from 'express';
import cors from 'cors'
import 'dotenv/config'

// Fix for Node.js v18+ OpenSSL TLS compatibility with MongoDB Atlas (dev only)
// Remove this once you configure a proper CA cert or upgrade your MongoDB driver
if (process.env.NODE_ENV === 'development') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}
import connectDB from './configs/db.js';
import session from 'express-session'
import MongoStore from 'connect-mongo'
import AuthRouter from './routes/AuthRoutes.js';
import ThumbnailRouter from './routes/ThumbnailRoutes.js';
import UserRouter from './routes/UserRoutes.js';
import PaymentRouter from './routes/PaymentRoutes.js';

declare module 'express-session' {
    interface SessionData {
        isLoggedIn: boolean;
        userId: string
    }
}

await connectDB()

const app = express();

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, Postman, etc)
        if (!origin) return callback(null, true);
        // Allow localhost on any port
        if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
            return callback(null, true);
        }
        // Allow any local network IP (192.168.x.x / 10.x.x.x / 172.x.x.x)
        if (origin.match(/^http:\/\/(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/)) {
            return callback(null, true);
        }
        // Allow production domain if set in .env
        if (process.env.CLIENT_URL && origin === process.env.CLIENT_URL) {
            return callback(null, true);
        }
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}))

app.set('trust proxy', 1)

app.use(session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/'
    }, 
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI as string,
        collectionName: 'sessions'
    })
}))

app.use(express.json())

app.get('/', (req: Request, res: Response) => {
    res.send('Server is Live!');
});
app.use('/api/auth', AuthRouter)
app.use('/api/thumbnail', ThumbnailRouter)
app.use('/api/user', UserRouter)
app.use('/api/payment', PaymentRouter)

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
