import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Camera, Brain, Box, Zap, Palette, Share2, Heart, Lock, ArrowRight, Upload } from 'lucide-react'

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] as const },
    }),
}

const stagger = {
    visible: {
        transition: { staggerChildren: 0.15 },
    },
}

export default function Landing() {
    const heroRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'],
    })
    const logoY = useTransform(scrollYProgress, [0, 1], [0, -80])
    const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Animated gradient background */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-[#0d0b14]" />
                <motion.div
                    className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1200px] h-[900px] rounded-full blur-[200px] animate-pulse-glow"
                    style={{ background: 'radial-gradient(circle, rgba(117,102,216,0.25) 0%, transparent 70%)' }}
                />
                <motion.div
                    className="absolute top-[25%] left-[15%] w-[500px] h-[500px] rounded-full blur-[180px] animate-float"
                    style={{ background: 'radial-gradient(circle, rgba(62,178,235,0.12) 0%, transparent 70%)' }}
                />
                <motion.div
                    className="absolute bottom-[5%] right-[10%] w-[450px] h-[450px] rounded-full blur-[160px] animate-float-delayed"
                    style={{ background: 'radial-gradient(circle, rgba(174,81,228,0.12) 0%, transparent 70%)' }}
                />
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                    }}
                />
            </div>

            {/* ═══ HERO ═══ */}
            <section ref={heroRef} className="relative pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <motion.div style={{ y: logoY }} className="flex justify-center mb-10">
                        <motion.img
                            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                            src="/assets/images/Tridi-logo.svg"
                            alt="Tridi"
                            className="h-32 w-auto drop-shadow-2xl animate-float"
                        />
                    </motion.div>

                    <motion.div style={{ opacity: textOpacity }}>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[1.05] tracking-tight"
                        >
                            <span className="text-white">Превратите фото в </span>
                            <br className="hidden sm:block" />
                            <span className="text-gradient">3D-модель</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed"
                        >
                            Загрузите фотографию — искусственный интеллект создаст полноценную
                            3D-модель для печати, дизайна и прототипирования за секунды
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.7 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <Link to="/upload" className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2">
                                <Upload size={20} />
                                Начать бесплатно
                            </Link>
                            <Link to="/feed" className="btn-secondary text-lg px-10 py-4 inline-flex items-center gap-2">
                                Смотреть модели
                                <ArrowRight size={18} />
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1 }}
                        className="mt-20 flex items-center justify-center gap-12 md:gap-20"
                    >
                        {[
                            { value: '< 30с', label: 'Генерация модели' },
                            { value: '4', label: 'Формата экспорта' },
                            { value: '100%', label: 'Бесплатно' },
                        ].map((stat) => (
                            <div key={stat.label} className="text-center">
                                <div className="text-2xl md:text-3xl font-bold text-gradient mb-1">{stat.value}</div>
                                <div className="text-xs md:text-sm text-white/40">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ═══ HOW IT WORKS ═══ */}
            <section className="relative py-32">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-100px' }}
                        variants={stagger}
                        className="text-center mb-20"
                    >
                        <motion.div variants={fadeUp} custom={0}>
                            <span className="text-sm font-mono text-accent-light tracking-widest uppercase">Процесс</span>
                        </motion.div>
                        <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-bold mt-4">
                            Как это работает
                        </motion.h2>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-50px' }}
                        variants={stagger}
                        className="grid md:grid-cols-3 gap-8"
                    >
                        {[
                            {
                                step: '01',
                                title: 'Загрузите фото',
                                desc: 'Перетащите изображение объекта в формате JPEG, PNG или WEBP',
                                icon: Camera,
                                color: '#7566D8',
                            },
                            {
                                step: '02',
                                title: 'ИИ создаёт модель',
                                desc: 'Нейросеть TripoSR генерирует 3D-меш менее чем за минуту',
                                icon: Brain,
                                color: '#3EB2EB',
                            },
                            {
                                step: '03',
                                title: 'Экспортируйте',
                                desc: 'Правьте модель в 3D-редакторе и скачивайте в STL, OBJ, 3MF, AMF',
                                icon: Box,
                                color: '#AE51E4',
                            },
                        ].map((item, i) => (
                            <motion.div
                                key={item.step}
                                variants={fadeUp}
                                custom={i}
                                className="glass-card text-center group relative"
                            >
                                <div
                                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"
                                    style={{ background: `radial-gradient(circle at center, ${item.color}15, transparent 70%)` }}
                                />
                                <div className="w-14 h-14 mx-auto mb-5 rounded-xl flex items-center justify-center"
                                    style={{ background: `${item.color}15` }}>
                                    <item.icon size={28} style={{ color: item.color }} />
                                </div>
                                <div className="text-sm font-mono mb-3 tracking-widest" style={{ color: item.color }}>
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                <p className="text-white/45 leading-relaxed text-sm">{item.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ═══ FEATURES ═══ */}
            <section className="relative py-32">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-100px' }}
                        variants={stagger}
                        className="text-center mb-20"
                    >
                        <motion.div variants={fadeUp} custom={0}>
                            <span className="text-sm font-mono text-accent-light tracking-widest uppercase">Возможности</span>
                        </motion.div>
                        <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-bold mt-4">
                            Всё что нужно
                        </motion.h2>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-50px' }}
                        variants={stagger}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {[
                            { icon: Zap, title: 'Мгновенная генерация', desc: 'Модель готова менее чем за 30 секунд', color: '#3EB2EB' },
                            { icon: Palette, title: '3D-редактор', desc: 'Встроенный редактор прямо в браузере', color: '#7566D8' },
                            { icon: Share2, title: 'Множество форматов', desc: 'Экспорт в STL, OBJ, 3MF и AMF', color: '#AE51E4' },
                            { icon: Camera, title: 'Социальная лента', desc: 'Делитесь моделями с сообществом', color: '#3EB2EB' },
                            { icon: Heart, title: 'Лайки и избранное', desc: 'Сохраняйте лучшие работы', color: '#E45171' },
                            { icon: Lock, title: 'Приватность', desc: 'Контролируйте видимость своих моделей', color: '#7566D8' },
                        ].map((item, i) => (
                            <motion.div key={item.title} variants={fadeUp} custom={i} className="glass-card group">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                                    style={{ background: `${item.color}15` }}>
                                    <item.icon size={24} style={{ color: item.color }} />
                                </div>
                                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                                <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ═══ CTA ═══ */}
            <section className="relative py-32">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={stagger}
                    >
                        <motion.div
                            variants={fadeUp}
                            custom={0}
                            className="glass-card p-12 md:p-16 relative overflow-hidden"
                        >
                            <div className="absolute inset-0 rounded-2xl" style={{
                                background: 'radial-gradient(circle at 30% 50%, rgba(117,102,216,0.08), transparent 60%), radial-gradient(circle at 70% 50%, rgba(62,178,235,0.06), transparent 60%)',
                            }} />
                            <div className="relative">
                                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                                    Готовы <span className="text-gradient">начать</span>?
                                </h2>
                                <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto">
                                    Создайте аккаунт и превратите своё первое фото в 3D-модель прямо сейчас
                                </p>
                                <Link to="/register" className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2">
                                    Создать аккаунт бесплатно
                                    <ArrowRight size={20} />
                                </Link>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* ═══ FOOTER ═══ */}
            <footer className="relative border-t border-white/5 py-10">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <img src="/assets/images/Tridi-logo.svg" alt="Tridi" className="h-6 w-auto opacity-50" />
                        <span className="text-white/30 text-sm">© 2026 Tridi</span>
                    </div>
                    <div className="text-white/20 text-sm">Все права защищены</div>
                </div>
            </footer>
        </div>
    )
}
