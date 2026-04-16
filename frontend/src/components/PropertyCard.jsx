import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useWishlist } from '../context/WishlistContext';

const PropertyCard = ({ listing }) => {
    const { toggle: toggleWishlist, isWishlisted } = useWishlist();
    const liked = isWishlisted(listing._id);
    const isDemo = listing._id?.startsWith('demo-');

    // just use first image for now
    // TODO: maybe add a simple image gallery later
    const imgUrl = listing.images?.[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop';

    const cardContent = (
        <div className="property-card">
            <div className="property-img-wrap">
                <img
                    src={imgUrl}
                    alt={listing.title}
                    onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop';
                    }}
                />

                {/* category label */}
                {listing.category && (
                    <span style={{
                        position: 'absolute', top: '10px', left: '10px',
                        background: 'rgba(255,255,255,0.92)', borderRadius: '9999px',
                        padding: '3px 10px', fontSize: '0.75rem', fontWeight: 500, color: '#374151'
                    }}>
                        {listing.category}
                    </span>
                )}

                {/* demo badge */}
                {isDemo && (
                    <span style={{
                        position: 'absolute', bottom: '10px', left: '10px',
                        background: 'rgba(0,0,0,0.55)', borderRadius: '6px',
                        padding: '2px 8px', fontSize: '0.7rem', fontWeight: 600, color: 'white',
                        letterSpacing: '0.02em'
                    }}>
                        Demo
                    </span>
                )}

                {/* wishlist heart */}
                <button
                    onClick={(e) => { e.preventDefault(); toggleWishlist(listing._id); }}
                    style={{
                        position: 'absolute', top: '10px', right: '10px',
                        width: '32px', height: '32px', borderRadius: '50%',
                        background: liked ? 'rgba(255,56,92,0.15)' : 'rgba(0,0,0,0.3)',
                        border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                >
                    <svg
                        style={{ width: '16px', height: '16px' }}
                        fill={liked ? '#FF385C' : 'none'}
                        stroke={liked ? '#FF385C' : 'white'}
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
            </div>

            <div className="property-info">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{
                            margin: 0, fontSize: '0.9rem', fontWeight: 600,
                            color: '#111827', whiteSpace: 'nowrap',
                            overflow: 'hidden', textOverflow: 'ellipsis'
                        }}>
                            {listing.title}
                        </h3>
                        <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#6b7280' }}>
                            {listing.location?.city}, {listing.location?.country}
                        </p>
                    </div>
                    {listing.reviewCount > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0 }}>
                            <svg style={{ width: '13px', height: '13px' }} fill="#FF385C" viewBox="0 0 24 24">
                                <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                            </svg>
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#111827' }}>
                                {Number(listing.averageRating || 0).toFixed(1)}
                            </span>
                        </div>
                    )}
                </div>
                <div style={{ marginTop: '8px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#111827' }}>${listing.price}</span>
                    <span style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 400 }}> / night</span>
                </div>
            </div>
        </div>
    );

    // demo listings don't exist in DB, so clicking would show "not found"
    // just show a message instead of navigating
    if (isDemo) {
        return (
            <div
                style={{ textDecoration: 'none', color: 'inherit', display: 'block', cursor: 'pointer' }}
                onClick={() => toast('Connect your database and run node seed.js to view full listing details.', { icon: '💡' })}
            >
                {cardContent}
            </div>
        );
    }

    return (
        <Link to={`/listings/${listing._id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
            {cardContent}
        </Link>
    );
};

export default PropertyCard;
