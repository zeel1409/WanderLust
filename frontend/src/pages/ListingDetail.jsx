import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import StarRating from '../components/StarRating';
import MapView from '../components/MapView';
import WeatherWidget from '../components/WeatherWidget';

const AMENITY_ICONS = {
    WiFi: '📶', Kitchen: '🍳', Pool: '🏊', Parking: '🚗', AC: '❄️',
    Gym: '💪', TV: '📺', Washer: '🧺', Dryer: '🌀', Fireplace: '🔥',
    'Hot tub': '♨️', Balcony: '🌅', Garden: '🌿', 'Pet friendly': '🐾',
};

const ReviewCard = ({ review, currentUserId, onDelete }) => (
    <div className="py-5 border-b border-gray-100 last:border-0">
        <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ background: '#FF385C' }}>
                {review.author?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <p className="font-semibold text-gray-900 text-sm">{review.author?.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                            <StarRating rating={review.rating} size="sm" />
                            <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                        </div>
                    </div>
                    {currentUserId === review.author?._id && (
                        <button onClick={() => onDelete(review._id)} className="text-xs text-red-400 hover:text-red-600 font-medium">Delete</button>
                    )}
                </div>
                <p className="text-gray-600 text-sm mt-2 leading-relaxed">{review.comment}</p>
            </div>
        </div>
    </div>
);

const ListingDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAllPhotos, setShowAllPhotos] = useState(false);
    const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
    const [submitting, setSubmitting] = useState(false);
    const [nights, setNights] = useState(5);

    const isOwner = user && listing && listing.host?._id === user._id;

    const fetchListing = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/listings/${id}`);
            setListing(data.listing);
        } catch {
            toast.error('Listing not found');
            navigate('/');
        } finally {
            setLoading(false);
        }
    }, [id, navigate]);

    useEffect(() => { fetchListing(); }, [fetchListing]);

    const handleDelete = async () => {
        if (!window.confirm('Delete this listing? This cannot be undone.')) return;
        try {
            await api.delete(`/listings/${id}`);
            toast.success('Listing deleted');
            navigate('/');
        } catch {
            toast.error('Failed to delete');
        }
    };

    const submitReview = async (e) => {
        e.preventDefault();
        if (reviewForm.rating === 0) { toast.error('Please select a rating'); return; }
        setSubmitting(true);
        try {
            await api.post(`/listings/${id}/reviews`, reviewForm);
            toast.success('Review posted! ⭐');
            setReviewForm({ rating: 0, comment: '' });
            fetchListing();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Could not post review');
        } finally {
            setSubmitting(false);
        }
    };

    const deleteReview = async (reviewId) => {
        if (!window.confirm('Delete this review?')) return;
        try {
            await api.delete(`/listings/${id}/reviews/${reviewId}`);
            toast.success('Review deleted');
            fetchListing();
        } catch {
            toast.error('Failed to delete review');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
                    <div className="skeleton h-8 w-1/2 rounded" />
                    <div className="skeleton h-96 rounded-2xl" />
                    <div className="grid grid-cols-2 gap-6">
                        <div className="skeleton h-48 rounded" />
                        <div className="skeleton h-48 rounded" />
                    </div>
                </div>
            </div>
        );
    }

    if (!listing) return null;

    const images = listing.images?.length > 0 ? listing.images : [{ url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&auto=format&fit=crop' }];

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">{listing.title}</h1>
                        <div className="flex items-center flex-wrap gap-3 mt-1.5 text-sm text-gray-600">
                            {listing.reviewCount > 0 && (
                                <button
                                    onClick={() => document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="flex items-center gap-1 hover:underline cursor-pointer"
                                >
                                    <svg className="w-4 h-4" fill="#FF385C" viewBox="0 0 24 24"><path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
                                    <span className="font-semibold">{Number(listing.averageRating).toFixed(1)}</span>
                                    <span className="text-gray-400 underline">({listing.reviewCount} reviews)</span>
                                </button>
                            )}
                            <span className="text-gray-400">·</span>
                            <span>{listing.location?.city}, {listing.location?.country}</span>
                        </div>
                    </div>
                    {isOwner && (
                        <div className="flex gap-2 shrink-0">
                            <Link to={`/listings/${id}/edit`} className="text-sm font-semibold border border-gray-200 px-4 py-2 rounded-full hover:bg-gray-50">Edit</Link>
                            <button onClick={handleDelete} className="text-sm font-semibold border border-red-200 text-red-500 px-4 py-2 rounded-full hover:bg-red-50">Delete</button>
                        </div>
                    )}
                </div>

                {/* Photo Grid */}
                <div className="relative rounded-2xl overflow-hidden mb-8">
                    {images.length === 1 ? (
                        <img src={images[0].url} alt={listing.title} className="w-full h-96 object-cover" />
                    ) : (
                        <div className="grid grid-cols-4 grid-rows-2 gap-2 h-96">
                            <div className="col-span-2 row-span-2">
                                <img src={images[0]?.url} alt="" className="w-full h-full object-cover" />
                            </div>
                            {images.slice(1, 5).map((img, i) => (
                                <div key={i} className="relative overflow-hidden">
                                    <img src={img.url} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                                    {i === 3 && images.length > 5 && (
                                        <button onClick={() => setShowAllPhotos(true)} className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-semibold text-sm">
                                            +{images.length - 5} more
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                    <button onClick={() => setShowAllPhotos(true)} className="absolute bottom-4 right-4 bg-white text-gray-800 text-sm font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-gray-50 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                        Show all photos
                    </button>
                </div>

                {/* Photo modal */}
                {showAllPhotos && (
                    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col overflow-y-auto">
                        <button onClick={() => setShowAllPhotos(false)} className="sticky top-4 self-start ml-4 z-10 bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center shadow-lg">✕</button>
                        <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
                            {images.map((img, i) => (
                                <img key={i} src={img.url} alt="" className="w-full rounded-xl" />
                            ))}
                        </div>
                    </div>
                )}

                {/* Main layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Host & details */}
                        <div className="flex items-start justify-between gap-4 pb-8 border-b border-gray-100">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    Hosted by {listing.host?.name}
                                </h2>
                                <p className="text-gray-500 mt-1 text-sm">
                                    {listing.maxGuests} guests · {listing.bedrooms} bedroom{listing.bedrooms !== 1 ? 's' : ''} · {listing.bathrooms} bath{listing.bathrooms !== 1 ? 's' : ''}
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold shrink-0" style={{ background: '#FF385C' }}>
                                {listing.host?.name?.charAt(0).toUpperCase()}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="pb-8 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-3">About this place</h3>
                            <p className="text-gray-600 leading-relaxed">{listing.description}</p>
                        </div>

                        {/* Amenities */}
                        {listing.amenities?.length > 0 && (
                            <div className="pb-8 border-b border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">What this place offers</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {listing.amenities.map((a) => (
                                        <div key={a} className="flex items-center gap-3 text-gray-700">
                                            <span className="text-xl">{AMENITY_ICONS[a] || '✔️'}</span>
                                            <span className="text-sm font-medium">{a}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Map */}
                        <div className="pb-8 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Where you'll be</h3>
                            <p className="text-gray-500 text-sm mb-4">{listing.location?.address}, {listing.location?.city}, {listing.location?.country}</p>
                            <div className="h-72 rounded-2xl overflow-hidden">
                                <MapView coordinates={listing.location?.coordinates} zoom={13} />
                            </div>
                        </div>

                        {/* Reviews */}
                        <div id="reviews">
                            <div className="flex items-center gap-3 mb-6">
                                <h3 className="text-lg font-bold text-gray-900">Reviews</h3>
                                {listing.reviewCount > 0 && (
                                    <div className="flex items-center gap-2">
                                        <StarRating rating={listing.averageRating} size="sm" />
                                        <span className="text-sm font-semibold text-gray-700">{Number(listing.averageRating).toFixed(1)}</span>
                                        <span className="text-sm text-gray-400">({listing.reviewCount})</span>
                                    </div>
                                )}
                            </div>

                            {listing.reviews?.length === 0 ? (
                                <div className="text-center py-8 text-gray-400">
                                    <div className="text-4xl mb-2">⭐</div>
                                    <p className="font-medium">No reviews yet</p>
                                    <p className="text-sm">Be the first to share your experience!</p>
                                </div>
                            ) : (
                                <div>
                                    {listing.reviews?.map((r) => (
                                        <ReviewCard key={r._id} review={r} currentUserId={user?._id} onDelete={deleteReview} />
                                    ))}
                                </div>
                            )}

                            {/* Review form */}
                            {user && !isOwner && (
                                <form onSubmit={submitReview} className="mt-8 p-5 rounded-2xl border border-gray-100 bg-gray-50">
                                    <h4 className="font-bold text-gray-900 mb-4">Leave a review</h4>
                                    <div className="mb-4">
                                        <p className="text-sm text-gray-600 mb-2 font-medium">Your rating</p>
                                        <StarRating rating={reviewForm.rating} size="lg" interactive onRate={(r) => setReviewForm((p) => ({ ...p, rating: r }))} />
                                    </div>
                                    <textarea
                                        value={reviewForm.comment}
                                        onChange={(e) => setReviewForm((p) => ({ ...p, comment: e.target.value }))}
                                        className="input-field resize-none"
                                        rows={3}
                                        placeholder="Share your experience..."
                                        required
                                    />
                                    <button type="submit" disabled={submitting} className="btn-primary mt-3">
                                        {submitting ? 'Posting...' : 'Post review'}
                                    </button>
                                </form>
                            )}
                            {!user && (
                                <div className="mt-6 p-4 rounded-xl border border-gray-100 bg-gray-50 text-center">
                                    <p className="text-gray-600 text-sm"><Link to="/login" className="font-semibold" style={{ color: '#FF385C' }}>Log in</Link> to leave a review.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Booking widget + Weather */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-5">
                            {/* Booking card */}
                            <div className="rounded-2xl border border-gray-200 shadow-xl p-6">
                                <div className="flex items-end gap-1 mb-5">
                                    <span className="text-2xl font-extrabold text-gray-900">${listing.price}</span>
                                    <span className="text-gray-500 text-sm mb-0.5">/ night</span>
                                </div>

                                <div className="rounded-xl border border-gray-200 overflow-hidden mb-4">
                                    <div className="grid grid-cols-2 divide-x divide-gray-200">
                                        <div className="p-3">
                                            <p className="text-xs font-bold text-gray-800 uppercase tracking-wider">Check-in</p>
                                            <p className="text-sm text-gray-500 mt-1">Add date</p>
                                        </div>
                                        <div className="p-3">
                                            <p className="text-xs font-bold text-gray-800 uppercase tracking-wider">Checkout</p>
                                            <p className="text-sm text-gray-500 mt-1">Add date</p>
                                        </div>
                                    </div>
                                    <div className="border-t border-gray-200 p-3">
                                        <p className="text-xs font-bold text-gray-800 uppercase tracking-wider">Guests</p>
                                        <div className="flex items-center justify-between mt-1">
                                            <p className="text-sm text-gray-500">{nights > 1 ? nights : 1} guest{nights > 1 ? 's' : ''}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Nights selector */}
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-sm text-gray-600">Nights</p>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => setNights((n) => Math.max(1, n - 1))} className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-500">–</button>
                                        <span className="text-sm font-semibold w-5 text-center">{nights}</span>
                                        <button onClick={() => setNights((n) => n + 1)} className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-500">+</button>
                                    </div>
                                </div>

                                {user ? (
                                    <button
                                        onClick={() => toast.success('Booking feature coming soon! 🎉')}
                                        className="btn-primary w-full text-center"
                                    >
                                        Reserve
                                    </button>
                                ) : (
                                    <Link to="/login" className="btn-primary w-full text-center block">
                                        Log in to reserve
                                    </Link>
                                )}

                                <p className="text-center text-xs text-gray-400 mt-3">You won't be charged yet</p>

                                {nights > 0 && (
                                    <div className="mt-5 space-y-2 border-t border-gray-100 pt-4">
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>${listing.price} × {nights} night{nights > 1 ? 's' : ''}</span>
                                            <span>${listing.price * nights}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>Cleaning fee</span>
                                            <span>$30</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>Service fee</span>
                                            <span>${Math.round(listing.price * nights * 0.12)}</span>
                                        </div>
                                        <div className="flex justify-between font-bold text-gray-900 pt-3 border-t border-gray-100">
                                            <span>Total</span>
                                            <span>${listing.price * nights + 30 + Math.round(listing.price * nights * 0.12)}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Weather Widget */}
                            <div className="rounded-2xl border border-gray-100 p-4 bg-gray-50">
                                <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                    🌤️ Weather in {listing.location?.city}
                                </h4>
                                <WeatherWidget city={listing.location?.city} country={listing.location?.country} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListingDetail;
