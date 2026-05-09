import { useState } from 'react';
import { Loader2Icon, SparklesIcon, XIcon } from 'lucide-react';
import api from '../configs/api';
import toast from 'react-hot-toast';

const TitleSuggester = ({ onSelect }: { onSelect: (title: string) => void }) => {
    const [open, setOpen] = useState(false);
    const [topic, setTopic] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const getSuggestions = async () => {
        if (!topic.trim()) return toast.error('Enter a topic first');
        setLoading(true);
        try {
            const { data } = await api.post('/api/user/title-suggestions', { topic });
            setSuggestions(data.suggestions || []);
        } catch {
            toast.error('Failed to get suggestions');
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (title: string) => {
        onSelect(title);
        setOpen(false);
        setSuggestions([]);
        setTopic('');
        toast.success('Title applied!');
    };

    return (
        <>
            <button type='button' onClick={() => setOpen(true)}
                className='flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 transition font-medium'>
                <SparklesIcon className='size-3.5' />
                Suggest titles with AI
            </button>

            {open && (
                <div className='fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm px-4 pb-6 sm:pb-0'
                    onClick={() => setOpen(false)}>
                    <div className='bg-[#1a0f00] border border-orange-900/40 rounded-2xl p-5 w-full sm:w-[420px] shadow-2xl'
                        onClick={(e) => e.stopPropagation()}>
                        <div className='flex items-center justify-between mb-4'>
                            <h3 className='text-white font-bold flex items-center gap-2'>
                                <SparklesIcon className='size-4 text-orange-400' /> AI Title Suggester
                            </h3>
                            <button onClick={() => setOpen(false)} className='text-slate-400 hover:text-white'><XIcon className='size-5' /></button>
                        </div>

                        <div className='space-y-3'>
                            <div>
                                <label className='text-xs font-semibold text-slate-400 mb-1.5 block'>What's your video about?</label>
                                <div className='flex gap-2'>
                                    <input value={topic} onChange={(e) => setTopic(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && getSuggestions()}
                                        placeholder='e.g., Python tutorial for beginners'
                                        className='flex-1 px-3 py-2.5 rounded-xl bg-[#0d0800] border border-orange-900/40 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition' />
                                    <button onClick={getSuggestions} disabled={loading}
                                        className='px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-bold active:scale-95 transition disabled:opacity-60'>
                                        {loading ? <Loader2Icon className='size-4 animate-spin' /> : 'Go'}
                                    </button>
                                </div>
                            </div>

                            {loading && (
                                <div className='flex items-center justify-center py-6 gap-2 text-slate-400'>
                                    <Loader2Icon className='size-5 animate-spin' />
                                    <span className='text-sm'>Generating titles...</span>
                                </div>
                            )}

                            {suggestions.length > 0 && !loading && (
                                <div className='space-y-2'>
                                    <p className='text-xs font-semibold text-slate-400 uppercase tracking-wider'>Tap to use</p>
                                    {suggestions.map((s, i) => (
                                        <button key={i} onClick={() => handleSelect(s)}
                                            className='w-full text-left px-4 py-3 rounded-xl bg-[#0d0800] border border-orange-900/30 hover:border-orange-500/50 text-sm text-slate-300 hover:text-white transition active:scale-[0.98]'>
                                            <span className='text-orange-400 font-bold mr-2'>{i + 1}.</span>{s}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TitleSuggester;
