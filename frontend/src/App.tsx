import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from './store/authStore'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Upload from './pages/Upload'
import Feed from './pages/Feed'
import Profile from './pages/Profile'
import Navbar from './components/Navbar'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuthStore()
    if (!isAuthenticated) return <Navigate to="/login" replace />
    return <>{children}</>
}

function App() {
    const { isAuthenticated, fetchMe } = useAuthStore()

    useEffect(() => {
        if (isAuthenticated) {
            fetchMe()
        }
    }, [isAuthenticated, fetchMe])

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pb-24 sm:pb-0">
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
                    <Route path="/feed" element={<Feed />} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/profile/:userId" element={<Profile />} />
                </Routes>
            </main>
        </div>
    )
}

export default App
