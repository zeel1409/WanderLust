import { useState, useEffect, useCallback, useRef } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CategoryFilter from '../components/CategoryFilter';
import PropertyCard from '../components/PropertyCard';
import PropertyCardSkeleton from '../components/PropertyCardSkeleton';
import api from '../api/axios';

// fallback listings if the backend is down or DB is empty
const DEMO_LISTINGS = [
    { _id: 'demo-1', title: 'Beachfront Paradise Villa – Goa', price: 14500, location: { city: 'Goa', country: 'India' }, images: [{ url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&auto=format&fit=crop&q=75' }], category: 'Beach', averageRating: 4.9, reviewCount: 48 },
    { _id: 'demo-2', title: 'Snow Peak Chalet – Shimla', price: 10500, location: { city: 'Shimla', country: 'India' }, images: [{ url: 'https://images.unsplash.com/photo-1548777123-e216912df7d8?w=600&auto=format&fit=crop&q=75' }], category: 'Mountains', averageRating: 4.8, reviewCount: 41 },
    { _id: 'demo-3', title: 'Heritage Loft – Old Delhi', price: 7800, location: { city: 'Delhi', country: 'India' }, images: [{ url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&auto=format&fit=crop&q=75' }], category: 'City', averageRating: 4.5, reviewCount: 38 },
    { _id: 'demo-4', title: 'Royal Dunes Glamping – Jaisalmer', price: 12500, location: { city: 'Jaisalmer', country: 'India' }, images: [{ url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600&auto=format&fit=crop&q=75' }], category: 'Desert', averageRating: 4.9, reviewCount: 44 },
    { _id: 'demo-5', title: 'Heritage Courtyard Haveli – Jaipur', price: 21500, location: { city: 'Jaipur', country: 'India' }, images: [{ url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop&q=75' }], category: 'Luxury', averageRating: 4.9, reviewCount: 56 },
    { _id: 'demo-6', title: 'Cozy Pine Cabin – Manali', price: 6800, location: { city: 'Manali', country: 'India' }, images: [{ url: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=600&auto=format&fit=crop&q=75' }], category: 'Cabin', averageRating: 4.8, reviewCount: 32 },
    { _id: 'demo-7', title: 'Glass Igloo Suite – Rovaniemi', price: 36000, location: { city: 'Rovaniemi', country: 'Finland' }, images: [{ url: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?w=600&auto=format&fit=crop&q=75' }], category: 'Arctic', averageRating: 5.0, reviewCount: 89 },
    { _id: 'demo-8', title: 'Luxury Backwater Houseboat – Alleppey', price: 15500, location: { city: 'Alleppey', country: 'India' }, images: [{ url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&auto=format&fit=crop&q=75' }], category: 'Island', averageRating: 5.0, reviewCount: 112 },
];

const Home = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('');
    const [searchInput, setSearchInput] = useState('');   // raw value from Navbar
    const debouncedSearch = useDebounce(searchInput, 500); // debounced — used for API
    const [search, setSearch] = useState('');              // actual search sent to API
    const [isDemo, setIsDemo] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);


    // Sync debounced search value → actual search state (resets page too)
    useEffect(() => {
        setSearch(debouncedSearch);
        setPage(1);
    }, [debouncedSearch]);

    const abortRef = useRef(null);

    const fetchListings = useCallback(async () => {
        // Cancel any previous in-flight request
        if (abortRef.current) abortRef.current.abort();
        abortRef.current = new AbortController();
        const { signal } = abortRef.current;

        setLoading(true);

        // filter DEMO_LISTINGS by current category / search (used as fallback)
        const getFiltered = () => DEMO_LISTINGS.filter((l) => {
            const matchCat = !category || l.category === category;
            const matchSearch = !search ||
                l.title.toLowerCase().includes(search.toLowerCase()) ||
                l.location.city.toLowerCase().includes(search.toLowerCase());
            return matchCat && matchSearch;
        });

        try {
            const params = { page, limit: 12 };
            if (category) params.category = category;
            if (search) params.location = search;

            const { data } = await api.get('/listings', { params, signal });
            const fetched = data.listings || [];

            if (fetched.length === 0) {
                setListings(getFiltered());
                setIsDemo(true);
                setTotalPages(1);
            } else {
                setListings(fetched);
                setIsDemo(false);
                setTotalPages(Math.max(1, Math.ceil((data.total || 0) / 12)));
            }
        } catch (err) {
            // Ignore abort errors — a new request is already on the way
            if (err.name === 'CanceledError' || err.name === 'AbortError') return;
            console.log('Could not reach backend, showing demo listings');
            setListings(getFiltered());
            setIsDemo(true);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    }, [category, search, page]);

    useEffect(() => {
        fetchListings();
    }, [fetchListings]);

    return (
        <div style={{ minHeight: '100vh', background: 'white' }}>
            <Navbar onSearch={(val) => setSearchInput(val)} />

            {/* simple hero banner - only show when not searching */}
            {!search && !category && (
                <div style={{ position: 'relative', height: '360px', overflow: 'hidden' }}>
                    <img
                        src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=75"
                        srcSet="
                            https://images.unsplash.com/photo-1566073771259-6a8506099945?w=640&auto=format&fit=crop&q=75 640w,
                            https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1024&auto=format&fit=crop&q=75 1024w,
                            https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1280&auto=format&fit=crop&q=75 1280w
                        "
                        sizes="100vw"
                        alt="Hero"
                        width="1280"
                        height="360"
                        fetchpriority="high"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} />
                    <div style={{
                        position: 'absolute', inset: 0,
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        textAlign: 'center', padding: '0 1rem'
                    }}>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: '0.75rem' }}>
                            Find your next perfect stay
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem' }}>
                            Unique stays, curated experiences.
                        </p>
                    </div>
                </div>
            )}

            <CategoryFilter selected={category} onChange={(c) => { setCategory(c); setPage(1); }} />

            {/* show what we're filtering by */}
            {(search || category) && (
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                        {search ? `Results for "${search}"` : `${category} stays`}
                    </h2>
                    <button
                        onClick={() => { setSearch(''); setCategory(''); setPage(1); }}
                        style={{ fontSize: '0.875rem', color: '#6b7280', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                        Clear
                    </button>
                </div>
            )}

            {/* demo mode warning */}
            {isDemo && !search && !category && (
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem 1.5rem 0' }}>
                    <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '12px 16px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <span>⚠️</span>
                        <div>
                            <p style={{ margin: 0, fontWeight: 600, fontSize: '0.875rem', color: '#92400e' }}>Showing demo listings</p>
                            <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#b45309' }}>
                                Connect MongoDB and run <code>node seed.js</code> to load real data.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* listings grid */}
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
                {loading ? (
                    /* Skeleton grid — same layout as real cards */
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {Array.from({ length: 8 }).map((_, i) => (
                            <PropertyCardSkeleton key={i} />
                        ))}
                    </div>
                ) : listings.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '5rem 0' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏡</div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No listings found</h3>
                        <p style={{ color: '#6b7280' }}>Try a different location or category</p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {listings.map((listing) => (
                            <PropertyCard key={listing._id} listing={listing} />
                        ))}
                    </div>
                )}

                {/* pagination */}
                {!isDemo && totalPages > 1 && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', marginTop: '3rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <button
                                onClick={() => {
                                    setPage((p) => Math.max(1, p - 1));
                                    window.scrollTo({ top: 320, behavior: 'smooth' });
                                }}
                                disabled={page === 1}
                                style={{
                                    padding: '8px 16px', borderRadius: '9999px',
                                    border: '1px solid #e5e7eb', background: 'white',
                                    fontSize: '0.875rem', fontWeight: 600,
                                    cursor: page === 1 ? 'not-allowed' : 'pointer',
                                    opacity: page === 1 ? 0.4 : 1,
                                    color: '#374151'
                                }}
                            >
                                ← Prev
                            </button>

                            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((num) => (
                                <button
                                    key={num}
                                    onClick={() => {
                                        setPage(num);
                                        window.scrollTo({ top: 320, behavior: 'smooth' });
                                    }}
                                    style={{
                                        width: '38px', height: '38px', borderRadius: '50%',
                                        border: page === num ? 'none' : '1px solid #e5e7eb',
                                        background: page === num ? '#FF385C' : 'white',
                                        color: page === num ? 'white' : '#374151',
                                        fontSize: '0.875rem', fontWeight: 700,
                                        cursor: 'pointer',
                                        boxShadow: page === num ? '0 2px 8px rgba(255,56,92,0.3)' : 'none',
                                        transition: 'all 0.15s ease'
                                    }}
                                >
                                    {num}
                                </button>
                            ))}

                            <button
                                onClick={() => {
                                    setPage((p) => Math.min(totalPages, p + 1));
                                    window.scrollTo({ top: 320, behavior: 'smooth' });
                                }}
                                disabled={page === totalPages}
                                style={{
                                    padding: '8px 16px', borderRadius: '9999px',
                                    border: '1px solid #e5e7eb', background: 'white',
                                    fontSize: '0.875rem', fontWeight: 600,
                                    cursor: page === totalPages ? 'not-allowed' : 'pointer',
                                    opacity: page === totalPages ? 0.4 : 1,
                                    color: '#374151'
                                }}
                            >
                                Next →
                            </button>
                        </div>
                        <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                            Page {page} of {totalPages}
                        </span>
                    </div>
                )}
            </div>

            {/* footer */}
            <footer style={{ borderTop: '1px solid #e5e7eb', background: '#f9fafb', marginTop: '3rem' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                        <div>
                            <p style={{ fontWeight: 800, fontSize: '1.1rem', color: '#FF385C', marginBottom: '0.5rem' }}>wanderlust</p>
                            <p style={{ fontSize: '0.85rem', color: '#6b7280', lineHeight: 1.6 }}>
                                Discover unique stays around the world.
                            </p>
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <p style={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Explore</p>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.5rem 1rem' }}>
                                {['Beach', 'Mountains', 'City', 'Countryside', 'Desert', 'Arctic', 'Luxury', 'Cabin', 'Treehouse', 'Island'].map((l) => (
                                    <li key={l}>
                                        <Link
                                            to="/"
                                            onClick={() => { setCategory(l); setPage(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                            style={{ color: '#6b7280', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.15s ease' }}
                                            onMouseEnter={(e) => e.target.style.color = '#111827'}
                                            onMouseLeave={(e) => e.target.style.color = '#6b7280'}
                                        >
                                            {l}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <p style={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Support</p>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <li>
                                    <a
                                        href="mailto:support@wanderlust.com?subject=Wanderlust%20Help%20Center"
                                        style={{ color: '#6b7280', fontSize: '0.875rem', textDecoration: 'none' }}
                                    >
                                        Help Center
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="mailto:contact@wanderlust.com?subject=Inquiry%20via%20Wanderlust"
                                        style={{ color: '#6b7280', fontSize: '0.875rem', textDecoration: 'none' }}
                                    >
                                        Contact Us
                                    </a>
                                </li>
                                <li><Link to="/privacy" style={{ color: '#6b7280', fontSize: '0.875rem', textDecoration: 'none' }}>Privacy Policy</Link></li>
                                <li><Link to="/terms" style={{ color: '#6b7280', fontSize: '0.875rem', textDecoration: 'none' }}>Terms of Service</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#9ca3af' }}>© {new Date().getFullYear()} WanderLust. All rights reserved.</p>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#9ca3af' }}>Made for dreamers & explorers ❤️.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
