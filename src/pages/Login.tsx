import { useState } from "react"
import { Link } from "react-router-dom"
import API from "../api/axios"
import { useAuth } from "../utils/authUtils"
import { useAppDispatch } from "../store/hooks"
import { setUser } from "../store/slices/userSlice"
import Dialog from "../components/Dialog"
import { Loader2Icon } from "lucide-react"

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [dialog, setDialog] = useState({ isOpen: false, title: '', message: '', type: 'success' as 'success' | 'error', onConfirm: undefined as (() => void) | undefined })
    const { login } = useAuth()
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState(false)

    const res = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await API.post("/api/auth/login", {
                email,
                password
            })

            // Store user data in localStorage and Redux
            localStorage.setItem("token", response.data.token)
            localStorage.setItem("user", JSON.stringify(response.data.user))
            dispatch(setUser({ user: response.data.user, token: response.data.token }))
            console.log(response.data.user, 'login')
            setDialog({
                isOpen: true,
                title: 'Login Successful!',
                message: 'Welcome back! You have been logged in successfully.',
                type: 'success',
                onConfirm: async () => {
                    await login(response.data.user, response.data.token)
                }
            })
        } catch (error: any) {
            console.error('Login error:', error)
            setDialog({
                isOpen: true,
                title: 'Login Failed',
                message: error.response?.data || 'Invalid email or password. Please try again.',
                type: 'error',
                onConfirm: undefined
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div className="flex justify-center items-center min-h-screen bg-cover bg-center px-4 sm:px-6" style={{ backgroundImage: 'url("/login.png")' }}>
                <div className="bg-black/50 backdrop-blur-sm p-6 sm:p-8 md:p-12 lg:p-20 rounded-lg w-full max-w-md">
                    <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-center">Log in your account</h1>
                    <form className="flex flex-col gap-4 w-full" onSubmit={res}>

                        <input
                            className="border border-gray-300 rounded p-2 sm:p-3 w-full"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />

                        <input
                            className="border border-gray-300 rounded p-2 sm:p-3 w-full"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />

                        <button
                            className="bg-red-500 text-white rounded p-2 sm:p-3 w-full hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <Loader2Icon className="animate-spin" />
                                </div>
                            ) : 'Login'}
                        </button>

                        <p className="text-white text-sm sm:text-base text-center">
                            Don't have an account? <Link to="/signup" className="text-blue-300 hover:text-blue-400">Sign Up</Link>
                        </p>

                    </form>
                </div>
            </div>

            <Dialog
                isOpen={dialog.isOpen}
                onClose={() => setDialog({ ...dialog, isOpen: false })}
                title={dialog.title}
                message={dialog.message}
                type={dialog.type}
                onConfirm={dialog.onConfirm}
            />
        </>
    )
}

export default Login