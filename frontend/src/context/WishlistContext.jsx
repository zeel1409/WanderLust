import { createContext, useContext, useEffect, useState } from 'react';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('wl-wishlist') || '[]');
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('wl-wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const toggle = (id) => {
        setWishlist((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const isWishlisted = (id) => wishlist.includes(id);

    return (
        <WishlistContext.Provider value={{ wishlist, toggle, isWishlisted }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);
