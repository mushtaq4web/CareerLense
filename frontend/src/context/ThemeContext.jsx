import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext();
const STORAGE_KEY = 'theme';

const getInitialTheme = () => {
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(() => {
        const isDark = theme === 'dark';
        document.documentElement.classList.toggle('dark', isDark);
        localStorage.setItem(STORAGE_KEY, theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    };

    const value = useMemo(() => ({
        theme,
        isDark: theme === 'dark',
        toggleTheme,
    }), [theme]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};
