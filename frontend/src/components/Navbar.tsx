import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Compass, PlusSquare, User, LogIn, UserPlus, LogOut } from 'lucide-react'

export default function Navbar() {
    const { isAuthenticated, user, logout } = useAuthStore()
    const location = useLocation()
    const { scrollY } = useScroll()
    const bgOpacity = useTransform(scrollY, [0, 100], [0, 0.85])
    const borderOpacity = useTransform(scrollY, [0, 100], [0, 0.1])

    const isActive = (path: string) => location.pathname === path

    return (
        <>
            {/* ─── Desktop Top Navbar ─── */}
            <motion.nav
                className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl hidden sm:block"
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

            {/* ─── Mobile Top Bar (logo only) ─── */}
            <div className="fixed top-0 left-0 right-0 z-50 sm:hidden">
                <div className="flex items-center justify-center px-4 py-3 backdrop-blur-xl"
                    style={{ backgroundColor: 'rgba(13, 11, 20, 0.85)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <Link to="/" className="flex items-center gap-2">
                        <img src="/assets/images/Tridi-logo.svg" alt="Tridi" className="h-7 w-auto" />
                        <span className="text-lg font-bold text-gradient">Tridi</span>
                    </Link>
                </div>
            </div>

            {/* ─── Mobile Bottom Island ─── */}
            <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 sm:hidden w-[calc(100%-3rem)] max-w-[340px]">
                <nav className="flex items-center justify-around py-2.5 px-2 rounded-[32px] backdrop-blur-sm"
                    style={{
                        background: 'rgba(22, 18, 35, 0.85)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 20px rgba(117, 102, 216, 0.08)',
                    }}>

                    {/* Лента */}
                    <Link to="/feed" className="flex flex-col items-center gap-0.5 min-w-[56px]">
                        <Compass size={22} className={`transition-colors duration-200 ${isActive('/feed') ? 'text-accent-light' : 'text-white/40'}`} />
                        <span className={`text-[10px] transition-colors duration-200 ${isActive('/feed') ? 'text-accent-light' : 'text-white/35'}`}>Лента</span>
                    </Link>

                    {isAuthenticated ? (
                        <>
                            {/* Создать */}
                            <Link to="/upload" className="flex flex-col items-center gap-0.5 min-w-[56px]">
                                <PlusSquare size={22} className={`transition-colors duration-200 ${isActive('/upload') ? 'text-accent-light' : 'text-white/40'}`} />
                                <span className={`text-[10px] transition-colors duration-200 ${isActive('/upload') ? 'text-accent-light' : 'text-white/35'}`}>Создать</span>
                            </Link>

                            {/* Профиль */}
                            <Link to="/profile" className="flex flex-col items-center gap-0.5 min-w-[56px]">
                                <User size={22} className={`transition-colors duration-200 ${isActive('/profile') ? 'text-accent-light' : 'text-white/40'}`} />
                                <span className={`text-[10px] transition-colors duration-200 ${isActive('/profile') ? 'text-accent-light' : 'text-white/35'}`}>Профиль</span>
                            </Link>

                            {/* Выйти */}
                            <button onClick={logout} className="flex flex-col items-center gap-0.5 min-w-[56px]">
                                <LogOut size={22} className="text-white/40 transition-colors duration-200" />
                                <span className="text-[10px] text-white/35">Выйти</span>
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Войти */}
                            <Link to="/login" className="flex flex-col items-center gap-0.5 min-w-[56px]">
                                <LogIn size={22} className={`transition-colors duration-200 ${isActive('/login') ? 'text-accent-light' : 'text-white/40'}`} />
                                <span className={`text-[10px] transition-colors duration-200 ${isActive('/login') ? 'text-accent-light' : 'text-white/35'}`}>Войти</span>
                            </Link>

                            {/* Регистрация */}
                            <Link to="/register" className="flex flex-col items-center gap-0.5 min-w-[56px]">
                                <UserPlus size={22} className={`transition-colors duration-200 ${isActive('/register') ? 'text-accent-light' : 'text-white/40'}`} />
                                <span className={`text-[10px] transition-colors duration-200 ${isActive('/register') ? 'text-accent-light' : 'text-white/35'}`}>Регистрация</span>
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </>
    )
}
