import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';
import { useWishlist } from '../context/WishlistContext';

const Navbar = ({ onSearch }) => {
    const { user, logout } = useAuth();
    const { dark, toggle: toggleDark } = useDarkMode();
    const { wishlist } = useWishlist();
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const [wishlistOpen, setWishlistOpen] = useState(false);
    const wishlistRef = useRef(null);
    const menuRef = useRef(null);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wishlistRef.current && !wishlistRef.current.contains(e.target)) {
                setWishlistOpen(false);
            }
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (onSearch) onSearch(searchValue);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        setMenuOpen(false);
    };

    return (
        <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16 gap-4">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 shrink-0">
                        <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none">
                            <path d="M16 1C7.163 1 0 8.163 0 17c0 6.627 3.838 12.37 9.432 15.18L16 31l6.568 1.18C28.162 29.37 32 23.627 32 17 32 8.163 24.837 1 16 1z" fill="#FF385C" />
                            <path d="M16 6c-1.5 0-5 4-5 9s3.5 9 5 9 5-4 5-9-3.5-9-5-9z" fill="white" />
                        </svg>
                        <span className="text-xl font-bold" style={{ color: '#FF385C' }}>wanderlust</span>
                    </Link>

                    {/* Search bar – center */}
                    <form
                        onSubmit={handleSearch}
                        className="hidden md:flex items-center gap-2 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-full px-5 py-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex-1 max-w-md"
                    >
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder="Search destinations..."
                            className="flex-1 bg-transparent outline-none text-sm font-medium placeholder-gray-400 dark:text-gray-200 dark:placeholder-gray-500"
                        />
                        <button
                            type="submit"
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                            style={{ background: '#FF385C' }}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </form>

                    {/* Right actions */}
                    <div className="flex items-center gap-2 shrink-0">

                        {/* Dark mode toggle */}
                        <button
                            onClick={toggleDark}
                            title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
                            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            {dark ? (
                                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>

                        {/* Wishlist button */}
                        <div className="relative" ref={wishlistRef}>
                            <button
                                onClick={() => setWishlistOpen(!wishlistOpen)}
                                title="Wishlist"
                                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
                            >
                                <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill={wishlist.length > 0 ? '#FF385C' : 'none'} stroke={wishlist.length > 0 ? '#FF385C' : 'currentColor'} viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                {wishlist.length > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center" style={{ background: '#FF385C' }}>
                                        {wishlist.length}
                                    </span>
                                )}
                            </button>
                            {wishlistOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-3 z-50">
                                    <p className="px-4 pb-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Saved ({wishlist.length})</p>
                                    {wishlist.length === 0 ? (
                                        <p className="px-4 py-3 text-sm text-gray-400">No saved listings yet</p>
                                    ) : (
                                        <p className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300">
                                            {wishlist.length} listing{wishlist.length > 1 ? 's' : ''} saved ❤️
                                        </p>
                                    )}
                                    <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2 px-4">
                                        <button onClick={() => setWishlistOpen(false)} className="text-xs text-gray-400 hover:text-gray-600">Close</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {user ? (
                            <>
                                <Link
                                    to="/listings/new"
                                    className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-gray-200 px-4 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Host
                                </Link>
                                <div className="relative" ref={menuRef}>
                                    <button
                                        onClick={() => setMenuOpen(!menuOpen)}
                                        className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-full px-3 py-2 hover:shadow-md transition-shadow dark:bg-gray-800"
                                    >
                                        <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: '#FF385C' }}>
                                            {user.name?.charAt(0).toUpperCase()}
                                        </div>
                                    </button>
                                    {menuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-50">
                                            <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                                Profile
                                            </Link>
                                            <Link to="/listings/new" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>
                                                Add listing
                                            </Link>
                                            <div className="border-t border-gray-100 dark:border-gray-700 my-1" />
                                            <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium text-left">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                                Log out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-sm font-semibold text-gray-700 dark:text-gray-200 px-4 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                    Log in
                                </Link>
                                <Link to="/signup" className="text-sm font-semibold text-white px-4 py-2 rounded-full" style={{ background: '#FF385C' }}>
                                    Sign up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
