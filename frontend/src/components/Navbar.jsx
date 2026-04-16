import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';
import { useWishlist } from '../context/WishlistContext';

// TODO: close dropdown on Escape key press
const Navbar = ({ onSearch }) => {
    const { user, logout } = useAuth();
    const { dark, toggle: toggleDark } = useDarkMode();
    const { wishlist } = useWishlist();
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
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
        <nav className="navbar">
            <div className="navbar-inner">
                {/* Logo */}
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', flexShrink: 0 }}>
                    <svg viewBox="0 0 32 32" style={{ width: '32px', height: '32px' }} fill="none">
                        <path d="M16 1C7.163 1 0 8.163 0 17c0 6.627 3.838 12.37 9.432 15.18L16 31l6.568 1.18C28.162 29.37 32 23.627 32 17 32 8.163 24.837 1 16 1z" fill="#FF385C" />
                        <path d="M16 6c-1.5 0-5 4-5 9s3.5 9 5 9 5-4 5-9-3.5-9-5-9z" fill="white" />
                    </svg>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FF385C' }}>wanderlust</span>
                </Link>

                {/* search bar */}
                <form onSubmit={handleSearch} className="search-bar" style={{ flex: 1, maxWidth: '400px' }}>
                    <input
                        type="text"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="Search destinations..."
                        className="search-input"
                    />
                    <button type="submit" className="search-btn">
                        <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                </form>

                {/* right side actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>

                    {/* dark mode */}
                    <button
                        onClick={toggleDark}
                        title="Toggle dark mode"
                        style={{
                            width: '36px', height: '36px', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: 'none', border: 'none', cursor: 'pointer'
                        }}
                    >
                        {dark ? (
                            <svg style={{ width: '20px', height: '20px', color: '#facc15' }} fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                            </svg>
                        ) : (
                            <svg style={{ width: '20px', height: '20px', color: '#6b7280' }} fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
                            </svg>
                        )}
                    </button>

                    {user ? (
                        <>
                            <Link
                                to="/listings/new"
                                style={{
                                    fontSize: '0.875rem', fontWeight: 600,
                                    color: '#374151', textDecoration: 'none',
                                    padding: '8px 16px', borderRadius: '9999px',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                + Host
                            </Link>
                            <div style={{ position: 'relative' }} ref={menuRef}>
                                <button
                                    onClick={() => setMenuOpen(!menuOpen)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '8px',
                                        border: '1px solid #e5e7eb', borderRadius: '9999px',
                                        padding: '8px 12px', background: 'white', cursor: 'pointer'
                                    }}
                                >
                                    <svg style={{ width: '20px', height: '20px', color: '#374151' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                    <div style={{
                                        width: '28px', height: '28px', borderRadius: '50%',
                                        background: '#FF385C', color: 'white',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '0.75rem', fontWeight: 700
                                    }}>
                                        {user.name?.charAt(0).toUpperCase()}
                                    </div>
                                </button>
                                {menuOpen && (
                                    <div style={{
                                        position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                                        width: '192px', background: 'white',
                                        borderRadius: '12px', boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
                                        border: '1px solid #f3f4f6', padding: '8px 0',
                                        zIndex: 100
                                    }}>
                                        <Link
                                            to="/profile"
                                            onClick={() => setMenuOpen(false)}
                                            style={{ display: 'block', padding: '10px 16px', fontSize: '0.875rem', color: '#374151', textDecoration: 'none', fontWeight: 500 }}
                                        >
                                            Profile
                                        </Link>
                                        <Link
                                            to="/listings/new"
                                            onClick={() => setMenuOpen(false)}
                                            style={{ display: 'block', padding: '10px 16px', fontSize: '0.875rem', color: '#374151', textDecoration: 'none', fontWeight: 500 }}
                                        >
                                            Add listing
                                        </Link>
                                        {wishlist.length > 0 && (
                                            <p style={{ padding: '4px 16px', fontSize: '0.75rem', color: '#9ca3af' }}>
                                                {wishlist.length} saved
                                            </p>
                                        )}
                                        <div style={{ borderTop: '1px solid #f3f4f6', margin: '4px 0' }} />
                                        <button
                                            onClick={handleLogout}
                                            style={{
                                                display: 'block', width: '100%', textAlign: 'left',
                                                padding: '10px 16px', fontSize: '0.875rem',
                                                color: '#ef4444', background: 'none', border: 'none',
                                                cursor: 'pointer', fontWeight: 500, fontFamily: 'inherit'
                                            }}
                                        >
                                            Log out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', textDecoration: 'none', padding: '8px 16px' }}>
                                Log in
                            </Link>
                            <Link to="/signup" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'white', background: '#FF385C', padding: '8px 16px', borderRadius: '9999px', textDecoration: 'none' }}>
                                Sign up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
