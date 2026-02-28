import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ImagePlus, Sparkles, Loader2 } from 'lucide-react'
import api from '../api/client'

export default function Upload() {
    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [dragging, setDragging] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const navigate = useNavigate()

    const handleFile = (f: File) => {
        setFile(f)
        setPreview(URL.createObjectURL(f))
    }

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setDragging(false)
        const f = e.dataTransfer.files[0]
        if (f && ['image/jpeg', 'image/png', 'image/webp'].includes(f.type)) {
            handleFile(f)
        }
    }, [])

    const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0]
        if (f) handleFile(f)
    }

    const handleUpload = async () => {
        if (!file) return
        setUploading(true)
        setProgress(10)

        const formData = new FormData()
        formData.append('file', file)
        formData.append('title', file.name.replace(/\.[^.]+$/, ''))

        try {
            setProgress(30)
            const interval = setInterval(() => {
                setProgress(p => Math.min(p + Math.random() * 15, 90))
            }, 500)
            const { data } = await api.post('/models/generate', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            clearInterval(interval)
            setProgress(100)
            setTimeout(() => navigate(`/editor/${data.id}`), 500)
        } catch {
            alert('Ошибка загрузки. Убедитесь, что вы авторизованы.')
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="min-h-screen pt-28 px-6 relative">
            {/* Background */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-[#0d0b14]" />
                <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full blur-[200px]"
                    style={{ background: 'radial-gradient(circle, rgba(117,102,216,0.12), transparent 70%)' }} />
            </div>

            <div className="max-w-2xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-10"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-3">
                        Создать <span className="text-gradient">3D-модель</span>
                    </h1>
                    <p className="text-white/40">Загрузите фото объекта — ИИ сделает всё остальное</p>
                </motion.div>

                {/* Drop Zone */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={onDrop}
                    onClick={() => document.getElementById('file-input')?.click()}
                    className={`glass-card cursor-pointer text-center transition-all duration-500 relative overflow-hidden ${dragging ? 'scale-[1.02]' : ''
                        }`}
                    style={dragging ? { borderColor: 'rgba(117,102,216,0.5)', boxShadow: '0 0 40px rgba(117,102,216,0.15)' } : {}}
                >
                    {dragging && (
                        <div className="absolute inset-0 rounded-2xl animate-border-glow border-2 border-accent/50" />
                    )}

                    <input
                        id="file-input"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={onFileSelect}
                        className="hidden"
                    />

                    <AnimatePresence mode="wait">
                        {preview ? (
                            <motion.div
                                key="preview"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="space-y-4"
                            >
                                <img src={preview} alt="Preview" className="max-h-72 mx-auto rounded-xl object-contain" />
                                <p className="text-white/40 text-sm">{file?.name}</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="dropzone"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="py-16 space-y-4"
                            >
                                <motion.div
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                    className="flex justify-center"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center">
                                        <ImagePlus size={32} className="text-accent-light" />
                                    </div>
                                </motion.div>
                                <p className="text-xl text-white/60">Перетащите фото сюда</p>
                                <p className="text-white/30 text-sm">или нажмите для выбора файла</p>
                                <div className="flex items-center justify-center gap-3 text-white/20 text-xs">
                                    <span className="px-2 py-1 rounded bg-white/5">JPEG</span>
                                    <span className="px-2 py-1 rounded bg-white/5">PNG</span>
                                    <span className="px-2 py-1 rounded bg-white/5">WEBP</span>
                                    <span className="text-white/15">до 10 МБ</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Upload Button + Progress */}
                <AnimatePresence>
                    {file && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="mt-8 text-center"
                        >
                            {uploading && (
                                <div className="mb-6">
                                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-3">
                                        <motion.div
                                            className="h-full rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            transition={{ duration: 0.5 }}
                                            style={{ background: 'linear-gradient(90deg, #7566D8, #3EB2EB)' }}
                                        />
                                    </div>
                                    <p className="text-white/40 text-sm">
                                        {progress < 100 ? `Генерация модели... ${Math.round(progress)}%` : 'Готово!'}
                                    </p>
                                </div>
                            )}
                            <button
                                onClick={handleUpload}
                                disabled={uploading}
                                className="btn-primary text-lg px-10 py-4 disabled:opacity-50 inline-flex items-center gap-2"
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        Обработка...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={20} />
                                        Сгенерировать 3D-модель
                                    </>
                                )}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
