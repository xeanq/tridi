/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        fontFamily: {
            sans: ['Scandia', 'system-ui', '-apple-system', 'sans-serif'],
            mono: ['Overpass Mono', 'monospace'],
        },
        extend: {
            colors: {
                background: '#0d0b14',
                surface: '#151321',
                'surface-light': '#1e1a2e',
                border: '#2a2540',
                'border-light': '#3d3660',
                accent: {
                    DEFAULT: '#7566D8',
                    light: '#8C63E3',
                    dark: '#502BCB',
                    bright: '#AE51E4',
                },
                brcyan: {
                    DEFAULT: '#3EB2EB',
                    light: '#48D1F2',
                    dark: '#389CDE',
                },
            },
            backgroundImage: {
                'gradient-primary': 'linear-gradient(135deg, #7566D8 0%, #3EB2EB 100%)',
                'gradient-purple': 'linear-gradient(135deg, #502BCB 0%, #AE51E4 100%)',
                'gradient-dark': 'linear-gradient(180deg, #0d0b14 0%, #151321 100%)',
                'gradient-card': 'linear-gradient(135deg, rgba(117,102,216,0.08) 0%, rgba(62,178,235,0.04) 100%)',
            },
        },
    },
    plugins: [],
}
