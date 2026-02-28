import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { Package, Box, Heart } from 'lucide-react'
import api from '../api/client'

interface UserProfile {
    id: number
    username: string
    display_name: string | null
    avatar_url: string | null
    created_at: string
}

interface UserModel {
    id: number
    title: string
    thumbnail_url: string | null
    likes_count: number
    is_public: boolean
    created_at: string
}

export default function Profile() {
    const { userId } = useParams()
    const { user: currentUser } = useAuthStore()
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [models, setModels] = useState<UserModel[]>([])
    const [tab, setTab] = useState<'models' | 'favorites'>('models')
    const [loading, setLoading] = useState(true)

    const isOwnProfile = !userId || (currentUser && Number(userId) === currentUser.id)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                if (isOwnProfile) {
                    const { data: me } = await api.get('/users/me')
                    setProfile(me)
                    const { data: myModels } = await api.get('/models')
                    setModels(myModels)
                } else {
                    const { data: user } = await api.get(`/users/${userId}`)
                    setProfile(user)
                }
            } catch {
                // Not authenticated or user not found
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [userId, isOwnProfile])

    if (loading) {
        return <div className="min-h-screen pt-28 text-center text-white/50">Загрузка...</div>
    }

    if (!profile) {
        return (
            <div className="min-h-screen pt-28 text-center">
                <p className="text-white/50 text-xl">Необходимо войти в аккаунт</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-28 px-6">
            <div className="max-w-5xl mx-auto">
                {/* Profile Header */}
                <div className="glass-card flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent to-cyan flex items-center justify-center text-3xl font-bold">
                        {(profile.display_name || profile.username)[0].toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">{profile.display_name || profile.username}</h1>
                        <p className="text-white/50">@{profile.username}</p>
                    </div>
                </div>

                {/* Tabs (own profile only) */}
                {isOwnProfile && (
                    <div className="flex gap-4 mb-8">
                        <button
                            onClick={() => setTab('models')}
                            className={`px-5 py-2 rounded-xl font-medium transition-all ${tab === 'models' ? 'bg-accent text-white' : 'text-white/50 hover:text-white'
                                }`}
                        >
                            Мои модели
                        </button>
                        <button
                            onClick={() => setTab('favorites')}
                            className={`px-5 py-2 rounded-xl font-medium transition-all ${tab === 'favorites' ? 'bg-accent text-white' : 'text-white/50 hover:text-white'
                                }`}
                        >
                            Избранное
                        </button>
                    </div>
                )}

                {/* Models Grid */}
                {models.length === 0 ? (
                    <div className="text-center py-16 text-white/50">
                        <div className="text-5xl mb-4 flex justify-center"><Package size={48} className="text-white/30" /></div>
                        <p>Пока нет моделей</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {models.map((model) => (
                            <div key={model.id} className="glass-card group cursor-pointer">
                                <div className="aspect-square bg-white/5 rounded-xl mb-4 flex items-center justify-center text-4xl">
                                    <Box size={40} className="text-white/20" />
                                </div>
                                <h3 className="font-semibold truncate">{model.title}</h3>
                                <div className="flex items-center justify-between text-sm text-white/50 mt-1">
                                    <span className="flex items-center gap-1"><Heart size={14} /> {model.likes_count}</span>
                                    {!model.is_public && <span className="text-xs bg-white/10 px-2 py-0.5 rounded">Скрыта</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
