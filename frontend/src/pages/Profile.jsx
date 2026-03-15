import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import PropertyCard from '../components/PropertyCard';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyListings = async () => {
            try {
                // Fetch all listings then filter by host
                const { data } = await api.get('/listings', { params: { limit: 100 } });
                const mine = data.listings.filter((l) => l.host?._id === user._id);
                setListings(mine);
            } catch {
                toast.error('Failed to load listings');
            } finally {
                setLoading(false);
            }
        };
        fetchMyListings();
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/');
        toast.success('Logged out');
    };

    const handleDelete = async (listingId) => {
        if (!window.confirm('Delete this listing?')) return;
        try {
            await api.delete(`/listings/${listingId}`);
            setListings((p) => p.filter((l) => l._id !== listingId));
            toast.success('Listing deleted');
        } catch {
            toast.error('Failed to delete');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Sidebar */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
                            <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4" style={{ background: '#FF385C' }}>
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                            <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
                            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-center gap-4 text-sm text-gray-600">
                                <div className="text-center">
                                    <p className="font-bold text-xl text-gray-900">{listings.length}</p>
                                    <p className="text-gray-400">Listings</p>
                                </div>
                            </div>
                            <Link
                                to="/listings/new"
                                className="btn-primary w-full block text-center mt-5"
                            >
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

                    {/* Listings */}
                    <div className="md:col-span-2">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">My Listings</h3>
                            <Link to="/listings/new" className="text-sm font-semibold" style={{ color: '#FF385C' }}>
                                + New listing
                            </Link>
                        </div>

                        {loading ? (
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
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(listing._id)}
                                                className="flex-1 text-sm font-semibold border border-red-200 text-red-500 py-2 rounded-lg hover:bg-red-50 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
