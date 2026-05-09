import { RectangleHorizontal, RectangleVertical, Square } from 'lucide-react';
import { aspectRatios, type AspectRatio } from '../assets/assets';
import type React from 'react';

const AspectRatioSelector = ({ value, onChange }: { value: AspectRatio; onChange: (ratio: AspectRatio) => void }) => {
    const iconMap = {
        '16:9': <RectangleHorizontal className='size-5' />,
        '1:1': <Square className='size-5' />,
        '9:16': <RectangleVertical className='size-5' />,
    } as Record<AspectRatio, React.ReactNode>;

    return (
        <div style={{width:'100%', boxSizing:'border-box'}}>
            <label className='block text-sm font-medium text-zinc-200 mb-3'>Aspect Ratio</label>
            <div style={{display:'grid', gridTemplateColumns:'repeat(3, minmax(0, 1fr))', gap:'8px', width:'100%', boxSizing:'border-box'}}>
                {aspectRatios.map((ratio) => {
                    const selected = value === ratio;
                    return (
                        <button
                            key={ratio}
                            type='button'
                            onClick={() => onChange(ratio)}
                            style={{
                                display:'flex',
                                alignItems:'center',
                                justifyContent:'center',
                                gap:'6px',
                                padding:'10px 8px',
                                borderRadius:'8px',
                                border: selected ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.1)',
                                background: selected ? 'rgba(255,255,255,0.1)' : 'transparent',
                                cursor:'pointer',
                                minWidth:0,
                                width:'100%',
                                boxSizing:'border-box',
                                color:'white',
                                fontSize:'13px',
                                letterSpacing:'0.05em',
                            }}
                        >
                            {iconMap[ratio]}
                            <span>{ratio}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default AspectRatioSelector;
