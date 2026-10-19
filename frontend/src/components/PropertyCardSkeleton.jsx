
 
//   Matches the exact shape/size of PropertyCard so the layout
//   doesn't jump when real data loads in.
 
const PropertyCardSkeleton = () => (
    <div style={{
        borderRadius: '16px',
        overflow: 'hidden',
        background: 'white',
    }}>
        {/* Image placeholder — same 4:3 ratio as real card */}
        <div
            className="skeleton"
            style={{ aspectRatio: '4/3', width: '100%', borderRadius: '0' }}
        />

        {/* Info rows */}
        <div style={{ padding: '12px 4px 4px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Title + rating row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Title */}
                <div className="skeleton" style={{ height: '14px', width: '65%', borderRadius: '6px' }} />
                {/* Rating badge */}
                <div className="skeleton" style={{ height: '14px', width: '12%', borderRadius: '6px' }} />
            </div>

            {/* Location subtitle */}
            <div className="skeleton" style={{ height: '12px', width: '45%', borderRadius: '6px' }} />

            {/* Price */}
            <div className="skeleton" style={{ height: '14px', width: '30%', borderRadius: '6px', marginTop: '4px' }} />
        </div>
    </div>
);

export default PropertyCardSkeleton;
