import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Box, Heart, Upload } from 'lucide-react'
import api from '../api/client'

interface FeedModel {
    id: number
    title: string
    thumbnail_url: string | null
    likes_count: number
    created_at: string
    owner?: { id: number; username: string; display_name: string | null }
}

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const },
    }),
}

export default function Feed() {
    const [models, setModels] = useState<FeedModel[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.get('/feed')
            .then(({ data }) => setModels(data.items || []))
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [])

    return (
        <div className="min-h-screen pt-28 px-6 relative">
            {/* Background */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-[#0d0b14]" />
                <div className="absolute top-[15%] right-[20%] w-[500px] h-[500px] rounded-full blur-[200px]"
                    style={{ background: 'radial-gradient(circle, rgba(62,178,235,0.08), transparent 70%)' }} />
            </div>

            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-3">
                        <span className="text-gradient">Лента</span> моделей
                    </h1>
                    <p className="text-white/40">Модели, созданные пользователями платформы</p>
                </motion.div>

                {loading ? (
                    <div className="flex items-center justify-center py-32">
                        <span className="w-8 h-8 border-2 border-white/10 border-t-accent rounded-full animate-spin" />
                    </div>
                ) : models.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-32"
                    >
                        <div className="w-20 h-20 mx-auto rounded-2xl bg-white/5 flex items-center justify-center mb-6">
                            <Box size={40} className="text-white/20" />
                        </div>
                        <p className="text-xl text-white/40 mb-6">Пока нет моделей</p>
                        <Link to="/upload" className="btn-primary inline-flex items-center gap-2">
                            <Upload size={18} />
                            Создать первую модель
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {models.map((model, i) => (
                            <motion.div
                                key={model.id}
                                custom={i}
                                initial="hidden"
                                animate="visible"
                                variants={cardVariants}
                                className="glass-card group cursor-pointer"
                            >
                                <div className="aspect-square bg-white/[0.02] rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <Box size={48} className="text-white/10 group-hover:text-white/20 transition-colors" />
                                </div>
                                <h3 className="font-bold text-lg mb-2 truncate">{model.title}</h3>
                                <div className="flex items-center justify-between text-sm text-white/40">
                                    <Link
                                        to={`/profile/${model.owner?.id}`}
                                        className="hover:text-white transition-colors"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        @{model.owner?.username || 'unknown'}
                                    </Link>
                                    <span className="flex items-center gap-1.5">
                                        <Heart size={14} className="text-red-400/60" />
                                        {model.likes_count}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
