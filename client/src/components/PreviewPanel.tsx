import { DownloadIcon, ImageIcon, Loader2Icon, Share2Icon, XIcon, CopyIcon, StarIcon } from 'lucide-react';
import type { AspectRatio, IThumbnail } from '../assets/assets';
import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../configs/api';

const PreviewPanel = ({ thumbnail, isLoading, aspectRatio }: { thumbnail: IThumbnail | null; isLoading: boolean; aspectRatio: AspectRatio }) => {
    const [showShare, setShowShare] = useState(false);
    const [showActions, setShowActions] = useState(false);
    const [showDownloadSizes, setShowDownloadSizes] = useState(false);
    const [showCTR, setShowCTR] = useState(false);
    const [ctrScore, setCtrScore] = useState<{ score: number; feedback: string; tips: string[] } | null>(null);
    const [ctrLoading, setCtrLoading] = useState(false);

    const aspectClasses = {
        '16:9': 'aspect-video',
        '1:1': 'aspect-square',
        '9:16': 'aspect-[9/16]',
    } as Record<AspectRatio, string>;

    const downloadSizes = [
        { label: 'YouTube (1280×720)', w: 1280, h: 720 },
        { label: 'Full HD (1920×1080)', w: 1920, h: 1080 },
        { label: 'Instagram Square (1080×1080)', w: 1080, h: 1080 },
        { label: 'YT Shorts (1080×1920)', w: 1080, h: 1920 },
        { label: 'Original', w: 0, h: 0 },
    ];

    const onDownload = (w = 0, h = 0) => {
        if (!thumbnail?.image_url) return;
        let url = thumbnail.image_url;
        if (w && h) {
            url = url.replace('/upload/', `/upload/w_${w},h_${h},c_fill/`);
        }
        const link = document.createElement('a');
        link.href = url.replace('/upload', '/upload/fl_attachment');
        document.body.appendChild(link);
        link.click();
        link.remove();
        setShowDownloadSizes(false);
        toast.success('Downloading...');
    };

    const onCopyToClipboard = async () => {
        if (!thumbnail?.image_url) return;
        try {
            const res = await fetch(thumbnail.image_url);
            const blob = await res.blob();
            await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
            toast.success('Image copied to clipboard!');
        } catch {
            navigator.clipboard.writeText(thumbnail.image_url);
            toast.success('Image URL copied!');
        }
    };

    const onCopyLink = () => {
        if (!thumbnail?.image_url) return;
        navigator.clipboard.writeText(thumbnail.image_url);
        toast.success('Link copied!');
        setShowShare(false);
    };

    const onShareWhatsApp = () => {
        if (!thumbnail?.image_url) return;
        window.open(`https://wa.me/?text=${encodeURIComponent(`Check out my AI thumbnail: ${thumbnail.title} - ${thumbnail.image_url}`)}`, '_blank');
        setShowShare(false);
    };

    const onShareTwitter = () => {
        if (!thumbnail?.image_url) return;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Just generated this AI thumbnail with ThumbForge AI! 🔥\n"${thumbnail.title}"\n${thumbnail.image_url}`)}`, '_blank');
        setShowShare(false);
    };

    const onShareFacebook = () => {
        if (!thumbnail?.image_url) return;
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(thumbnail.image_url)}`, '_blank');
        setShowShare(false);
    };

    const onCTRScore = async () => {
        if (!thumbnail?.image_url || !thumbnail?.title) return;
        setCtrLoading(true);
        setShowCTR(true);
        try {
            const { data } = await api.post('/api/user/ctr-score', {
                title: thumbnail.title,
                image_url: thumbnail.image_url,
            });
            setCtrScore(data);
        } catch {
            toast.error('Failed to get CTR score');
            setShowCTR(false);
        } finally {
            setCtrLoading(false);
        }
    };

    const scoreColor = (score: number) => {
        if (score >= 8) return 'text-green-400';
        if (score >= 5) return 'text-orange-400';
        return 'text-red-400';
    };

    return (
        <div className='relative mx-auto w-full max-w-2xl'>
            {/* Image container */}
            <div className={`relative w-full overflow-hidden rounded-xl ${aspectClasses[aspectRatio]}`}
                style={{ WebkitTransform: 'translateZ(0)', transform: 'translateZ(0)' }}>

                {isLoading && (
                    <div className='absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/25 rounded-xl'>
                        <Loader2Icon className='size-8 animate-spin text-zinc-400' />
                        <div className='text-center px-4'>
                            <p className='text-sm font-medium text-zinc-200'>AI is creating your thumbnail…</p>
                            <p className='mt-1 text-xs text-zinc-400'>This may take 30–60 seconds, please wait</p>
                        </div>
                    </div>
                )}

                {!isLoading && thumbnail?.image_url && (
                    <div className='relative h-full w-full' onClick={() => setShowActions(prev => !prev)}>
                        <img src={thumbnail?.image_url} alt={thumbnail.title}
                            className='h-full w-full object-cover rounded-xl' style={{ display: 'block', maxWidth: '100%' }} />
                        <div className={`absolute inset-0 flex items-end justify-center bg-black/20 rounded-xl transition-opacity duration-200 ${showActions ? 'opacity-100' : 'opacity-0 md:group-hover:opacity-100'}`}>
                            <div className='mb-4 sm:mb-6 flex items-center gap-2 flex-wrap justify-center px-2'>
                                <button onClick={(e) => { e.stopPropagation(); setShowDownloadSizes(true); setShowActions(false); }} type='button'
                                    className='flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold bg-white/30 ring-2 ring-white/40 backdrop-blur active:scale-95 text-white'>
                                    <DownloadIcon className='size-3.5' /><span>Download</span>
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); onCopyToClipboard(); setShowActions(false); }} type='button'
                                    className='flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold bg-white/30 ring-2 ring-white/40 backdrop-blur active:scale-95 text-white'>
                                    <CopyIcon className='size-3.5' /><span>Copy</span>
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); setShowShare(true); setShowActions(false); }} type='button'
                                    className='flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold bg-orange-500/80 ring-2 ring-orange-400/40 backdrop-blur active:scale-95 text-white'>
                                    <Share2Icon className='size-3.5' /><span>Share</span>
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); onCTRScore(); setShowActions(false); }} type='button'
                                    className='flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold bg-amber-500/80 ring-2 ring-amber-400/40 backdrop-blur active:scale-95 text-white'>
                                    <StarIcon className='size-3.5' /><span>CTR Score</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {!isLoading && !thumbnail?.image_url && (
                    <div className='absolute inset-0 m-2 flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-white/20 bg-black/25'>
                        <div className='hidden sm:flex size-16 items-center justify-center rounded-full bg-white/10'>
                            <ImageIcon className='size-8 text-white opacity-50' />
                        </div>
                        <div className='px-4 text-center'>
                            <p className='text-sm text-zinc-200'>Generate your first thumbnail</p>
                            <p className='mt-1 text-xs text-zinc-400'>Fill out the form and click Generate</p>
                        </div>
                    </div>
                )}
            </div>

            {!isLoading && thumbnail?.image_url && (
                <p className='md:hidden text-center text-[11px] text-slate-500 mt-2'>Tap image to show options</p>
            )}

            {/* Download Sizes Modal */}
            {showDownloadSizes && (
                <div className='fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm px-4 pb-6 sm:pb-0'
                    onClick={() => setShowDownloadSizes(false)}>
                    <div className='bg-[#1a0f00] border border-orange-900/40 rounded-2xl p-5 w-full sm:w-80 shadow-2xl'
                        onClick={(e) => e.stopPropagation()}>
                        <div className='flex items-center justify-between mb-4'>
                            <h3 className='text-white font-bold'>Download Size</h3>
                            <button onClick={() => setShowDownloadSizes(false)} className='text-slate-400 hover:text-white'><XIcon className='size-5' /></button>
                        </div>
                        <div className='space-y-2'>
                            {downloadSizes.map((size) => (
                                <button key={size.label} onClick={() => onDownload(size.w, size.h)}
                                    className='w-full flex items-center justify-between px-4 py-3 rounded-xl bg-[#0d0800] border border-orange-900/30 hover:border-orange-500/50 text-sm text-slate-300 hover:text-white transition active:scale-95'>
                                    <span>{size.label}</span>
                                    <DownloadIcon className='size-4 text-orange-400' />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Share Modal */}
            {showShare && (
                <div className='fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm px-4 pb-6 sm:pb-0'
                    onClick={() => setShowShare(false)}>
                    <div className='bg-[#1a0f00] border border-orange-900/40 rounded-2xl p-5 w-full sm:w-80 shadow-2xl'
                        onClick={(e) => e.stopPropagation()}>
                        <div className='flex items-center justify-between mb-4'>
                            <h3 className='text-white font-bold text-lg'>Share Thumbnail</h3>
                            <button onClick={() => setShowShare(false)} className='text-slate-400 hover:text-white'><XIcon className='size-5' /></button>
                        </div>
                        <div className='space-y-3'>
                            <button onClick={onShareWhatsApp} className='w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 hover:bg-[#25D366]/20 transition text-white text-sm font-medium'>
                                <svg className='size-5 shrink-0' viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                                Share on WhatsApp
                            </button>
                            <button onClick={onShareTwitter} className='w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-black/30 border border-white/10 hover:bg-black/50 transition text-white text-sm font-medium'>
                                <svg className='size-5 shrink-0' viewBox="0 0 24 24" fill="white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                                Share on X (Twitter)
                            </button>
                            <button onClick={onShareFacebook} className='w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1877F2]/10 border border-[#1877F2]/20 hover:bg-[#1877F2]/20 transition text-white text-sm font-medium'>
                                <svg className='size-5 shrink-0' viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                Share on Facebook
                            </button>
                            <button onClick={onCopyLink} className='w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/20 transition text-orange-400 text-sm font-medium'>
                                <svg className='size-5 shrink-0' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
                                Copy Link
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* CTR Score Modal */}
            {showCTR && (
                <div className='fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm px-4 pb-6 sm:pb-0'
                    onClick={() => { setShowCTR(false); setCtrScore(null); }}>
                    <div className='bg-[#1a0f00] border border-orange-900/40 rounded-2xl p-5 w-full sm:w-96 shadow-2xl'
                        onClick={(e) => e.stopPropagation()}>
                        <div className='flex items-center justify-between mb-4'>
                            <h3 className='text-white font-bold text-lg flex items-center gap-2'>
                                <StarIcon className='size-5 text-amber-400' /> CTR Score
                            </h3>
                            <button onClick={() => { setShowCTR(false); setCtrScore(null); }} className='text-slate-400 hover:text-white'><XIcon className='size-5' /></button>
                        </div>

                        {ctrLoading && (
                            <div className='flex flex-col items-center py-8 gap-3'>
                                <Loader2Icon className='size-8 animate-spin text-amber-400' />
                                <p className='text-slate-400 text-sm'>Analyzing your thumbnail...</p>
                            </div>
                        )}

                        {ctrScore && !ctrLoading && (
                            <div className='space-y-4'>
                                {/* Score circle */}
                                <div className='flex flex-col items-center py-4'>
                                    <div className={`text-6xl font-black ${scoreColor(ctrScore.score)}`}>
                                        {ctrScore.score}<span className='text-2xl text-slate-500'>/10</span>
                                    </div>
                                    <p className='text-slate-400 text-sm mt-2'>{ctrScore.feedback}</p>
                                </div>
                                {/* Tips */}
                                <div className='space-y-2'>
                                    <p className='text-xs font-semibold text-slate-400 uppercase tracking-wider'>Improvement Tips</p>
                                    {ctrScore.tips.map((tip, i) => (
                                        <div key={i} className='flex items-start gap-2 text-sm text-slate-300'>
                                            <span className='text-orange-400 shrink-0 mt-0.5'>→</span>
                                            {tip}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PreviewPanel;
