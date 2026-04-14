import { useState } from "react"
import API from "../api/axios"
import { useAuth } from "../utils/authUtils"
import { useAppDispatch } from "../store/hooks"
import { setUser } from "../store/slices/userSlice"

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { login } = useAuth()
    const dispatch = useAppDispatch()

    const res = async (e: React.FormEvent) => {
        e.preventDefault()
        const response = await API.post("/auth/login", {
            email,
            password
        })

        localStorage.setItem("token", response.data.token)
        localStorage.setItem("user", JSON.stringify(response.data.user))
        console.log(response.data.user, 'login')

        // Store user data in Redux
        dispatch(setUser({ user: response.data.user, token: response.data.token }))

        // Update auth context so app knows user is authenticated
        await login(response.data.user, response.data.token)
    }

    return (
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
                        className="bg-red-500 text-white rounded p-2 sm:p-3 w-full hover:bg-red-600 transition-colors"
                        type="submit"
                    >
                        Login
                    </button>

                    <p className="text-white text-sm sm:text-base text-center">
                        Don't have an account? <a href="/signup" className="text-blue-300 hover:text-blue-400">Sign Up</a>
                    </p>

                </form>
            </div>
        </div>

    )
}

export default Login