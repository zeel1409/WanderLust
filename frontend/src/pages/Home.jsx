import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import CategoryFilter from '../components/CategoryFilter';
import PropertyCard from '../components/PropertyCard';
import api from '../api/axios';

const HERO_IMAGES = [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1600&auto=format&fit=crop',
];

// Hardcoded demo listings – shown as fallback when DB is empty
const DEMO_LISTINGS = [
    // ── Beach (4) ────────────────────────────────────────────────────────────
    { _id: 'demo-1',  title: 'Beachfront Paradise Villa – Goa',          price: 180, location: { city: 'Goa',         country: 'India'       }, images: [{ url: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&auto=format&fit=crop' }], category: 'Beach',       averageRating: 4.9, reviewCount: 48 },
    { _id: 'demo-2',  title: 'Ocean Breeze Cottage – Pondicherry',       price: 120, location: { city: 'Pondicherry', country: 'India'       }, images: [{ url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop' }], category: 'Beach',       averageRating: 4.7, reviewCount: 36 },
    { _id: 'demo-3',  title: 'Coral Beach House – Andaman',              price: 210, location: { city: 'Port Blair', country: 'India'       }, images: [{ url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&auto=format&fit=crop' }], category: 'Beach',       averageRating: 4.8, reviewCount: 52 },
    { _id: 'demo-4',  title: 'Seaside Escape – Varkala',                 price:  95, location: { city: 'Varkala',    country: 'India'       }, images: [{ url: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&auto=format&fit=crop' }], category: 'Beach',       averageRating: 4.6, reviewCount: 28 },
    // ── Mountains (4) ────────────────────────────────────────────────────────
    { _id: 'demo-5',  title: 'Snow Peak Chalet – Shimla',                price: 130, location: { city: 'Shimla',     country: 'India'       }, images: [{ url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop' }], category: 'Mountains',   averageRating: 4.8, reviewCount: 41 },
    { _id: 'demo-6',  title: 'Himalayan Hideout – Leh',                  price: 155, location: { city: 'Leh',        country: 'India'       }, images: [{ url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop' }], category: 'Mountains',   averageRating: 4.9, reviewCount: 67 },
    { _id: 'demo-7',  title: 'Alpine View Studio – Darjeeling',          price:  88, location: { city: 'Darjeeling', country: 'India'       }, images: [{ url: 'https://images.unsplash.com/photo-1540390769625-2fc3f8b1d7e8?w=800&auto=format&fit=crop' }], category: 'Mountains',   averageRating: 4.7, reviewCount: 33 },
    { _id: 'demo-8',  title: 'Misty Mountain Retreat – Munnar',          price: 110, location: { city: 'Munnar',     country: 'India'       }, images: [{ url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&auto=format&fit=crop' }], category: 'Mountains',   averageRating: 4.6, reviewCount: 19 },
    // ── City (4) ─────────────────────────────────────────────────────────────
    { _id: 'demo-9',  title: 'Sky-High Luxury Apartment – Mumbai',       price: 220, location: { city: 'Mumbai',     country: 'India'       }, images: [{ url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop' }], category: 'City',        averageRating: 4.7, reviewCount: 21 },
    { _id: 'demo-10', title: 'Modern Loft in South Delhi',               price: 145, location: { city: 'Delhi',      country: 'India'       }, images: [{ url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop' }], category: 'City',        averageRating: 4.5, reviewCount: 38 },
    { _id: 'demo-11', title: 'Penthouse with City Views – Bangalore',    price: 190, location: { city: 'Bangalore',  country: 'India'       }, images: [{ url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop' }], category: 'City',        averageRating: 4.6, reviewCount: 14 },
    { _id: 'demo-12', title: 'Heritage Bungalow – Kolkata',              price:  98, location: { city: 'Kolkata',    country: 'India'       }, images: [{ url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&auto=format&fit=crop' }], category: 'City',        averageRating: 4.4, reviewCount: 22 },
    // ── Countryside (4) ──────────────────────────────────────────────────────
    { _id: 'demo-13', title: 'Lakeside Cottage – Nainital',              price:  88, location: { city: 'Nainital',   country: 'India'       }, images: [{ url: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&auto=format&fit=crop' }], category: 'Countryside', averageRating: 4.6, reviewCount: 29 },
    { _id: 'demo-14', title: 'Green Valley Farmstay – Coorg',            price:  75, location: { city: 'Coorg',      country: 'India'       }, images: [{ url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop' }], category: 'Countryside', averageRating: 4.8, reviewCount: 45 },
    { _id: 'demo-15', title: 'Mustard Fields Homestay – Punjab',         price:  60, location: { city: 'Amritsar',   country: 'India'       }, images: [{ url: 'https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?w=800&auto=format&fit=crop' }], category: 'Countryside', averageRating: 4.5, reviewCount: 18 },
    { _id: 'demo-16', title: 'Riverside Bungalow – Rishikesh',           price: 105, location: { city: 'Rishikesh',  country: 'India'       }, images: [{ url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&auto=format&fit=crop' }], category: 'Countryside', averageRating: 4.7, reviewCount: 31 },
    // ── Desert (4) ───────────────────────────────────────────────────────────
    { _id: 'demo-17', title: 'Desert Camp Glamping – Jaisalmer',         price: 160, location: { city: 'Jaisalmer',  country: 'India'       }, images: [{ url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop' }], category: 'Desert',      averageRating: 4.9, reviewCount: 44 },
    { _id: 'demo-18', title: 'Royal Tent Suite – Bikaner',               price: 130, location: { city: 'Bikaner',    country: 'India'       }, images: [{ url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&auto=format&fit=crop' }], category: 'Desert',      averageRating: 4.7, reviewCount: 27 },
    { _id: 'demo-19', title: 'Golden Dunes Resort – Pushkar',            price: 115, location: { city: 'Pushkar',    country: 'India'       }, images: [{ url: 'https://images.unsplash.com/photo-1484821582734-6692f4ec3c9c?w=800&auto=format&fit=crop' }], category: 'Desert',      averageRating: 4.6, reviewCount: 35 },
    { _id: 'demo-20', title: 'Marwar Heritage Camp – Jodhpur',           price: 145, location: { city: 'Jodhpur',    country: 'India'       }, images: [{ url: 'https://images.unsplash.com/photo-1535082623926-b39352a03fb7?w=800&auto=format&fit=crop' }], category: 'Desert',      averageRating: 4.8, reviewCount: 53 },
    // ── Arctic (4) ───────────────────────────────────────────────────────────
    { _id: 'demo-21', title: 'Glass Igloo Suite – Rovaniemi',            price: 450, location: { city: 'Rovaniemi',  country: 'Finland'     }, images: [{ url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&auto=format&fit=crop' }], category: 'Arctic',      averageRating: 5.0, reviewCount: 89 },
    { _id: 'demo-22', title: 'Northern Lights Cabin – Tromsø',           price: 380, location: { city: 'Tromsø',     country: 'Norway'      }, images: [{ url: 'https://images.unsplash.com/photo-1520769669658-f07657f5a307?w=800&auto=format&fit=crop' }], category: 'Arctic',      averageRating: 4.9, reviewCount: 72 },
    { _id: 'demo-23', title: 'Frozen Lake Retreat – Lapland',            price: 320, location: { city: 'Lapland',    country: 'Finland'     }, images: [{ url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop' }], category: 'Arctic',      averageRating: 4.8, reviewCount: 61 },
    { _id: 'demo-24', title: 'Ice Hotel Room – Jukkasjärvi',             price: 500, location: { city: 'Jukkasjärvi', country: 'Sweden'     }, images: [{ url: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800&auto=format&fit=crop' }], category: 'Arctic',      averageRating: 4.9, reviewCount: 44 },
    // ── Luxury (4) ───────────────────────────────────────────────────────────
    { _id: 'demo-25', title: 'Heritage Haveli – Jaipur',                 price: 135, location: { city: 'Jaipur',     country: 'India'       }, images: [{ url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&auto=format&fit=crop' }], category: 'Luxury',      averageRating: 4.9, reviewCount: 56 },
    { _id: 'demo-26', title: 'Private Pool Villa – Udaipur',             price: 350, location: { city: 'Udaipur',    country: 'India'       }, images: [{ url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop' }], category: 'Luxury',      averageRating: 4.9, reviewCount: 98 },
    { _id: 'demo-27', title: 'Palace Suite – Mysore',                    price: 280, location: { city: 'Mysore',     country: 'India'       }, images: [{ url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop' }], category: 'Luxury',      averageRating: 4.8, reviewCount: 43 },
    { _id: 'demo-28', title: 'Overwater Bungalow – Maldives',            price: 620, location: { city: 'Malé',       country: 'Maldives'    }, images: [{ url: 'https://images.unsplash.com/photo-1439130490301-25e322d88054?w=800&auto=format&fit=crop' }], category: 'Luxury',      averageRating: 5.0, reviewCount: 112 },
    // ── Cabin (4) ────────────────────────────────────────────────────────────
    { _id: 'demo-29', title: 'Cozy Pine Cabin – Manali',                 price:  95, location: { city: 'Manali',     country: 'India'       }, images: [{ url: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&auto=format&fit=crop' }], category: 'Cabin',       averageRating: 4.8, reviewCount: 32 },
    { _id: 'demo-30', title: 'Log Cabin by the River – Kasol',           price:  80, location: { city: 'Kasol',      country: 'India'       }, images: [{ url: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&auto=format&fit=crop' }], category: 'Cabin',       averageRating: 4.7, reviewCount: 24 },
    { _id: 'demo-31', title: 'Redwood Cabin – Kodaikanal',               price:  90, location: { city: 'Kodaikanal', country: 'India'       }, images: [{ url: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800&auto=format&fit=crop' }], category: 'Cabin',       averageRating: 4.6, reviewCount: 17 },
    { _id: 'demo-32', title: 'Mountain Cabin – Ooty',                    price:  70, location: { city: 'Ooty',       country: 'India'       }, images: [{ url: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800&auto=format&fit=crop' }], category: 'Cabin',       averageRating: 4.5, reviewCount: 20 },
    // ── Treehouse (4) ────────────────────────────────────────────────────────
    { _id: 'demo-33', title: 'Treehouse Retreat – Coorg',               price: 110, location: { city: 'Coorg',      country: 'India'       }, images: [{ url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop' }], category: 'Treehouse',   averageRating: 4.8, reviewCount: 17 },
    { _id: 'demo-34', title: 'Jungle Canopy Suite – Wayanad',            price: 125, location: { city: 'Wayanad',    country: 'India'       }, images: [{ url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop' }], category: 'Treehouse',   averageRating: 4.9, reviewCount: 39 },
    { _id: 'demo-35', title: 'Birds Eye Villa – Valparai',               price:  95, location: { city: 'Valparai',   country: 'India'       }, images: [{ url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop' }], category: 'Treehouse',   averageRating: 4.7, reviewCount: 26 },
    { _id: 'demo-36', title: 'Rainforest Escape – Kerala',               price: 100, location: { city: 'Thekkady',   country: 'India'       }, images: [{ url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop' }], category: 'Treehouse',   averageRating: 4.6, reviewCount: 14 },
    // ── Island (4) ───────────────────────────────────────────────────────────
    { _id: 'demo-37', title: 'Backwater Houseboat – Kerala',             price: 200, location: { city: 'Alleppey',   country: 'India'       }, images: [{ url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&auto=format&fit=crop' }], category: 'Island',      averageRating: 5.0, reviewCount: 63 },
    { _id: 'demo-38', title: 'Private Island Resort – Lakshadweep',      price: 480, location: { city: 'Lakshadweep', country: 'India'      }, images: [{ url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&auto=format&fit=crop' }], category: 'Island',      averageRating: 4.9, reviewCount: 77 },
    { _id: 'demo-39', title: 'Clifftop Villa – Santorini',               price: 550, location: { city: 'Santorini',  country: 'Greece'      }, images: [{ url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&auto=format&fit=crop' }], category: 'Island',      averageRating: 4.9, reviewCount: 134 },
    { _id: 'demo-40', title: 'Stilted Bungalow – Bali',                  price: 175, location: { city: 'Bali',       country: 'Indonesia'   }, images: [{ url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop' }], category: 'Island',      averageRating: 4.8, reviewCount: 91 },
];

const SkeletonCard = () => (
    <div className="rounded-2xl overflow-hidden">
        <div className="skeleton aspect-[4/3] rounded-2xl" />
        <div className="pt-3 space-y-2">
            <div className="skeleton h-4 w-3/4 rounded" />
            <div className="skeleton h-3 w-1/2 rounded" />
            <div className="skeleton h-4 w-1/3 rounded" />
        </div>
    </div>
);

const Home = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('');
    const [search, setSearch] = useState('');
    const [heroIdx, setHeroIdx] = useState(0);
    const [isDemo, setIsDemo] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showTop, setShowTop] = useState(false);

    // Show back-to-top after 400px scroll
    useEffect(() => {
        const onScroll = () => setShowTop(window.scrollY > 400);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Hero auto-rotate
    useEffect(() => {
        const timer = setInterval(() => setHeroIdx((p) => (p + 1) % HERO_IMAGES.length), 5000);
        return () => clearInterval(timer);
    }, []);

    const fetchListings = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page, limit: 12 };
            if (category) params.category = category;
            if (search) params.location = search;
            const { data } = await api.get('/listings', { params });
            const fetched = data.listings || [];
            const pages = Math.max(1, Math.ceil((data.total || 0) / 12));
            setTotalPages(pages);
            if (fetched.length === 0) {
                // No real listings – filter and show demo data
                const filtered = DEMO_LISTINGS.filter((l) => {
                    const matchCat = !category || l.category === category;
                    const matchSearch = !search || l.title.toLowerCase().includes(search.toLowerCase()) ||
                        l.location.city.toLowerCase().includes(search.toLowerCase()) ||
                        l.location.country.toLowerCase().includes(search.toLowerCase());
                    return matchCat && matchSearch;
                });
                setListings(filtered);
                setIsDemo(true);
                setTotalPages(1);
            } else {
                setListings(fetched);
                setIsDemo(false);
            }
        } catch {
            // Backend offline – filter demo data locally
            const filtered = DEMO_LISTINGS.filter((l) => {
                const matchCat = !category || l.category === category;
                const matchSearch = !search || l.title.toLowerCase().includes(search.toLowerCase()) ||
                    l.location.city.toLowerCase().includes(search.toLowerCase()) ||
                    l.location.country.toLowerCase().includes(search.toLowerCase());
                return matchCat && matchSearch;
            });
            setListings(filtered);
            setIsDemo(true);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    }, [category, search, page]);

    useEffect(() => { fetchListings(); }, [fetchListings]);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
            <Navbar onSearch={(val) => setSearch(val)} />

            {/* Hero Section */}
            {!search && !category && (
                <div className="relative h-[420px] overflow-hidden">
                    {HERO_IMAGES.map((img, i) => (
                        <img
                            key={i}
                            src={img}
                            alt="Hero"
                            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
                            style={{ opacity: i === heroIdx ? 1 : 0 }}
                        />
                    ))}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50" />
                    <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
                            Find your next<br />
                            <span style={{ color: '#FF385C' }}>perfect stay</span>
                        </h1>
                        <p className="text-white/90 text-lg mb-8 max-w-lg drop-shadow">
                            Discover unique places, curated experiences, and unforgettable memories.
                        </p>
                        {/* Mobile search */}
                        <form
                            onSubmit={(e) => { e.preventDefault(); const v = e.target.elements.q.value; setSearch(v); }}
                            className="flex md:hidden items-center gap-2 bg-white rounded-full px-4 py-3 shadow-xl w-full max-w-sm"
                        >
                            <input name="q" type="text" placeholder="Where to?" className="flex-1 bg-transparent outline-none text-sm font-medium text-gray-800 placeholder-gray-400" />
                            <button type="submit" className="w-9 h-9 rounded-full text-white flex items-center justify-center" style={{ background: '#FF385C' }}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </button>
                        </form>
                        {/* Dots indicator */}
                        <div className="flex gap-2 mt-6">
                            {HERO_IMAGES.map((_, i) => (
                                <button key={i} onClick={() => setHeroIdx(i)} className={`w-2 h-2 rounded-full transition-all ${i === heroIdx ? 'bg-white w-5' : 'bg-white/50'}`} />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <CategoryFilter selected={category} onChange={setCategory} />

            {/* Search result heading */}
            {(search || category) && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 flex items-center gap-3">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {search ? `Results for "${search}"` : `${category} stays`}
                    </h2>
                    <button
                        onClick={() => { setSearch(''); setCategory(''); setPage(1); }}
                        className="text-sm text-gray-500 underline hover:text-gray-700 dark:hover:text-gray-300"
                    >
                        Clear
                    </button>
                </div>
            )}

            {/* Demo banner */}
            {isDemo && !search && !category && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
                    <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                        <span className="text-xl">✨</span>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-amber-800">Showing demo properties</p>
                            <p className="text-xs text-amber-600">Connect your MongoDB Atlas database and run <code className="bg-amber-100 px-1 rounded">node seed.js</code> to load real listings.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Listings Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : listings.length === 0 ? (
                    <div className="text-center py-24">
                        <div className="text-6xl mb-4">🏡</div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">No listings found</h3>
                        <p className="text-gray-500 dark:text-gray-400">Try a different location or category</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {listings.map((listing) => (
                            <PropertyCard key={listing._id} listing={listing} />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {!isDemo && totalPages > 1 && (
                    <div className="flex items-center justify-center gap-3 mt-10">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                            Prev
                        </button>
                        <span className="text-sm text-gray-500 font-medium">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            Next
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-12">
                {/* Main columns */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-10">
                    {/* Col 1 – Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-full bg-[#FF385C] flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                            </div>
                            <span className="text-lg font-extrabold text-gray-900 dark:text-white tracking-tight">wanderlust</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-5">
                            Discover unique stays and experiences around the world. Your next adventure starts here.
                        </p>
                        {/* Social icons */}
                        <div className="flex items-center gap-3">
                            {[
                                { label: 'Instagram', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
                                { label: 'Twitter', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.732-8.848L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
                                { label: 'Facebook', path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
                                { label: 'YouTube', path: 'M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z' },
                            ].map(({ label, path }) => (
                                <a key={label} href="#" title={label}
                                    className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-[#FF385C] hover:text-white transition-all duration-200">
                                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d={path} /></svg>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Col 2 – Explore */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-900 dark:text-white mb-4">Explore</h4>
                        <ul className="space-y-2.5 text-sm text-gray-500 dark:text-gray-400">
                            {['Beach getaways', 'Mountain retreats', 'City stays', 'Countryside farms', 'Desert camps', 'Arctic cabins', 'Luxury villas', 'Treehouses'].map((l) => (
                                <li key={l}><a href="#" className="hover:text-[#FF385C] transition-colors">{l}</a></li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 3 – Hosting */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-900 dark:text-white mb-4">Hosting</h4>
                        <ul className="space-y-2.5 text-sm text-gray-500 dark:text-gray-400">
                            {['Host your home', 'Responsible hosting', 'Host resources', 'Community forum', 'Hosting tips'].map((l) => (
                                <li key={l}><a href="#" className="hover:text-[#FF385C] transition-colors">{l}</a></li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 4 – Support */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-900 dark:text-white mb-4">Support</h4>
                        <ul className="space-y-2.5 text-sm text-gray-500 dark:text-gray-400">
                            {['Help Center', 'Cancellation options', 'Trust & Safety', 'Contact us', 'Accessibility', 'Report a concern'].map((l) => (
                                <li key={l}><a href="#" className="hover:text-[#FF385C] transition-colors">{l}</a></li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom strip */}
                <div className="border-t border-gray-200 dark:border-gray-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-400 dark:text-gray-500">
                        <div className="flex flex-wrap items-center gap-4">
                            <span>© {new Date().getFullYear()} WanderLust, Inc. · All rights reserved.</span>
                            <span>·</span>
                            <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Privacy</a>
                            <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Terms</a>
                            <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Sitemap</a>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" /></svg>
                                English (IN)
                            </div>
                            <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                                <span>₹</span> INR
                            </div>
                            <span className="hidden md:inline">Made with ❤️ in India</span>
                        </div>
                    </div>
                </div>
            </footer>


            {/* Back to Top button */}
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                style={{
                    position: 'fixed', bottom: '2rem', right: '2rem',
                    opacity: showTop ? 1 : 0,
                    transform: showTop ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.9)',
                    pointerEvents: showTop ? 'auto' : 'none',
                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    zIndex: 50,
                }}
                className="w-11 h-11 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg flex items-center justify-center hover:bg-gray-700 dark:hover:bg-gray-100"
                title="Back to top"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                </svg>
            </button>
        </div>
    );
};

export default Home;
