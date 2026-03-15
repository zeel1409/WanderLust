import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';

const CATEGORY_ICONS = {
    Beach: '🏖️', Mountains: '🏔️', City: '🏙️', Countryside: '🌾',
    Desert: '🏜️', Arctic: '🧊', Luxury: '✨', Cabin: '🏕️',
    Treehouse: '🌳', Island: '🏝️',
};

const PropertyCard = ({ listing }) => {
    const [imgIdx, setImgIdx] = useState(0);
    const { toggle: toggleWishlist, isWishlisted } = useWishlist();
    const liked = isWishlisted(listing._id);
    const images = listing.images?.length > 0 ? listing.images : [{ url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop' }];

    const nextImg = (e) => { e.preventDefault(); setImgIdx((p) => (p + 1) % images.length); };
    const prevImg = (e) => { e.preventDefault(); setImgIdx((p) => (p - 1 + images.length) % images.length); };

    return (
        <Link to={`/listings/${listing._id}`} className="group block">
            <div className="card-hover rounded-2xl overflow-hidden bg-white dark:bg-gray-800 transition-colors duration-300">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-700">
                    <img
                        src={images[imgIdx]?.url}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop'; }}
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

                    {/* Category badge */}
                    <div className="absolute top-3 left-3">
                        <span className="bg-white/90 backdrop-blur-sm text-xs font-medium px-2.5 py-1 rounded-full text-gray-700">
                            {CATEGORY_ICONS[listing.category] || '🏠'} {listing.category}
                        </span>
                    </div>

                    {/* Wishlist button */}
                    <button
                        onClick={(e) => { e.preventDefault(); toggleWishlist(listing._id); }}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-125 active:scale-95"
                        style={{ background: liked ? 'rgba(255,56,92,0.15)' : 'rgba(0,0,0,0.35)' }}
                        title={liked ? 'Remove from wishlist' : 'Save to wishlist'}
                    >
                        <svg className="w-4.5 h-4.5" fill={liked ? '#FF385C' : 'none'} stroke={liked ? '#FF385C' : 'white'} viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>

                    {/* Image navigation (only if multiple images) */}
                    {images.length > 1 && (
                        <>
                            <button onClick={prevImg} className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-gray-800 shadow-sm hover:bg-white">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            <button onClick={nextImg} className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-gray-800 shadow-sm hover:bg-white">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                            </button>
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                                {images.map((_, i) => (
                                    <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === imgIdx ? 'bg-white' : 'bg-white/50'}`} />
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Info */}
                <div className="pt-3 pb-1 px-0.5">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate">{listing.title}</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5 truncate">{listing.location?.city}, {listing.location?.country}</p>
                        </div>
                        {listing.reviewCount > 0 && (
                            <div className="flex items-center gap-1 shrink-0">
                                <svg className="w-3.5 h-3.5" fill="#FF385C" viewBox="0 0 24 24"><path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
                                <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">{Number(listing.averageRating || 0).toFixed(1)}</span>
                                <span className="text-xs text-gray-400">({listing.reviewCount})</span>
                            </div>
                        )}
                    </div>
                    <div className="mt-2">
                        <span className="font-bold text-gray-900 dark:text-gray-100">${listing.price}</span>
                        <span className="text-gray-500 dark:text-gray-400 text-sm font-normal"> / night</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default PropertyCard;
