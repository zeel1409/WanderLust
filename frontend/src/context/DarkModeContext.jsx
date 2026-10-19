/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
    const [dark, setDark] = useLocalStorage('wl-dark', false);

    // Apply / remove the 'dark' class on <html> whenever dark changes
    useEffect(() => {
        document.documentElement.classList.toggle('dark', dark);
    }, [dark]);

    const toggle = () => setDark((d) => !d);

    return (
        <DarkModeContext.Provider value={{ dark, toggle }}>
            {children}
        </DarkModeContext.Provider>
    );
};

export const useDarkMode = () => useContext(DarkModeContext);
