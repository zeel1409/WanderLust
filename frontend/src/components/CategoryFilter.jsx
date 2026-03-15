const CATEGORIES = [
    { name: 'All', icon: '🏠' },
    { name: 'Beach', icon: '🏖️' },
    { name: 'Mountains', icon: '🏔️' },
    { name: 'City', icon: '🏙️' },
    { name: 'Countryside', icon: '🌾' },
    { name: 'Desert', icon: '🏜️' },
    { name: 'Arctic', icon: '🧊' },
    { name: 'Luxury', icon: '✨' },
    { name: 'Cabin', icon: '🏕️' },
    { name: 'Treehouse', icon: '🌳' },
    { name: 'Island', icon: '🏝️' },
];

const CategoryFilter = ({ selected, onChange }) => {
    return (
        <div className="bg-white border-b border-gray-100 sticky top-16 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.name}
                            onClick={() => onChange(cat.name === 'All' ? '' : cat.name)}
                            className={`category-pill ${(selected === cat.name) || (!selected && cat.name === 'All') ? 'active' : ''}`}
                        >
                            <span className="text-xl">{cat.icon}</span>
                            <span>{cat.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryFilter;
