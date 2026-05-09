import { colorSchemes } from '../assets/assets';

interface ColorSchemeSelectorProps {
    value: string;
    onChange: (id: string) => void;
}

const ColorSchemeSelector = ({ value, onChange }: ColorSchemeSelectorProps) => {
    const selected = colorSchemes.find((s) => s.id === value);

    return (
        <div className='space-y-2'>
            <label className='block text-sm font-medium text-slate-200'>Color Scheme</label>
            <div className='flex flex-wrap gap-2'>
                {colorSchemes.map((scheme) => (
                    <button
                        key={scheme.id}
                        type='button'
                        onClick={() => onChange(scheme.id)}
                        title={scheme.name}
                        className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-all ${
                            value === scheme.id
                                ? 'border-orange-500 scale-110 shadow-lg shadow-orange-500/30'
                                : 'border-transparent hover:border-orange-400/50 hover:scale-105'
                        }`}
                        style={{
                            background: `linear-gradient(135deg, ${scheme.colors[0]} 0%, ${scheme.colors[1]} 50%, ${scheme.colors[2]} 100%)`,
                        }}
                    />
                ))}
            </div>
            {selected && (
                <p className='text-xs text-slate-400'>
                    Selected: <span className='text-slate-200'>{selected.name}</span>
                </p>
            )}
        </div>
    );
};

export default ColorSchemeSelector;
