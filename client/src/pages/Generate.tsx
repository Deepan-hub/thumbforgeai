import { useEffect, useState } from 'react';
import type React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { colorSchemes, type AspectRatio, type IThumbnail, type ThumbnailStyle } from '../assets/assets';
import SoftBackdrop from '../components/SoftBackdrop';
import AspectRatioSelector from '../components/AspectRatioSelector';
import StyleSelector from '../components/StyleSelector';
import ColorSchemeSelector from '../components/ColorSchemeSelector';
import PreviewPanel from '../components/PreviewPanel';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../configs/api';
import { RefreshCwIcon } from 'lucide-react';
import TitleSuggester from '../components/TitleSuggester';

const Generate = () => {
    const { id } = useParams();
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { isLoggedIn, credits, setCredits, user, authLoading } = useAuth();

    const [title, setTitle] = useState('');
    const [additionalDetails, setAdditionalDetails] = useState('');
    const [thumbnail, setThumbnail] = useState<IThumbnail | null>(null);
    const [loading, setLoading] = useState(false);
    const [regenerating, setRegenerating] = useState(false);
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
    const [colorSchemeId, setColorSchemeId] = useState<string>(colorSchemes[0].id);
    const [style, setStyle] = useState<ThumbnailStyle>('Photorealistic');
    const [styleDropdownOpen, setStyleDropdownOpen] = useState(false);
    const [model, setModel] = useState<'standard' | 'premium'>('standard');
    const [textColor, setTextColor] = useState<string>('#FFFFFF');
    const [textPosition, setTextPosition] = useState<'top' | 'center' | 'bottom'>('bottom');

    const handleGenerate = async () => {
        if (!isLoggedIn) return toast.error('Please login to generate thumbnails');
        if (!title.trim()) return toast.error('Title is required');
        const creditCost = model === 'premium' ? 10 : 5;
        if (credits < creditCost) return toast.error(`Insufficient credits! You need ${creditCost} credits. Please purchase more.`);
        setLoading(true);
        try {
            const api_payload = { title, prompt: additionalDetails, style, aspect_ratio: aspectRatio, color_scheme: colorSchemeId, text_overlay: true, text_color: textColor, text_position: textPosition, model };
            const { data } = await api.post('/api/thumbnail/generate', api_payload);
            if (data.thumbnail) {
                navigate('/generate/' + data.thumbnail._id);
                toast.success(data.message);
                if (data.credits !== undefined) setCredits(data.credits);
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRegenerate = async () => {
        if (!isLoggedIn) return toast.error('Please login to regenerate');
        if (!title.trim()) return toast.error('Title is required');
        setRegenerating(true);
        toast.loading('Regenerating thumbnail...', { id: 'regen' });
        try {
            const api_payload = { title, prompt: additionalDetails, style, aspect_ratio: aspectRatio, color_scheme: colorSchemeId, text_overlay: true, text_color: textColor };
            const { data } = await api.post('/api/thumbnail/generate', api_payload);
            if (data.thumbnail) {
                navigate('/generate/' + data.thumbnail._id);
                toast.success('Thumbnail regenerated!', { id: 'regen' });
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error.message, { id: 'regen' });
        } finally {
            setRegenerating(false);
        }
    };

    const fetchThumbnail = async () => {
        try {
            const { data } = await api.get(`/api/user/thumbnail/${id}`);
            setThumbnail(data?.thumbnail as IThumbnail);
            setLoading(!data?.thumbnail?.image_url);
            setAdditionalDetails(data?.thumbnail?.user_prompt);
            setTitle(data?.thumbnail?.title);
            setColorSchemeId(data?.thumbnail?.color_scheme);
            setAspectRatio(data?.thumbnail?.aspect_ratio);
            setStyle(data?.thumbnail?.style);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error.message);
        }
    };

    // Initial fetch when id or login state changes
    useEffect(() => {
        if (isLoggedIn && id) { fetchThumbnail(); }
    }, [id, isLoggedIn]);

    // Polling — only runs when thumbnail is still generating
    useEffect(() => {
        if (id && loading && isLoggedIn) {
            const interval = setInterval(() => { fetchThumbnail(); }, 5000);
            return () => clearInterval(interval);
        }
    }, [id, loading, isLoggedIn]);

    useEffect(() => { if (!id && thumbnail) { setThumbnail(null); } }, [pathname]);
    useEffect(() => { if (!authLoading && !isLoggedIn) { navigate('/'); } }, [authLoading, isLoggedIn]);

    return (
        <>
            <SoftBackdrop />
            <div className='pt-24 min-h-screen overflow-x-hidden'>
                <main className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 lg:pb-8'>
                    <div className='flex flex-col-reverse lg:grid lg:grid-cols-[400px_1fr] gap-6 lg:gap-8'>
                        {/* LEFT PANEL */}
                        <div className={`space-y-6 ${id && 'pointer-events-none'}`}>
                            <div className='p-4 sm:p-6 rounded-2xl bg-[#1a0f00]/80 border border-orange-900/40 shadow-xl space-y-5 sm:space-y-6'>
                                <div>
                                    <h2 className='text-xl font-bold text-white mb-1'>Create Your Thumbnail</h2>
                                    <p className='text-sm text-slate-400'>Describe your vision and let AI bring it to life</p>
                                </div>
                                {/* Credits Display */}
                                <div className='flex items-center justify-between px-4 py-3 rounded-xl bg-[#0d0800] border border-orange-900/40'>
                                    <div className='flex items-center gap-2'>
                                        <svg className='w-4 h-4 text-orange-400' fill='currentColor' viewBox='0 0 20 20'>
                                            <path d='M10 2a8 8 0 100 16A8 8 0 0010 2zm0 14a6 6 0 110-12 6 6 0 010 12zm1-7H9V7h2v2zm0 4H9v-2h2v2z'/>
                                        </svg>
                                        <span className='text-sm text-slate-300'>Available Credits: <span className={`font-bold ${credits < 10 ? 'text-red-400' : 'text-orange-400'}`}>{credits}</span></span>
                                    </div>
                                    <a href='/pricing' className='text-xs px-3 py-1 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium hover:from-orange-600 hover:to-amber-600 transition'>
                                        Buy Credits
                                    </a>
                                </div>
                                <div className='space-y-5'>
                                    <div className='space-y-2'>
                                        <label className='block text-sm font-medium text-slate-200'>Title or Topic</label>
                                        <input type='text' value={title} onChange={(e) => setTitle(e.target.value)} maxLength={100} placeholder='e.g., 10 Tips for Better Sleep'
                                            className='w-full px-4 py-3 rounded-xl border border-orange-900/40 bg-[#0d0800] text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/60 transition' />
                                        <div className='flex items-center justify-between'>
                                            <TitleSuggester onSelect={(t) => setTitle(t)} />
                                            <span className='text-xs text-slate-500'>{title.length}/100</span>
                                        </div>
                                    </div>
                                    <AspectRatioSelector value={aspectRatio} onChange={setAspectRatio} />
                                    <StyleSelector value={style} onChange={setStyle} isOpen={styleDropdownOpen} setIsOpen={setStyleDropdownOpen} />
                                    <ColorSchemeSelector value={colorSchemeId} onChange={setColorSchemeId} />

                                    {/* Text Color Picker */}
                                    <div className='space-y-2'>
                                        <label className='block text-sm font-medium text-slate-200'>Text Color</label>
                                        <div className='flex flex-wrap gap-2'>
                                            {[
                                                { color: '#FFFFFF', name: 'White' },
                                                { color: '#FFE600', name: 'Yellow' },
                                                { color: '#FF6B00', name: 'Orange' },
                                                { color: '#FF0000', name: 'Red' },
                                                { color: '#00FF88', name: 'Green' },
                                                { color: '#00CFFF', name: 'Blue' },
                                                { color: '#CC00FF', name: 'Purple' },
                                                { color: '#FF69B4', name: 'Pink' },
                                                { color: '#000000', name: 'Black' },
                                            ].map(({ color, name }) => (
                                                <button
                                                    key={color}
                                                    type='button'
                                                    title={name}
                                                    onClick={() => setTextColor(color)}
                                                    className={`w-8 h-8 rounded-lg border-2 transition-all ${textColor === color ? 'border-orange-500 scale-110 shadow-lg shadow-orange-500/30' : 'border-transparent hover:border-orange-400/50 hover:scale-105'}`}
                                                    style={{ backgroundColor: color, outline: color === '#FFFFFF' ? '1px solid #444' : 'none' }}
                                                />
                                            ))}
                                            {/* Custom color input */}
                                            <label title='Custom color' className={`w-8 h-8 rounded-lg border-2 cursor-pointer transition-all overflow-hidden ${!['#FFFFFF','#FFE600','#FF6B00','#FF0000','#00FF88','#00CFFF','#CC00FF','#FF69B4','#000000'].includes(textColor) ? 'border-orange-500 scale-110' : 'border-transparent hover:border-orange-400/50'}`}
                                                style={{ background: 'conic-gradient(red, yellow, lime, cyan, blue, magenta, red)' }}>
                                                <input type='color' value={textColor} onChange={(e) => setTextColor(e.target.value)} className='opacity-0 w-full h-full cursor-pointer' />
                                            </label>
                                        </div>
                                        <p className='text-xs text-slate-400'>Selected: <span style={{ color: textColor === '#000000' ? '#888' : textColor }} className='font-medium'>{textColor}</span></p>
                                    </div>

                                    {/* Text Position Selector — Click on thumbnail */}
                                    <div className='space-y-2'>
                                        <label className='block text-sm font-medium text-slate-200'>
                                            Text Position
                                            <span className='ml-2 text-xs text-slate-500 font-normal'>Click on the thumbnail to set position</span>
                                        </label>
                                        <div className='flex items-center gap-4'>
                                            {/* Clickable thumbnail */}
                                            <div className='relative w-40 h-24 rounded-xl overflow-hidden bg-slate-800 border-2 border-orange-500/40 cursor-pointer flex-shrink-0'>
                                                {/* Fake image content */}
                                                <div className='absolute inset-0 flex flex-col justify-center gap-1.5 px-3 opacity-20 pointer-events-none'>
                                                    <div className='h-1 bg-white rounded-full w-full' />
                                                    <div className='h-1 bg-white rounded-full w-4/5' />
                                                    <div className='h-1 bg-white rounded-full w-3/4' />
                                                    <div className='h-1 bg-white rounded-full w-5/6' />
                                                </div>

                                                {/* Top zone */}
                                                <div
                                                    onClick={() => setTextPosition('top')}
                                                    className={`absolute top-0 left-0 right-0 h-8 flex items-center justify-center transition-all duration-200 cursor-pointer group ${
                                                        textPosition === 'top' ? 'bg-orange-500/30' : 'hover:bg-white/10'
                                                    }`}
                                                >
                                                    {textPosition === 'top' ? (
                                                        <div className='absolute left-2 right-2 top-1.5 h-[5px] bg-orange-400 rounded-sm' />
                                                    ) : (
                                                        <span className='text-[10px] text-white/40 group-hover:text-white/70 transition-colors'>top</span>
                                                    )}
                                                </div>

                                                {/* Center zone */}
                                                <div
                                                    onClick={() => setTextPosition('center')}
                                                    className={`absolute top-1/2 -translate-y-1/2 left-0 right-0 h-8 flex items-center justify-center transition-all duration-200 cursor-pointer group ${
                                                        textPosition === 'center' ? 'bg-orange-500/30' : 'hover:bg-white/10'
                                                    }`}
                                                >
                                                    {textPosition === 'center' ? (
                                                        <div className='absolute left-2 right-2 h-[5px] bg-orange-400 rounded-sm' />
                                                    ) : (
                                                        <span className='text-[10px] text-white/40 group-hover:text-white/70 transition-colors'>center</span>
                                                    )}
                                                </div>

                                                {/* Bottom zone */}
                                                <div
                                                    onClick={() => setTextPosition('bottom')}
                                                    className={`absolute bottom-0 left-0 right-0 h-8 flex items-center justify-center transition-all duration-200 cursor-pointer group ${
                                                        textPosition === 'bottom' ? 'bg-orange-500/30' : 'hover:bg-white/10'
                                                    }`}
                                                >
                                                    {textPosition === 'bottom' ? (
                                                        <div className='absolute left-2 right-2 bottom-1.5 h-[5px] bg-orange-400 rounded-sm' />
                                                    ) : (
                                                        <span className='text-[10px] text-white/40 group-hover:text-white/70 transition-colors'>bottom</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Selected label */}
                                            <div className='flex flex-col gap-2'>
                                                {(['top', 'center', 'bottom'] as const).map((pos) => (
                                                    <div
                                                        key={pos}
                                                        onClick={() => setTextPosition(pos)}
                                                        className={`flex items-center gap-2 cursor-pointer transition-all duration-150 ${
                                                            textPosition === pos ? 'text-orange-400' : 'text-slate-500 hover:text-slate-300'
                                                        }`}
                                                    >
                                                        <div className={`w-2 h-2 rounded-full transition-all ${textPosition === pos ? 'bg-orange-400 scale-125' : 'bg-slate-600'}`} />
                                                        <span className={`text-xs font-medium capitalize`}>{pos}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='space-y-2'>
                                        <label className='block text-sm font-medium text-slate-200'>Model</label>

                                        {/* Model cards */}
                                        <div className='grid grid-cols-2 gap-2'>
                                            <button type='button' onClick={() => setModel('standard')}
                                                className={`relative p-3 rounded-xl border text-left transition-all ${model === 'standard' ? 'border-orange-500 bg-orange-950/50' : 'border-orange-900/40 bg-[#0d0800] hover:border-orange-700/50'}`}>
                                                <div className='flex items-center justify-between gap-1 mb-1'>
                                                    <div className='flex items-center gap-1'>
                                                        <svg className='w-3 h-3 text-orange-400 shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'><polygon points='13 2 3 14 12 14 11 22 21 10 12 10 13 2'/></svg>
                                                        <span className='text-xs font-bold text-white'>Standard</span>
                                                    </div>
                                                    <span className='text-[10px] font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded-full px-1.5 py-0.5 whitespace-nowrap'>5 cr</span>
                                                </div>
                                                <p className='text-[10px] text-slate-500 leading-relaxed'>Fast · Good quality</p>
                                            </button>
                                            <button type='button' onClick={() => setModel('premium')}
                                                className={`relative p-3 rounded-xl border text-left transition-all ${model === 'premium' ? 'border-amber-500 bg-amber-950/40' : 'border-orange-900/40 bg-[#0d0800] hover:border-amber-700/50'}`}>
                                                {model === 'premium' && <span className='absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-bold text-black bg-gradient-to-r from-orange-400 to-amber-400 rounded-full px-2 py-0.5'>BEST</span>}
                                                <div className='flex items-center justify-between gap-1 mb-1'>
                                                    <div className='flex items-center gap-1'>
                                                        <svg className='w-3 h-3 text-amber-400 shrink-0' fill='currentColor' viewBox='0 0 24 24'><path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'/></svg>
                                                        <span className='text-xs font-bold text-white'>Premium</span>
                                                    </div>
                                                    <span className='text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-1.5 py-0.5 whitespace-nowrap'>10 cr</span>
                                                </div>
                                                <p className='text-[10px] text-slate-500 leading-relaxed'>8K quality · Ultra detailed</p>
                                            </button>
                                        </div>

                                        {/* Comparison hint */}
                                        <div className={`flex items-start gap-2 p-2.5 rounded-lg border transition-all ${model === 'premium' ? 'border-amber-500/20 bg-amber-500/5' : 'border-orange-900/20 bg-orange-950/20'}`}>
                                            <svg className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${model === 'premium' ? 'text-amber-400' : 'text-orange-400'}`} fill='currentColor' viewBox='0 0 24 24'><path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z'/></svg>
                                            <p className='text-[10px] text-slate-400 leading-relaxed'>
                                                {model === 'premium'
                                                    ? '⚡ Premium uses FLUX.1-dev with 35 inference steps — produces cinematic, ultra-realistic thumbnails. Takes ~30–60 seconds.'
                                                    : '⚡ Standard uses FLUX.1-schnell with 8 steps — generates thumbnails in ~5–10 seconds. Good for quick ideas.'}
                                            </p>
                                        </div>

                                        <p className='text-xs text-slate-500'>
                                            Cost: <span className='text-orange-400 font-semibold'>{model === 'premium' ? '10' : '5'} credits</span> · Balance: <span className={`font-semibold ${credits < (model === 'premium' ? 10 : 5) ? 'text-red-400' : 'text-orange-400'}`}>{credits} credits</span>
                                        </p>
                                    </div>


                                    <div className='space-y-2'>
                                        <label className='block text-sm font-medium text-slate-200'>
                                            Additional Prompts <span className='text-slate-500 text-xs'>(optional)</span>
                                        </label>
                                        <textarea value={additionalDetails} onChange={(e) => setAdditionalDetails(e.target.value)} rows={3}
                                            placeholder='Add any specific elements, mood, or style preferences...'
                                            className='w-full px-4 py-3 rounded-xl border border-orange-900/40 bg-[#0d0800] text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/60 resize-none transition' />
                                    </div>
                                </div>
                                {!id && (
                                    <button onClick={handleGenerate} disabled={loading} className='text-[15px] w-full py-3.5 rounded-xl font-semibold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/25 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 transition-all'>
                                        {loading ? 'Generating...' : 'Generate Thumbnail'}
                                    </button>
                                )}
                            </div>
                        </div>
                        {/* RIGHT PANEL */}
                        <div>
                            <div className='p-4 sm:p-6 rounded-2xl bg-[#1a0f00]/80 border border-orange-900/40 shadow-xl'>
                                <div className='flex items-center justify-between mb-4'>
                                    <h2 className='text-lg font-semibold text-white'>Preview</h2>
                                    {/* Regenerate button — shows only when thumbnail exists */}
                                    {id && thumbnail?.image_url && (
                                        <button
                                            onClick={handleRegenerate}
                                            disabled={regenerating}
                                            className='flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/25 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed transition-all'
                                        >
                                            <RefreshCwIcon className={`size-4 ${regenerating && 'animate-spin'}`} />
                                            {regenerating ? 'Regenerating...' : 'Regenerate'}
                                        </button>
                                    )}
                                </div>
                                <PreviewPanel thumbnail={thumbnail} isLoading={loading} aspectRatio={aspectRatio} />

                                {/* Back & New Create — below preview */}
                                {id && (
                                    <div className='flex gap-3 mt-4'>
                                        <button
                                            onClick={() => navigate('/generate')}
                                            className='flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-orange-800/50 hover:bg-orange-950/50 text-slate-300 text-sm font-semibold transition-all active:scale-95'>
                                            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                                            </svg>
                                            Back
                                        </button>
                                        <button
                                            onClick={() => { navigate('/generate'); }}
                                            className='flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-sm font-semibold shadow-lg shadow-orange-500/25 transition-all active:scale-95'>
                                            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                                            </svg>
                                            New Create
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};
export default Generate;
