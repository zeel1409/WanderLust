const StarRating = ({ rating = 0, size = 'sm', interactive = false, onRate }) => {
    const stars = [1, 2, 3, 4, 5];
    const sizeClass = size === 'lg' ? 'w-7 h-7' : size === 'md' ? 'w-5 h-5' : 'w-4 h-4';

    return (
        <div className="flex items-center gap-0.5">
            {stars.map((star) => (
                <button
                    key={star}
                    type={interactive ? 'button' : 'button'}
                    onClick={() => interactive && onRate && onRate(star)}
                    className={`${sizeClass} ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
                    style={{ background: 'none', border: 'none', padding: 0 }}
                    disabled={!interactive}
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill={star <= Math.round(rating) ? '#FF385C' : 'none'}
                        stroke={star <= Math.round(rating) ? '#FF385C' : '#d1d5db'}
                        strokeWidth="1.5"
                        className="w-full h-full"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                        />
                    </svg>
                </button>
            ))}
        </div>
    );
};

export default StarRating;
