import { useEffect, useState } from 'react';
import SoftBackdrop from '../components/SoftBackdrop';
import { type IThumbnail } from '../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpRightIcon, DownloadIcon, TrashIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../configs/api';
import toast from 'react-hot-toast';

const MyGeneration = () => {
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const aspectRatioClassMap: Record<string, string> = { '16:9': 'aspect-video', '1:1': 'aspect-square', '9:16': 'aspect-[9/16]' };
    const [thumbnails, setThumbnails] = useState<IThumbnail[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeId, setActiveId] = useState<string | null>(null);

    const fetchThumbnails = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/api/user/thumbnails');
            setThumbnails(data.thumbnails || []);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error.message);
        } finally { setLoading(false); }
    };

    const handleDownload = (image_url: string) => {
        const link = document.createElement('a');
        link.href = image_url.replace('/upload', '/upload/fl_attachment');
        document.body.appendChild(link); link.click(); link.remove();
    };

    const handleDelete = async (id: string) => {
        try {
            const confirm = window.confirm('Delete this thumbnail?');
            if (!confirm) return;
            const { data } = await api.delete(`/api/thumbnail/delete/${id}`);
            toast.success(data.message);
            setThumbnails(thumbnails.filter((t) => t._id !== id));
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error.message);
        }
    };

    useEffect(() => {
        if (isLoggedIn) fetchThumbnails();
        else setThumbnails([]);
    }, [isLoggedIn]);

    return (
        <>
            <SoftBackdrop />
            <div className='min-h-screen pt-20 pb-24'>

                {/* ── MOBILE ── */}
                <div className='md:hidden px-4'>
                    {/* Header */}
                    <div className='mt-6 mb-5'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <h1 className='text-xl font-black text-white'>My Generations</h1>
                                <p className='text-xs text-slate-500 mt-0.5'>{thumbnails.length} thumbnail{thumbnails.length !== 1 ? 's' : ''} created</p>
                            </div>
                            <button onClick={() => navigate('/generate')}
                                className='flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold shadow-lg shadow-orange-500/25 active:scale-95 transition-all'>
                                <svg className='w-3.5 h-3.5' fill='currentColor' viewBox='0 0 24 24'><polygon points='13 2 3 14 12 14 11 22 21 10 12 10 13 2'/></svg>
                                New
                            </button>
                        </div>
                    </div>

                    {/* Loading skeletons */}
                    {loading && (
                        <div className='grid grid-cols-2 gap-3'>
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className='rounded-2xl bg-[#1a0f00] border border-orange-900/30 animate-pulse aspect-video' />
                            ))}
                        </div>
                    )}

                    {/* Empty state */}
                    {!loading && thumbnails.length === 0 && (
                        <div className='flex flex-col items-center justify-center py-20 text-center'>
                            <div className='w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-4'>
                                <svg className='w-7 h-7 text-orange-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'><rect x='3' y='3' width='18' height='18' rx='2'/><path d='M3 9h18M9 21V9'/></svg>
                            </div>
                            <h3 className='text-base font-bold text-white'>No thumbnails yet</h3>
                            <p className='text-sm text-slate-400 mt-1 max-w-xs'>Generate your first AI thumbnail and it'll appear here</p>
                            <button onClick={() => navigate('/generate')}
                                className='mt-5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-bold shadow-lg shadow-orange-500/25 active:scale-95 transition-all'>
                                Generate Now
                            </button>
                        </div>
                    )}

                    {/* Grid */}
                    {!loading && thumbnails.length > 0 && (
                        <div className='grid grid-cols-2 gap-3'>
                            {thumbnails.map((thumb: IThumbnail) => {
                                const aspectClass = aspectRatioClassMap[thumb.aspect_ratio || '16:9'];
                                const isActive = activeId === thumb._id;
                                return (
                                    <div key={thumb._id}
                                        className='relative rounded-2xl bg-[#1a0f00] border border-orange-900/30 overflow-hidden shadow-lg'>
                                        {/* Image */}
                                        <div className={`relative ${aspectClass} bg-black`}
                                            onClick={() => setActiveId(isActive ? null : thumb._id)}>
                                            {thumb.image_url ? (
                                                <img src={thumb.image_url} alt={thumb.title}
                                                    className='w-full h-full object-cover' />
                                            ) : (
                                                <div className='w-full h-full flex items-center justify-center text-xs text-slate-500'>
                                                    {thumb.isGenerating ? 'Generating…' : 'No image'}
                                                </div>
                                            )}
                                            {thumb.isGenerating && (
                                                <div className='absolute inset-0 bg-black/60 flex items-center justify-center'>
                                                    <div className='flex items-center gap-1.5'>
                                                        <div className='w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce' style={{ animationDelay: '0ms' }} />
                                                        <div className='w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce' style={{ animationDelay: '150ms' }} />
                                                        <div className='w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce' style={{ animationDelay: '300ms' }} />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Action overlay on tap */}
                                            {isActive && !thumb.isGenerating && (
                                                <div className='absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-2'>
                                                    <button onClick={(e) => { e.stopPropagation(); navigate(`/generate/${thumb._id}`); }}
                                                        className='flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold w-32 justify-center'>
                                                        <svg className='w-3.5 h-3.5' fill='currentColor' viewBox='0 0 24 24'><polygon points='13 2 3 14 12 14 11 22 21 10 12 10 13 2'/></svg>
                                                        Open
                                                    </button>
                                                    <button onClick={(e) => { e.stopPropagation(); handleDownload(thumb.image_url!); }}
                                                        className='flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-semibold w-32 justify-center'>
                                                        <DownloadIcon className='w-3.5 h-3.5' />
                                                        Download
                                                    </button>
                                                    <div className='flex gap-2'>
                                                        <Link target='_blank' to={`/preview?thumbnail_url=${thumb.image_url}&title=${thumb.title}`}
                                                            onClick={(e) => e.stopPropagation()}
                                                            className='flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white text-xs'>
                                                            <ArrowUpRightIcon className='w-3 h-3' /> Preview
                                                        </Link>
                                                        <button onClick={(e) => { e.stopPropagation(); handleDelete(thumb._id); }}
                                                            className='flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-xs'>
                                                            <TrashIcon className='w-3 h-3' /> Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className='px-2.5 py-2'>
                                            <p className='text-white text-xs font-semibold line-clamp-1'>{thumb.title}</p>
                                            <p className='text-slate-600 text-[10px] mt-0.5'>{new Date(thumb.createdAt!).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* ── DESKTOP (unchanged) ── */}
                <div className='hidden md:block mt-12 px-16 lg:px-24 xl:px-32'>
                    <div className='mb-8'>
                        <h1 className='text-2xl font-bold text-white'>My Generations</h1>
                        <p className='text-sm text-slate-400 mt-1'>View and manage all your AI-generated thumbnails</p>
                    </div>

                    {loading && (
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className='rounded-2xl bg-[#1a0f00] border border-orange-900/30 animate-pulse h-[260px]' />
                            ))}
                        </div>
                    )}

                    {!loading && thumbnails.length === 0 && (
                        <div className='text-center py-24'>
                            <h3 className='text-lg font-semibold text-white'>No thumbnails yet</h3>
                            <p className='text-sm text-slate-400 mt-2'>Generate your first thumbnail to see it here</p>
                        </div>
                    )}

                    {!loading && thumbnails.length > 0 && (
                        <div className='columns-1 sm:columns-2 lg:columns-3 2xl:columns-4 gap-8'>
                            {thumbnails.map((thumb: IThumbnail) => {
                                const aspectClass = aspectRatioClassMap[thumb.aspect_ratio || '16:9'];
                                return (
                                    <div key={thumb._id} onClick={() => navigate(`/generate/${thumb._id}`)}
                                        className='mb-8 group relative cursor-pointer rounded-2xl bg-[#1a0f00] border border-orange-900/30 hover:border-orange-700/50 transition shadow-xl break-inside-avoid'>
                                        <div className={`relative overflow-hidden rounded-t-2xl ${aspectClass} bg-black`}>
                                            {thumb.image_url ? (
                                                <img src={thumb.image_url} alt={thumb.title} className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300' />
                                            ) : (
                                                <div className='w-full h-full flex items-center justify-center text-sm text-slate-400'>{thumb.isGenerating ? 'Generating…' : 'No image'}</div>
                                            )}
                                            {thumb.isGenerating && <div className='absolute inset-0 bg-black/50 flex items-center justify-center text-sm font-medium text-white'>Generating…</div>}
                                        </div>
                                        <div className='p-4 space-y-2'>
                                            <h3 className='text-sm font-semibold text-white line-clamp-2'>{thumb.title}</h3>
                                            <div className='flex flex-wrap gap-2 text-xs text-slate-400'>
                                                <span className='px-2 py-0.5 rounded-md bg-orange-950/50 border border-orange-900/30'>{thumb.style}</span>
                                                <span className='px-2 py-0.5 rounded-md bg-orange-950/50 border border-orange-900/30'>{thumb.color_scheme}</span>
                                                <span className='px-2 py-0.5 rounded-md bg-orange-950/50 border border-orange-900/30'>{thumb.aspect_ratio}</span>
                                            </div>
                                            <p className='text-xs text-slate-500'>{new Date(thumb.createdAt!).toDateString()}</p>
                                        </div>
                                        <div onClick={(e) => e.stopPropagation()} className='absolute bottom-2 right-2 max-sm:flex sm:hidden group-hover:flex gap-1.5'>
                                            <TrashIcon onClick={() => handleDelete(thumb._id)} className='size-6 bg-black/50 p-1 rounded hover:bg-orange-600 transition-all' />
                                            <DownloadIcon onClick={() => handleDownload(thumb.image_url!)} className='size-6 bg-black/50 p-1 rounded hover:bg-orange-600 transition-all' />
                                            <Link target='_blank' to={`/preview?thumbnail_url=${thumb.image_url}&title=${thumb.title}`}>
                                                <ArrowUpRightIcon className='size-6 bg-black/50 p-1 rounded hover:bg-orange-600 transition-all' />
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
export default MyGeneration;
