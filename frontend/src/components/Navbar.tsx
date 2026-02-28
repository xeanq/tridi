import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function Navbar() {
    const { isAuthenticated, user, logout } = useAuthStore()
    const location = useLocation()
    const { scrollY } = useScroll()
    const bgOpacity = useTransform(scrollY, [0, 100], [0, 0.85])
    const borderOpacity = useTransform(scrollY, [0, 100], [0, 0.1])

    const isActive = (path: string) => location.pathname === path

    return (
        <motion.nav
            className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl"
            style={{
                backgroundColor: `rgba(13, 11, 20, ${bgOpacity.get()})`,
                borderBottom: `1px solid rgba(255, 255, 255, ${borderOpacity.get()})`,
            }}
        >
            <motion.div
                className="absolute inset-0 backdrop-blur-xl"
                style={{ opacity: bgOpacity }}
            />
            <div className="relative max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2.5 group">
                    <motion.img
                        whileHover={{ rotate: 15, scale: 1.1 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        src="/assets/images/Tridi-logo.svg"
                        alt="Tridi"
                        className="h-8 w-auto"
                    />
                    <span className="text-xl font-bold text-gradient">Tridi</span>
                </Link>

                {/* Navigation */}
                <div className="flex items-center gap-2">
                    <Link
                        to="/feed"
                        className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 ${isActive('/feed') ? 'text-white bg-white/10' : 'text-white/60 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        Лента
                    </Link>

                    {isAuthenticated ? (
                        <>
                            <Link
                                to="/upload"
                                className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 ${isActive('/upload') ? 'text-white bg-white/10' : 'text-white/60 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                Создать
                            </Link>
                            <Link
                                to="/profile"
                                className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 ${isActive('/profile') ? 'text-white bg-white/10' : 'text-white/60 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {user?.display_name || user?.username || 'Профиль'}
                            </Link>
                            <button
                                onClick={logout}
                                className="px-3 py-2 text-white/40 hover:text-white/70 transition-colors text-sm"
                            >
                                Выйти
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn-secondary text-sm py-2 px-4">
                                Войти
                            </Link>
                            <Link to="/register" className="btn-primary text-sm py-2 px-4">
                                Регистрация
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </motion.nav>
    )
}
