import { Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './globals.css';
import LenisScroll from './components/LenisScroll';
import Generate from './pages/Generate';
import Recreate from './pages/Recreate';
import MyGeneration from './pages/MyGeneration';
import YtPreview from './pages/YtPreview';
import Login from './components/Login';
import PageLoader from './components/PageLoader';
import BackToTop from './components/BackToTop';
import PricingPage from './pages/Pricing';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';

export default function App() {
    const { pathname } = useLocation();
    const [loaderKey, setLoaderKey] = useState(0);
    const [showLoader, setShowLoader] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        // Reset loader on every route change by changing the key
        setShowLoader(false);
        setTimeout(() => {
            setLoaderKey(prev => prev + 1);
            setShowLoader(true);
        }, 10);
    }, [pathname]);

    return (
        <>
            {showLoader && <PageLoader key={loaderKey} />}
            <Toaster />
            <LenisScroll />
            <Navbar />
            <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/generate' element={<Generate />} />
                <Route path='/generate/:id' element={<Generate />} />
                <Route path='/recreate' element={<Recreate />} />
                <Route path='/my-generation' element={<MyGeneration />} />
                <Route path='/preview' element={<YtPreview />} />
                <Route path='/login' element={<Login />} />
                <Route path='/pricing' element={<PricingPage />} />
            </Routes>
            <Footer />
            <BackToTop />
        </>
    );
}
