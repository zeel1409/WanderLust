import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import PropertyCard from '../components/PropertyCard';

const STATUS_STYLES = {
    confirmed: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    pending:   'bg-yellow-50 text-yellow-700 border border-yellow-200',
    cancelled: 'bg-red-50 text-red-400 border border-red-200',
};

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('listings');

    // My Listings
    const [listings, setListings] = useState([]);
    const [listingsLoading, setListingsLoading] = useState(true);

    // My Bookings
    const [bookings, setBookings] = useState([]);
    const [bookingsLoading, setBookingsLoading] = useState(false);
    const [cancellingId, setCancellingId] = useState(null);

    useEffect(() => {
        const fetchMyListings = async () => {
            try {
                const { data } = await api.get('/listings', { params: { hostId: user._id, limit: 100 } });
                setListings(data.listings || []);
            } catch {
                toast.error('Failed to load listings');
            } finally {
                setListingsLoading(false);
            }
        };
        fetchMyListings();
    }, [user]);

    useEffect(() => {
        if (activeTab !== 'bookings') return;
        const fetchMyBookings = async () => {
            setBookingsLoading(true);
            try {
                const { data } = await api.get('/bookings/my');
                setBookings(data.bookings || []);
            } catch {
                toast.error('Failed to load bookings');
            } finally {
                setBookingsLoading(false);
            }
        };
        fetchMyBookings();
    }, [activeTab]);

    const handleLogout = () => {
        logout();
        navigate('/');
        toast.success('Logged out');
    };

    const handleDeleteListing = async (listingId) => {
        if (!window.confirm('Delete this listing?')) return;
        try {
            await api.delete(`/listings/${listingId}`);
            setListings((p) => p.filter((l) => l._id !== listingId));
            toast.success('Listing deleted');
        } catch {
            toast.error('Failed to delete');
        }
    };

    const handleCancelBooking = async (bookingId) => {
        setCancellingId(bookingId);
        try {
            await api.delete(`/bookings/${bookingId}`);
            setBookings((prev) =>
                prev.map((b) => b._id === bookingId ? { ...b, status: 'cancelled' } : b)
            );
            toast.success('Booking cancelled');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Could not cancel booking');
        } finally {
            setCancellingId(null);
        }
    };

    const upcomingCount = bookings.filter(
        (b) => b.status === 'confirmed' && new Date(b.checkIn) >= new Date()
    ).length;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* ── Sidebar ── */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
                            <div
                                className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4"
                                style={{ background: 'linear-gradient(135deg,#FF385C,#E31C5F)' }}
                            >
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                            <p className="text-gray-500 text-sm mt-1">{user?.email}</p>

                            {/* Stats */}
                            <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3">
                                <div className="text-center">
                                    <p className="font-bold text-2xl text-gray-900">{listings.length}</p>
                                    <p className="text-gray-400 text-xs mt-0.5">Listings</p>
                                </div>
                                <div className="text-center">
                                    <p className="font-bold text-2xl text-gray-900">{upcomingCount}</p>
                                    <p className="text-gray-400 text-xs mt-0.5">Upcoming</p>
                                </div>
                            </div>

                            <Link to="/listings/new" className="btn-primary w-full block text-center mt-5">
                                + Add listing
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="w-full mt-3 border border-gray-200 rounded-lg py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Log out
                            </button>
                        </div>
                    </div>

                    {/* ── Main Content ── */}
                    <div className="md:col-span-2">

                        {/* Tab bar */}
                        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6">
                            {[
                                { key: 'listings', label: '🏡 My Listings' },
                                { key: 'bookings', label: '📅 My Bookings' },
                            ].map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                                        activeTab === tab.key
                                            ? 'bg-white text-gray-900 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* ── LISTINGS TAB ── */}
                        {activeTab === 'listings' && (
                            <>
                                <div className="flex items-center justify-between mb-5">
                                    <h3 className="text-xl font-bold text-gray-900">My Listings</h3>
                                    <Link to="/listings/new" className="text-sm font-semibold" style={{ color: '#FF385C' }}>
                                        + New listing
                                    </Link>
                                </div>

                                {listingsLoading ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className="rounded-2xl overflow-hidden">
                                                <div className="skeleton aspect-[4/3] rounded-2xl" />
                                                <div className="pt-3 space-y-2">
                                                    <div className="skeleton h-4 w-3/4 rounded" />
                                                    <div className="skeleton h-3 w-1/2 rounded" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : listings.length === 0 ? (
                                    <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                                        <div className="text-5xl mb-4">🏡</div>
                                        <h4 className="text-lg font-bold text-gray-800 mb-2">No listings yet</h4>
                                        <p className="text-gray-500 text-sm mb-6">Start hosting and earn extra income.</p>
                                        <Link to="/listings/new" className="btn-primary inline-block">Create your first listing</Link>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        {listings.map((listing) => (
                                            <div key={listing._id} className="relative">
                                                <PropertyCard listing={listing} />
                                                <div className="flex gap-2 mt-2">
                                                    <Link
                                                        to={`/listings/${listing._id}/edit`}
                                                        className="flex-1 text-center text-sm font-semibold border border-gray-200 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                                                    >Edit</Link>
                                                    <button
                                                        onClick={() => handleDeleteListing(listing._id)}
                                                        className="flex-1 text-sm font-semibold border border-red-200 text-red-500 py-2 rounded-lg hover:bg-red-50 transition-colors"
                                                    >Delete</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}

                        {/* ── BOOKINGS TAB ── */}
                        {activeTab === 'bookings' && (
                            <>
                                <div className="flex items-center justify-between mb-5">
                                    <h3 className="text-xl font-bold text-gray-900">My Bookings</h3>
                                    {bookings.length > 0 && (
                                        <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                            {bookings.length} total
                                        </span>
                                    )}
                                </div>

                                {bookingsLoading ? (
                                    <div className="space-y-4">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="bg-white rounded-2xl p-4 flex gap-4 border border-gray-100">
                                                <div className="skeleton w-20 h-16 rounded-xl shrink-0" />
                                                <div className="flex-1 space-y-2">
                                                    <div className="skeleton h-4 w-2/3 rounded" />
                                                    <div className="skeleton h-3 w-1/2 rounded" />
                                                    <div className="skeleton h-3 w-1/4 rounded" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : bookings.length === 0 ? (
                                    <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                                        <div className="text-5xl mb-4">🗓️</div>
                                        <h4 className="text-lg font-bold text-gray-800 mb-2">No bookings yet</h4>
                                        <p className="text-gray-500 text-sm mb-6">Explore amazing places and book your next stay.</p>
                                        <Link to="/" className="btn-primary inline-block">Explore listings</Link>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {bookings.map((b) => {
                                            const isUpcoming = b.status === 'confirmed' && new Date(b.checkIn) >= new Date();
                                            const isPast = b.status === 'confirmed' && new Date(b.checkOut) < new Date();
                                            return (
                                                <div
                                                    key={b._id}
                                                    className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-4 items-start hover:shadow-md transition-shadow"
                                                >
                                                    <Link to={`/listings/${b.listing?._id}`} className="shrink-0">
                                                        <img
                                                            src={b.listing?.images?.[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200&auto=format&fit=crop'}
                                                            alt={b.listing?.title}
                                                            className="w-20 h-16 object-cover rounded-xl"
                                                        />
                                                    </Link>

                                                    <div className="flex-1 min-w-0">
                                                        <Link to={`/listings/${b.listing?._id}`}>
                                                            <p className="font-bold text-gray-900 truncate hover:underline">{b.listing?.title}</p>
                                                        </Link>
                                                        <p className="text-xs text-gray-500 mt-0.5">
                                                            {b.listing?.location?.city}, {b.listing?.location?.country}
                                                        </p>
                                                        <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                                                            <span>📅 {new Date(b.checkIn).toLocaleDateString('en-US',{month:'short',day:'numeric'})} → {new Date(b.checkOut).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</span>
                                                            <span>👤 {b.guests} guest{b.guests !== 1 ? 's' : ''}</span>
                                                            <span>🌙 {b.nights} night{b.nights !== 1 ? 's' : ''}</span>
                                                        </div>
                                                        <p className="text-sm font-bold text-gray-900 mt-1.5">${b.totalPrice} total</p>
                                                    </div>

                                                    <div className="shrink-0 flex flex-col items-end gap-2">
                                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[b.status] || ''}`}>
                                                            {b.status === 'confirmed' && isUpcoming ? 'Upcoming' :
                                                             b.status === 'confirmed' && isPast ? 'Completed' :
                                                             b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                                                        </span>
                                                        {b.status === 'confirmed' && isUpcoming && (
                                                            <button
                                                                onClick={() => handleCancelBooking(b._id)}
                                                                disabled={cancellingId === b._id}
                                                                className="text-xs text-red-400 hover:text-red-600 font-semibold disabled:opacity-50"
                                                            >
                                                                {cancellingId === b._id ? 'Cancelling…' : 'Cancel'}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
