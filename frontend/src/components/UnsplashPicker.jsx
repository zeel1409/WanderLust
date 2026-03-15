import { useState, useCallback } from 'react';

const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_KEY;

// Curated fallback images per search term (when no API key)
const FALLBACK_BY_QUERY = {
    default: [
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400&auto=format&fit=crop',
    ],
};

const UnsplashPicker = ({ onSelect, onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [selected, setSelected] = useState([]);

    const search = useCallback(async (q) => {
        if (!q.trim()) return;
        setLoading(true);
        setSearched(true);
        try {
            if (!UNSPLASH_KEY || UNSPLASH_KEY === 'your_unsplash_access_key_here') {
                // Use curated fallbacks without API key
                const fallback = FALLBACK_BY_QUERY[q.toLowerCase()] || FALLBACK_BY_QUERY.default;
                setResults(fallback.map((url, i) => ({
                    id: `fallback-${i}`,
                    urls: { small: url, regular: url.replace('w=400', 'w=1200') },
                    alt_description: q,
                    user: { name: 'Unsplash' },
                })));
                return;
            }
            const res = await fetch(
                `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=12&client_id=${UNSPLASH_KEY}`
            );
            const data = await res.json();
            setResults(data.results || []);
        } catch {
            setResults([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const toggleSelect = (photo) => {
        setSelected((prev) =>
            prev.find((p) => p.id === photo.id)
                ? prev.filter((p) => p.id !== photo.id)
                : [...prev, photo]
        );
    };

    const handleConfirm = () => {
        onSelect(selected.map((p) => p.urls.regular));
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-gray-700" viewBox="0 0 32 32" fill="currentColor">
                            <path d="M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z" />
                        </svg>
                        <h2 className="text-lg font-bold text-gray-900">Search Unsplash Photos</h2>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500">✕</button>
                </div>

                {/* Search bar */}
                <div className="px-6 py-4 border-b border-gray-100">
                    <form onSubmit={(e) => { e.preventDefault(); search(query); }} className="flex gap-2">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="input-field flex-1"
                            placeholder="Search photos... e.g. beach house, mountain cabin"
                            autoFocus
                        />
                        <button type="submit" className="btn-primary px-5 whitespace-nowrap">
                            Search
                        </button>
                    </form>
                    {!UNSPLASH_KEY || UNSPLASH_KEY === 'your_unsplash_access_key_here' ? (
                        <p className="text-xs text-amber-600 mt-2">⚠️ No Unsplash key – showing curated previews. Add <code className="bg-amber-50 px-1 rounded">VITE_UNSPLASH_KEY</code> to enable full search.</p>
                    ) : null}
                </div>

                {/* Results */}
                <div className="flex-1 overflow-y-auto p-4">
                    {loading && (
                        <div className="grid grid-cols-3 gap-3">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="skeleton aspect-[4/3] rounded-xl" />
                            ))}
                        </div>
                    )}

                    {!loading && searched && results.length === 0 && (
                        <div className="text-center py-12 text-gray-400">
                            <span className="text-4xl">🔍</span>
                            <p className="mt-2 font-medium">No photos found</p>
                            <p className="text-sm">Try a different keyword</p>
                        </div>
                    )}

                    {!loading && !searched && (
                        <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                            <span className="text-4xl mb-2">🖼️</span>
                            <p className="text-sm">Type a keyword and click Search</p>
                        </div>
                    )}

                    {!loading && results.length > 0 && (
                        <div className="grid grid-cols-3 gap-3">
                            {results.map((photo) => {
                                const isSelected = selected.find((p) => p.id === photo.id);
                                return (
                                    <button
                                        key={photo.id}
                                        type="button"
                                        onClick={() => toggleSelect(photo)}
                                        className={`relative aspect-[4/3] rounded-xl overflow-hidden transition-all ${isSelected ? 'ring-3 ring-offset-2' : 'hover:opacity-90'}`}
                                        style={{ ringColor: '#FF385C' }}
                                    >
                                        <img src={photo.urls.small} alt={photo.alt_description} className="w-full h-full object-cover" />
                                        {isSelected && (
                                            <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(255,56,92,0.35)' }}>
                                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md">
                                                    <svg className="w-4 h-4" fill="none" stroke="#FF385C" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                </div>
                                            </div>
                                        )}
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-2 py-1.5 opacity-0 hover:opacity-100 transition-opacity">
                                            <p className="text-white text-[10px] truncate">Photo by {photo.user?.name}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        {selected.length > 0 ? `${selected.length} photo${selected.length > 1 ? 's' : ''} selected` : 'Click photos to select'}
                    </p>
                    <div className="flex gap-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirm}
                            disabled={selected.length === 0}
                            className="btn-primary px-5 text-sm"
                            style={{ opacity: selected.length === 0 ? 0.5 : 1 }}
                        >
                            Use {selected.length > 0 ? `${selected.length} ` : ''}photo{selected.length !== 1 ? 's' : ''}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UnsplashPicker;
