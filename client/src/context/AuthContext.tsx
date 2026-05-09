import { createContext, useContext, useEffect, useState } from 'react';
import type { IUser } from '../assets/assets';
import api from '../configs/api';
import toast from 'react-hot-toast';

interface AuthContextProps {
    isLoggedIn: boolean;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
    user: IUser | null;
    setUser: (user: IUser | null) => void;
    credits: number;
    setCredits: (credits: number) => void;
    authLoading: boolean;
    login: (user: { email: string; password: string }) => Promise<void>;
    signUp: (user: { name: string; email: string; password: string }) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
    isLoggedIn: false,
    setIsLoggedIn: () => {},
    user: null,
    setUser: () => {},
    credits: 0,
    setCredits: () => {},
    authLoading: true,
    login: async () => {},
    signUp: async () => {},
    logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [credits, setCredits] = useState<number>(0);
    const [authLoading, setAuthLoading] = useState<boolean>(true);

    const signUp = async ({ name, email, password }: { name: string; email: string; password: string }) => {
        try {
            const { data } = await api.post('/api/auth/register', { name, email, password });
            if (data.user) {
                setUser(data.user as IUser);
                setIsLoggedIn(true);
                setCredits(data.user.credits ?? 20);
            }
            toast.success(data.message);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error.message);
        }
    };

    const login = async ({ email, password }: { email: string; password: string }) => {
        try {
            const { data } = await api.post('/api/auth/login', { email, password });
            if (data.user) {
                setUser(data.user as IUser);
                setIsLoggedIn(true);
                setCredits(data.user.credits ?? 0);
            }
            toast.success(data.message);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error.message);
        }
    };

    const logout = async () => {
        try {
            const { data } = await api.post('/api/auth/logout');
            setUser(null);
            setIsLoggedIn(false);
            setCredits(0);
            toast.success(data.message);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error.message);
        }
    };

    const fetchUser = async () => {
        try {
            const { data } = await api.get('/api/auth/verify');
            if (data.user) {
                setUser(data.user as IUser);
                setIsLoggedIn(true);
                setCredits(data.user.credits ?? 0);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setAuthLoading(false);
        }
    };

    useEffect(() => {
        (async () => { await fetchUser(); })();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, isLoggedIn, setIsLoggedIn, credits, setCredits, authLoading, login, signUp, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
