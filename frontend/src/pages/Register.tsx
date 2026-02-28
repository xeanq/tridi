import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, Lock as LockIcon } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

export default function Register() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { register } = useAuthStore()
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await register(username, email, password)
            navigate('/feed')
        } catch (err: unknown) {
            if (err && typeof err === 'object' && 'response' in err) {
                const axiosErr = err as { response?: { data?: { detail?: string } } }
                setError(axiosErr.response?.data?.detail || 'Ошибка регистрации')
            } else {
                setError('Ошибка регистрации')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen pt-20 flex items-center justify-center px-6 relative">
            {/* Background */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-[#0d0b14]" />
                <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[200px]"
                    style={{ background: 'radial-gradient(circle, rgba(62,178,235,0.12), transparent 70%)' }} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="glass-card w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <Link to="/" className="inline-block mb-6">
                        <img src="/assets/images/Tridi-logo.svg" alt="Tridi" className="h-12 w-auto mx-auto" />
                    </Link>
                    <h1 className="text-3xl font-bold mb-2">Регистрация</h1>
                    <p className="text-white/40 text-sm">Создайте аккаунт Tridi</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm text-white/50 mb-2">Имя пользователя</label>
                        <div className="relative">
                            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                minLength={3}
                                className="input-field pl-11"
                                placeholder="username"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-white/50 mb-2">Email</label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="input-field pl-11"
                                placeholder="your@email.com"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-white/50 mb-2">Пароль</label>
                        <div className="relative">
                            <LockIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="input-field pl-11"
                                placeholder="Минимум 6 символов"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full disabled:opacity-50 py-3.5"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Создание...
                            </span>
                        ) : 'Создать аккаунт'}
                    </button>
                </form>

                <p className="text-center text-white/40 mt-8 text-sm">
                    Уже есть аккаунт?{' '}
                    <Link to="/login" className="text-accent-light hover:text-white transition-colors">
                        Войти
                    </Link>
                </p>
            </motion.div>
        </div>
    )
}
