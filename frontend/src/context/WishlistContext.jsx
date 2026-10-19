/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from 'react';
import { toast } from 'react-hot-toast';
import { useLocalStorage } from '../hooks/useLocalStorage';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useLocalStorage('wl-wishlist', []);

    const toggle = (id) => {
        setWishlist((prev) => {
            const isAdding = !prev.includes(id);
            if (isAdding) {
                toast.success('Saved to wishlist ♥️', { duration: 2000 });
                return [...prev, id];
            } else {
                toast('Removed from wishlist', { icon: '🗑️', duration: 2000 });
                return prev.filter((x) => x !== id);
            }
        });
    };

    const isWishlisted = (id) => wishlist.includes(id);

    return (
        <WishlistContext.Provider value={{ wishlist, toggle, isWishlisted }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);
