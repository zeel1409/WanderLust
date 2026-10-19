import { useState, useEffect, useCallback } from 'react';


//   useLocalStorage
//   Drop-in replacement for useState that automatically syncs
//   the value to localStorage so it persists across page refreshes.

export function useLocalStorage(key, initial) {
    const [value, setValue] = useState(() => {
        try {
            const stored = localStorage.getItem(key);
            return stored !== null ? JSON.parse(stored) : initial;
        } catch {
            return initial;
        }
    });

    // Sync to localStorage whenever value changes
    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch {
            // quota exceeded or private browsing — fail silently
        }
    }, [key, value]);

    // Also listen for changes from other tabs / windows
    useEffect(() => {
        const onStorage = (e) => {
            if (e.key === key) {
                try {
                    setValue(e.newValue !== null ? JSON.parse(e.newValue) : initial);
                } catch {
                    setValue(initial);
                }
            }
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, [key, initial]);

    // Stable setter — mirrors useState's functional update support
    const set = useCallback((updater) => {
        setValue((prev) =>
            typeof updater === 'function' ? updater(prev) : updater
        );
    }, []);

    return [value, set];
}
