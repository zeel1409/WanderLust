import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import CategoryFilter from '../components/CategoryFilter';
import PropertyCard from '../components/PropertyCard';
import api from '../api/axios';

// fallback listings if the backend is down or DB is empty
const DEMO_LISTINGS = [
    { _id: 'demo-1', title: 'Beachfront Villa – Goa', price: 180, location: { city: 'Goa', country: 'India' }, images: [{ url: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&auto=format&fit=crop' }], category: 'Beach', averageRating: 4.9, reviewCount: 48 },
    { _id: 'demo-2', title: 'Snow Peak Chalet – Shimla', price: 130, location: { city: 'Shimla', country: 'India' }, images: [{ url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop' }], category: 'Mountains', averageRating: 4.8, reviewCount: 41 },
    { _id: 'demo-3', title: 'Modern Loft – South Delhi', price: 145, location: { city: 'Delhi', country: 'India' }, images: [{ url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop' }], category: 'City', averageRating: 4.5, reviewCount: 38 },
    { _id: 'demo-4', title: 'Desert Camp – Jaisalmer', price: 160, location: { city: 'Jaisalmer', country: 'India' }, images: [{ url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop' }], category: 'Desert', averageRating: 4.9, reviewCount: 44 },
    { _id: 'demo-5', title: 'Heritage Haveli – Jaipur', price: 135, location: { city: 'Jaipur', country: 'India' }, images: [{ url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&auto=format&fit=crop' }], category: 'Luxury', averageRating: 4.9, reviewCount: 56 },
    { _id: 'demo-6', title: 'Cozy Cabin – Manali', price: 95, location: { city: 'Manali', country: 'India' }, images: [{ url: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&auto=format&fit=crop' }], category: 'Cabin', averageRating: 4.8, reviewCount: 32 },
    { _id: 'demo-7', title: 'Glass Igloo – Rovaniemi', price: 450, location: { city: 'Rovaniemi', country: 'Finland' }, images: [{ url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&auto=format&fit=crop' }], category: 'Arctic', averageRating: 5.0, reviewCount: 89 },
    { _id: 'demo-8', title: 'Overwater Bungalow – Maldives', price: 620, location: { city: 'Malé', country: 'Maldives' }, images: [{ url: 'https://images.unsplash.com/photo-1439130490301-25e322d88054?w=800&auto=format&fit=crop' }], category: 'Luxury', averageRating: 5.0, reviewCount: 112 },
];

const Home = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('');
    const [search, setSearch] = useState('');
    const [isDemo, setIsDemo] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // filter demo listings by current category/search
    const filterDemo = (list) => {
        return list.filter((l) => {
            const matchCat = !category || l.category === category;
            const matchSearch = !search ||
                l.title.toLowerCase().includes(search.toLowerCase()) ||
                l.location.city.toLowerCase().includes(search.toLowerCase());
            return matchCat && matchSearch;
        });
    };

    const fetchListings = async () => {
        setLoading(true);
        try {
            const params = { page, limit: 12 };
            if (category) params.category = category;
            if (search) params.location = search;

            const { data } = await api.get('/listings', { params });
            const fetched = data.listings || [];

            if (fetched.length === 0) {
                // no listings in DB, show demo data
                setListings(filterDemo(DEMO_LISTINGS));
                setIsDemo(true);
                setTotalPages(1);
            } else {
                setListings(fetched);
                setIsDemo(false);
                setTotalPages(Math.max(1, Math.ceil((data.total || 0) / 12)));
            }
        } catch (err) {
            // backend might be down, just show demo
            console.log('Could not reach backend, showing demo listings');
            setListings(filterDemo(DEMO_LISTINGS));
            setIsDemo(true);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchListings();
    }, [category, search, page]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div style={{ minHeight: '100vh', background: 'white' }}>
            <Navbar onSearch={(val) => { setSearch(val); setPage(1); }} />

            {/* simple hero banner - only show when not searching */}
            {!search && !category && (
                <div style={{ position: 'relative', height: '360px', overflow: 'hidden' }}>
                    <img
                        src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&auto=format&fit=crop"
                        alt="Hero"
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
                    <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                        <div className="spinner" style={{ margin: '0 auto' }} />
                        <p style={{ color: '#6b7280', marginTop: '1rem' }}>Loading listings...</p>
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
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2.5rem' }}>
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            style={{
                                padding: '8px 20px', borderRadius: '9999px',
                                border: '1px solid #e5e7eb', background: 'white',
                                fontSize: '0.875rem', fontWeight: 600,
                                cursor: page === 1 ? 'not-allowed' : 'pointer',
                                opacity: page === 1 ? 0.4 : 1
                            }}
                        >
                            ← Prev
                        </button>
                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                            {page} / {totalPages}
                        </span>
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            style={{
                                padding: '8px 20px', borderRadius: '9999px',
                                border: '1px solid #e5e7eb', background: 'white',
                                fontSize: '0.875rem', fontWeight: 600,
                                cursor: page === totalPages ? 'not-allowed' : 'pointer',
                                opacity: page === totalPages ? 0.4 : 1
                            }}
                        >
                            Next →
                        </button>
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
                        <div>
                            <p style={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Explore</p>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {['Beach', 'Mountains', 'City', 'Desert', 'Luxury'].map((l) => (
                                    <li key={l}><a href="#" style={{ color: '#6b7280', fontSize: '0.875rem', textDecoration: 'none' }}>{l}</a></li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <p style={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Support</p>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {['Help Center', 'Contact Us', 'Privacy Policy'].map((l) => (
                                    <li key={l}><a href="#" style={{ color: '#6b7280', fontSize: '0.875rem', textDecoration: 'none' }}>{l}</a></li>
                                ))}
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
