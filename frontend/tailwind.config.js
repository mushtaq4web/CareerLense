/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f2faf8',
                    100: '#d9f1eb',
                    200: '#b6e4d8',
                    300: '#86d1be',
                    400: '#52b8a0',
                    500: '#2e9e86',
                    600: '#1d7e6c',
                    700: '#196659',
                    800: '#175048',
                    900: '#153f39',
                    950: '#0c2825',
                },
                accent: {
                    50: '#fff8ed',
                    100: '#ffefcc',
                    200: '#ffde99',
                    300: '#ffcb63',
                    400: '#f7ad33',
                    500: '#ea8f14',
                    600: '#cb6f0d',
                    700: '#a7540f',
                    800: '#884215',
                    900: '#703614',
                },
            },
            fontFamily: {
                sans: ['Manrope', 'sans-serif'],
                display: ['DM Serif Display', 'serif'],
                mono: ['IBM Plex Mono', 'monospace'],
            },
            boxShadow: {
                'glow': '0 0 20px rgba(46,158,134,0.25)',
                'glow-sm': '0 0 10px rgba(46,158,134,0.18)',
                'glow-accent': '0 0 20px rgba(234,143,20,0.25)',
                'card': '0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.06)',
                'card-hover': '0 4px 16px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out both',
                'slide-up': 'slideUp 0.45s cubic-bezier(0.16,1,0.3,1) both',
                'slide-left': 'slideLeft 0.45s cubic-bezier(0.16,1,0.3,1) both',
                'scale-in': 'scaleIn 0.3s cubic-bezier(0.16,1,0.3,1) both',
                'float': 'float 6s ease-in-out infinite',
                'shimmer': 'shimmer 2s linear infinite',
                'pulse-ring': 'pulseRing 1.8s cubic-bezier(0.455,0.03,0.515,0.955) infinite',
                'gradient': 'gradient 4s ease infinite',
                'bounce-sm': 'bounceSm 1.2s ease-in-out infinite',
                'spin-slow': 'spin 3s linear infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(24px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideLeft: {
                    '0%': { transform: 'translateX(-24px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.94)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                pulseRing: {
                    '0%': { transform: 'scale(0.8)', opacity: '1' },
                    '80%, 100%': { transform: 'scale(2.2)', opacity: '0' },
                },
                gradient: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                bounceSm: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-4px)' },
                },
            },
        },
    },
    plugins: [],
}
