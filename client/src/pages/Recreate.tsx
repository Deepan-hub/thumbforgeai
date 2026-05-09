import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type AspectRatio } from '../assets/assets';
import SoftBackdrop from '../components/SoftBackdrop';
import AspectRatioSelector from '../components/AspectRatioSelector';
import PreviewPanel from '../components/PreviewPanel';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../configs/api';
import { UploadIcon, LinkIcon, XIcon } from 'lucide-react';


const Recreate = () => {
    const navigate = useNavigate();
    const { isLoggedIn, credits, setCredits } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [tab, setTab] = useState<'upload' | 'url'>('upload');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState('');
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
    const [loading, setLoading] = useState(false);
    const [thumbnail, setThumbnail] = useState<any>(null);
    const [model, setModel] = useState<'standard' | 'premium'>('standard');
    const [showQuickEdit, setShowQuickEdit] = useState(false);

    const CREDIT_COST = model === 'premium' ? 10 : 5;

    useEffect(() => { if (!isLoggedIn) navigate('/'); }, [isLoggedIn]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (!file || !file.type.startsWith('image/')) return toast.error('Please drop an image file');
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const [urlPreviewError, setUrlPreviewError] = useState(false);

    const handleRecreate = async () => {
        if (!isLoggedIn) return toast.error('Please login to recreate thumbnails');
        if (!prompt.trim()) return toast.error('Please describe what you want to change');
        if (tab === 'upload' && !imageFile) return toast.error('Please upload an image');
        if (tab === 'url' && !imageUrl.trim()) return toast.error('Please enter an image URL');
        if (credits < CREDIT_COST) return toast.error(`Insufficient credits! You need ${CREDIT_COST} credits. Please purchase more.`);

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('prompt', prompt);
            formData.append('aspect_ratio', aspectRatio);
            formData.append('model', model);
            if (tab === 'upload' && imageFile) {
                formData.append('image', imageFile);
            } else if (tab === 'url' && imageUrl.trim()) {
                formData.append('image_url', imageUrl.trim());
            }
            const { data } = await api.post('/api/thumbnail/recreate', formData, {
                headers: { 'Content-Type': undefined },
            });
            if (data.thumbnail) {
                setThumbnail(data.thumbnail);
                toast.success(data.message);
                if (data.credits !== undefined) setCredits(data.credits);
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <SoftBackdrop />

            {/* ==================== MOBILE LAYOUT ==================== */}
            <div className='lg:hidden pt-20 pb-32 px-4 min-h-screen'>

                {/* Header */}
                <div className='mb-4'>
                    <h1 className='text-2xl font-bold text-white'>Recreate Thumbnail</h1>
                    <p className='text-slate-400 text-xs mt-1'>Upload an image and describe your changes</p>
                </div>

                {/* Credits bar */}
                <div className='flex items-center justify-between px-3 py-2 rounded-xl bg-[#1a0f00] border border-orange-900/40 mb-4'>
                    <span className='text-xs text-slate-300'>Credits: <span className={`font-bold ${credits < CREDIT_COST ? 'text-red-400' : 'text-orange-400'}`}>{credits}</span></span>
                    <a href='/pricing' className='text-[11px] px-3 py-1 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium'>Buy Credits</a>
                </div>

                {/* Preview — shows first on mobile */}
                <div className='rounded-2xl bg-[#1a0f00] border border-orange-900/40 p-3 mb-4'>
                    <p className='text-sm font-semibold text-white mb-3'>Preview</p>
                    <PreviewPanel thumbnail={thumbnail} isLoading={loading} aspectRatio={aspectRatio} />
                </div>

                {/* Upload Tabs */}
                <div className='flex rounded-xl overflow-hidden border border-orange-900/40 mb-4'>
                    <button onClick={() => setTab('upload')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition ${tab === 'upload' ? 'bg-orange-500 text-white' : 'bg-[#1a0f00] text-slate-400'}`}>
                        <UploadIcon className='w-3.5 h-3.5' /> Upload
                    </button>
                    <button onClick={() => setTab('url')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition ${tab === 'url' ? 'bg-orange-500 text-white' : 'bg-[#1a0f00] text-slate-400'}`}>
                        <LinkIcon className='w-3.5 h-3.5' /> URL
                    </button>
                </div>

                {/* Upload / URL area */}
                {tab === 'upload' && (
                    <div className='mb-4' style={{ isolation: 'isolate', position: 'relative', zIndex: 1 }}>
                        {imagePreview ? (
                            <div className='relative rounded-xl overflow-hidden border border-orange-900/40'>
                                <img src={imagePreview} alt='Preview' className='w-full object-cover' style={{ maxHeight: '160px', display: 'block' }} />
                                <button onClick={handleRemoveImage} className='absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white'>
                                    <XIcon className='w-4 h-4' />
                                </button>
                            </div>
                        ) : (
                            <div onClick={() => fileInputRef.current?.click()} onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}
                                className='flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed border-orange-900/40 bg-[#1a0f00] cursor-pointer'>
                                <UploadIcon className='w-7 h-7 text-orange-400' />
                                <p className='text-sm text-slate-400 text-center'>Tap to upload image</p>
                                <input ref={fileInputRef} type='file' accept='image/*' className='hidden' onChange={handleFileChange} />
                            </div>
                        )}
                    </div>
                )}
                {tab === 'url' && (
                    <div className='mb-4 space-y-2'>
                        <input type='url' value={imageUrl} onChange={(e) => { setImageUrl(e.target.value); setUrlPreviewError(false); }}
                            placeholder='https://example.com/thumbnail.jpg'
                            className='w-full px-4 py-3 rounded-xl border border-orange-900/40 bg-[#1a0f00] text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/60 transition text-sm' />
                        {imageUrl.trim() && (
                            <div className='rounded-xl overflow-hidden border border-orange-900/40 bg-[#0d0800]'>
                                {urlPreviewError ? (
                                    <div className='flex items-center gap-2 p-3'>
                                        <svg className='w-4 h-4 text-red-400 shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'><circle cx='12' cy='12' r='10'/><path d='M12 8v4M12 16h.01'/></svg>
                                        <p className='text-xs text-red-400'>Could not load image — check the URL</p>
                                    </div>
                                ) : (
                                    <img src={imageUrl} alt='URL preview' onError={() => setUrlPreviewError(true)}
                                        className='w-full object-cover max-h-40' />
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Aspect Ratio */}
                <div className='mb-4'>
                    <AspectRatioSelector value={aspectRatio} onChange={setAspectRatio} />
                </div>

                {/* Quick Edit — 6 essential tools, horizontal scroll */}
                <div className='mb-4'>
                    <label className='block text-xs font-semibold text-slate-400 mb-2 ml-1 uppercase tracking-wider'>Quick Edit</label>
                    <div className='flex gap-2 overflow-x-auto pb-1' style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
                        {[
                            { label: 'Brighter', prompt: 'make it brighter', icon: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2"/></svg> },
                            { label: 'Contrast', prompt: 'increase contrast', icon: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 2v20"/></svg> },
                            { label: 'Sharpen', prompt: 'sharpen the image', icon: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
                            { label: 'Remove BG', prompt: 'remove background', icon: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" strokeDasharray="4 2"/><path d="M9 9l6 6M15 9l-6 6"/></svg> },
                            { label: 'Cartoon', prompt: 'cartoonify the image', icon: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg> },
                            { label: 'Grayscale', prompt: 'make it grayscale black and white', icon: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18"/></svg> },
                        ].map(({ label, prompt: p, icon }) => (
                            <button key={label} type='button'
                                onClick={() => setPrompt(prompt === p ? '' : p)}
                                className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all active:scale-95 ${
                                    prompt === p
                                        ? 'border-orange-500 bg-orange-950/70 text-orange-400'
                                        : 'border-orange-900/40 bg-[#1a0f00] text-slate-400'
                                }`}>
                                <span className='shrink-0'>{icon}</span>
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Describe change */}
                <div className='mb-4'>
                    <label className='block text-sm font-medium text-slate-200 mb-2'>Or describe your change</label>
                    <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={3}
                        placeholder='e.g., Change orange to blue, make it brighter, cartoonify...'
                        className='w-full px-4 py-3 rounded-xl border border-orange-900/40 bg-[#1a0f00] text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/60 resize-none transition text-sm' />
                </div>

                {/* Model */}
                <div className='mb-4'>
                    <label className='block text-sm font-medium text-slate-200 mb-2'>Model</label>
                    <div className='grid grid-cols-2 gap-2'>
                        <button type='button' onClick={() => setModel('standard')}
                            className={`p-3 rounded-xl border text-left transition-all ${model === 'standard' ? 'border-orange-500 bg-orange-950/50' : 'border-orange-900/40 bg-[#1a0f00]'}`}>
                            <p className='text-xs font-bold text-white'>Standard</p>
                            <p className='text-[10px] text-slate-500 mt-0.5'>5 credits · Fast</p>
                        </button>
                        <button type='button' onClick={() => setModel('premium')}
                            className={`p-3 rounded-xl border text-left transition-all ${model === 'premium' ? 'border-amber-500 bg-amber-950/40' : 'border-orange-900/40 bg-[#1a0f00]'}`}>
                            <p className='text-xs font-bold text-white'>Premium</p>
                            <p className='text-[10px] text-slate-500 mt-0.5'>10 credits · 8K quality</p>
                        </button>
                    </div>
                    <p className='text-xs text-slate-500 mt-2'>Cost: <span className='text-orange-400 font-semibold'>{CREDIT_COST} credits</span></p>
                </div>

                {/* Generate button */}
                <button onClick={handleRecreate} disabled={loading || credits < CREDIT_COST}
                    className='w-full py-4 rounded-2xl font-bold text-white text-sm bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg shadow-orange-500/25 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed transition-all'>
                    {loading ? 'Recreating...' : 'Recreate Thumbnail'}
                </button>
            </div>

            {/* ==================== DESKTOP LAYOUT ==================== */}
            <div className='hidden lg:block pt-24 min-h-screen'>
                <main className='max-w-6xl mx-auto px-8 py-8 pb-8'>
                    <div className='mb-8'>
                        <h1 className='text-3xl font-bold text-white'>Recreate Thumbnail</h1>
                        <p className='text-slate-400 mt-1'>Upload an image or paste a URL and describe your changes</p>
                    </div>
                    <div className='grid lg:grid-cols-[420px_1fr] gap-8'>
                        {/* LEFT PANEL */}
                        <div className='space-y-5'>
                            <div className='p-6 rounded-2xl bg-[#1a0f00]/80 border border-orange-900/40 shadow-xl space-y-5'>
                                {/* Credits */}
                                <div className='flex items-center justify-between px-4 py-3 rounded-xl bg-[#0d0800] border border-orange-900/40'>
                                    <span className='text-sm text-slate-300'>Credits: <span className={`font-bold ${credits < CREDIT_COST ? 'text-red-400' : 'text-orange-400'}`}>{credits}</span></span>
                                    <a href='/pricing' className='text-xs px-3 py-1 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium'>Buy Credits</a>
                                </div>

                                {/* Tabs */}
                                <div className='flex rounded-xl overflow-hidden border border-orange-900/40'>
                                    <button onClick={() => setTab('upload')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition ${tab === 'upload' ? 'bg-orange-500 text-white' : 'bg-[#0d0800] text-slate-400 hover:text-white'}`}>
                                        <UploadIcon className='w-4 h-4' /> Upload
                                    </button>
                                    <button onClick={() => setTab('url')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition ${tab === 'url' ? 'bg-orange-500 text-white' : 'bg-[#0d0800] text-slate-400 hover:text-white'}`}>
                                        <LinkIcon className='w-4 h-4' /> Image URL
                                    </button>
                                </div>

                                {/* Upload area */}
                                {tab === 'upload' && (
                                    <div>
                                        {imagePreview ? (
                                            <div className='relative rounded-xl overflow-hidden border border-orange-900/40'>
                                                <img src={imagePreview} alt='Preview' className='w-full object-cover max-h-48' />
                                                <button onClick={handleRemoveImage} className='absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-black transition'>
                                                    <XIcon className='w-4 h-4' />
                                                </button>
                                            </div>
                                        ) : (
                                            <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} onClick={() => fileInputRef.current?.click()}
                                                className='flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed border-orange-900/40 bg-[#0d0800] cursor-pointer hover:border-orange-500/60 hover:bg-orange-950/20 transition'>
                                                <UploadIcon className='w-8 h-8 text-orange-400' />
                                                <p className='text-sm text-slate-400 text-center'>Click to upload image<br /><span className='text-xs text-slate-600'>or drag and drop</span></p>
                                                <input ref={fileInputRef} type='file' accept='image/*' className='hidden' onChange={handleFileChange} />
                                            </div>
                                        )}
                                    </div>
                                )}
                                {tab === 'url' && (
                                    <div className='space-y-2'>
                                        <input type='url' value={imageUrl} onChange={(e) => { setImageUrl(e.target.value); setUrlPreviewError(false); }}
                                            placeholder='https://example.com/thumbnail.jpg'
                                            className='w-full px-4 py-3 rounded-xl border border-orange-900/40 bg-[#0d0800] text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/60 transition' />
                                        {imageUrl.trim() && (
                                            <div className='rounded-xl overflow-hidden border border-orange-900/40 bg-[#0d0800]'>
                                                {urlPreviewError ? (
                                                    <div className='flex items-center gap-2 p-3'>
                                                        <svg className='w-4 h-4 text-red-400 shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'><circle cx='12' cy='12' r='10'/><path d='M12 8v4M12 16h.01'/></svg>
                                                        <p className='text-xs text-red-400'>Could not load image — check the URL</p>
                                                    </div>
                                                ) : (
                                                    <img src={imageUrl} alt='URL preview' onError={() => setUrlPreviewError(true)}
                                                        className='w-full object-cover max-h-48' />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Quick Edit — 6 essential tools */}
                                <div className='space-y-2'>
                                    <label className='block text-sm font-medium text-slate-200'>Quick Edit</label>
                                    <div className='flex gap-2 flex-wrap'>
                                        {[
                                            { label: 'Brighter', prompt: 'make it brighter', icon: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2"/></svg> },
                                            { label: 'Contrast', prompt: 'increase contrast', icon: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 2v20"/></svg> },
                                            { label: 'Sharpen', prompt: 'sharpen the image', icon: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
                                            { label: 'Remove BG', prompt: 'remove background', icon: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" strokeDasharray="4 2"/><path d="M9 9l6 6M15 9l-6 6"/></svg> },
                                            { label: 'Cartoon', prompt: 'cartoonify the image', icon: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg> },
                                            { label: 'Grayscale', prompt: 'make it grayscale black and white', icon: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18"/></svg> },
                                        ].map(({ label, prompt: p, icon }) => (
                                            <button key={label} type='button'
                                                onClick={() => setPrompt(prompt === p ? '' : p)}
                                                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all active:scale-95 hover:border-orange-500/60 ${
                                                    prompt === p
                                                        ? 'border-orange-500 bg-orange-950/70 text-orange-400'
                                                        : 'border-orange-900/40 bg-[#0d0800] text-slate-400'
                                                }`}>
                                                <span className='shrink-0'>{icon}</span>
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Describe change */}
                                <div className='space-y-2'>
                                    <label className='block text-sm font-medium text-slate-200'>Or describe your change</label>
                                    <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={3}
                                        placeholder='e.g., Change orange to blue, make it brighter, cartoonify, change background to black...'
                                        className='w-full px-4 py-3 rounded-xl border border-orange-900/40 bg-[#0d0800] text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/60 resize-none transition' />
                                </div>

                                {/* Aspect Ratio */}
                                <AspectRatioSelector value={aspectRatio} onChange={setAspectRatio} />

                                {/* Model */}
                                <div className='space-y-2'>
                                    <label className='block text-sm font-medium text-slate-200'>Model</label>
                                    <div className='relative'>
                                        <select value={model} onChange={(e) => setModel(e.target.value as 'standard' | 'premium')}
                                            className='w-full px-4 py-3 rounded-xl border border-orange-900/40 bg-[#0d0800] text-white appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500/60 transition cursor-pointer'>
                                            <option value='standard'>Standard (5 credits)</option>
                                            <option value='premium'>Premium (10 credits)</option>
                                        </select>
                                        <div className='pointer-events-none absolute inset-y-0 right-3 flex items-center'>
                                            <svg className='w-4 h-4 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' /></svg>
                                        </div>
                                    </div>
                                    <p className='text-xs text-slate-500'>Cost: <span className='text-orange-400 font-semibold'>{CREDIT_COST} credits</span>. Balance: <span className={`font-semibold ${credits < CREDIT_COST ? 'text-red-400' : 'text-orange-400'}`}>{credits}</span></p>
                                </div>

                                {/* Generate */}
                                <button onClick={handleRecreate} disabled={loading || credits < CREDIT_COST}
                                    className='text-[15px] w-full py-3.5 rounded-xl font-semibold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/25 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 transition-all'>
                                    {loading ? 'Recreating...' : 'Recreate Thumbnail'}
                                </button>
                            </div>
                        </div>

                        {/* RIGHT PANEL */}
                        <div>
                            <div className='p-6 rounded-2xl bg-[#1a0f00]/80 border border-orange-900/40 shadow-xl'>
                                <h2 className='text-lg font-semibold text-white mb-4'>Preview</h2>
                                <PreviewPanel thumbnail={thumbnail} isLoading={loading} aspectRatio={aspectRatio} />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default Recreate;
