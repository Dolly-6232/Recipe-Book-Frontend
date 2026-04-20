import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import API from "../api/axios"
import { useAuth } from "../utils/authUtils"
import { useAppDispatch } from "../store/hooks"
import { setUser } from "../store/slices/userSlice"
import Dialog from "../components/Dialog"
import { Loader2Icon } from "lucide-react"

interface SignupFormData {
    name: string
    email: string
    password: string
}

const Signup = () => {
    const [imagePreview, setImagePreview] = useState("")
    const [dialog, setDialog] = useState({ isOpen: false, title: '', message: '', type: 'success' as 'success' | 'error', onConfirm: undefined as (() => void) | undefined })
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const dispatch = useAppDispatch()

    const { register, handleSubmit: handleFormSubmit, formState: { errors } } = useForm<SignupFormData>()

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const onSubmit = async (data: SignupFormData) => {
        setLoading(true)
        try {
            const formData = new FormData()
            formData.append("name", data.name)
            formData.append("email", data.email)
            formData.append("password", data.password)

            // Get the file input element
            const fileInput = document.getElementById('profile-upload') as HTMLInputElement
            if (fileInput.files && fileInput.files[0]) {
                formData.append("profileImage", fileInput.files[0])
            }

            const res = await API.post("/api/auth/signup", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            console.log(res.data, 'rrrrrrrr')
            
            // Store user data in localStorage and Redux
            localStorage.setItem("token", res.data.token)
            localStorage.setItem("user", JSON.stringify(res.data.user))
            dispatch(setUser({ user: res.data.user, token: res.data.token }))
            console.log(res.data.user, 'signup')

            // Show success dialog before updating auth state
            setDialog({
                isOpen: true,
                title: 'Account Created!',
                message: 'Your account has been created successfully. Welcome to My Recipe Book!',
                type: 'success',
                onConfirm: async () => {
                    await login(res.data.user, res.data.token)
                }
            })
        } catch (error: any) {
            console.error('Signup error:', error)
            setDialog({
                isOpen: true,
                title: 'Signup Failed',
                message: error.response?.data?.error || 'An error occurred during signup. Please try again.',
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
                    <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-center">Create Account</h1>

                    <form className="flex flex-col gap-4 items-center w-full" onSubmit={handleFormSubmit(onSubmit)}>
                        <input
                            type="file"
                            id="profile-upload"
                            className="absolute opacity-0 w-16 h-16 sm:w-20 sm:h-20 cursor-pointer"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        <label
                            htmlFor="profile-upload"
                            className="flex items-center justify-center w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-60 lg:h-60 rounded-full border-2 border-white cursor-pointer hover:bg-white hover:bg-opacity-10 transition-colors"
                        >
                            {imagePreview ? (
                                <img src={imagePreview} alt="Profile" className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <span className="text-white text-center text-sm sm:text-base">Upload Profile Photo</span>
                            )}
                        </label>

                        <input
                            className="border border-gray-300 rounded p-2 w-full max-w-xs sm:max-w-sm"
                            type="text"
                            placeholder="Name"
                            {...register("name", { required: "Name is required" })}
                        />
                        {errors.name && <span className="text-red-400 text-sm">{errors.name.message}</span>}

                        <input
                            className="border border-gray-300 rounded p-2 w-full max-w-xs sm:max-w-sm"
                            type="email"
                            placeholder="Email"
                            {...register("email", { 
                                required: "Email is required",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address"
                                }
                            })}
                        />
                        {errors.email && <span className="text-red-400 text-sm">{errors.email.message}</span>}

                        <input
                            className="border border-gray-300 rounded p-2 w-full max-w-xs sm:max-w-sm"
                            type="password"
                            placeholder="Password"
                            {...register("password", { 
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters"
                                }
                            })}
                        />
                        {errors.password && <span className="text-red-400 text-sm">{errors.password.message}</span>}

                        <button className="bg-red-500 text-white rounded p-2 w-full max-w-xs sm:max-w-sm hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" type="submit" disabled={loading}>
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <Loader2Icon className="animate-spin" />
                                </div>
                            ) : 'Sign Up'}
                        </button>
                        <p className="text-white text-sm sm:text-base">Already have an account? <Link to="/login" className="text-blue-300 hover:text-blue-400">Login</Link></p>
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

export default Signup