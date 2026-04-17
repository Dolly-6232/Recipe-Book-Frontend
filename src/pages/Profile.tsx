import { useAuth } from "../utils/authUtils"
import { useAppSelector } from "../store/hooks"
import { useAppDispatch } from "../store/hooks"
import { setUser } from "../store/slices/userSlice"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Pencil, X, Loader2Icon } from "lucide-react"
import API from "../api/axios"
import { useEffect, useState } from "react"
import Dialog from "../components/Dialog"
const BASE_URL = import.meta.env.VITE_BASE_URL

const Profile = () => {
    const { user: authUser } = useAuth()
    const { user: reduxUser, token } = useAppSelector((state) => state.user)
    const dispatch = useAppDispatch()
    const [isEditing, setIsEditing] = useState(false)
    const [editName, setEditName] = useState("")
    const [editEmail, setEditEmail] = useState("")
    const [editImage, setEditImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState("")
    const [loading, setLoading] = useState(false)
    const [dialog, setDialog] = useState({ isOpen: false, title: '', message: '', type: 'success' as 'success' | 'error', onConfirm: undefined as (() => void) | undefined })

    const user = reduxUser || authUser
    console.log("User object:", user)
    console.log("ProfileImage exists:", !!user?.profileImage)
    console.log("ProfileImage length:", user?.profileImage?.length)
    console.log("ProfileImage starts with:", user?.profileImage?.substring(0, 50))

    useEffect(() => {
        if (user) {
            setEditName(user.name || "")
            setEditEmail(user.email || "")
            setImagePreview(user?.profileImage ? `${BASE_URL}${user.profileImage}` : "./dummy.jpg")
        }
    }, [user])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setEditImage(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleUpdateProfile = async () => {
        setLoading(true)
        try {
            const formData = new FormData()
            formData.append("name", editName)
            formData.append("email", editEmail)
            if (editImage) {
                formData.append("profileImage", editImage)
            }

            const result = await API.patch("/auth/update-profile", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            const data = result.data
            console.log(data)

            // Update Redux store
            dispatch(setUser({ user: data, token: token || '' }))

            // Update localStorage
            localStorage.setItem("user", JSON.stringify(data))

            setDialog({
                isOpen: true,
                title: "Profile Updated",
                message: "Your profile has been updated successfully!",
                type: "success",
                onConfirm: undefined
            })
            setIsEditing(false)
        } catch (error: any) {
            console.error(error)
            setDialog({
                isOpen: true,
                title: "Update Failed",
                message: error.response?.data?.error || "Failed to update profile. Please try again.",
                type: "error",
                onConfirm: undefined
            })
        } finally {
            setLoading(false)
        }
    }

    const handleCancelEdit = () => {
        setIsEditing(false)
        setEditName(user?.name || "")
        setEditEmail(user?.email || "")
        setEditImage(null)
        setImagePreview(user?.profileImage ? `${BASE_URL}${user.profileImage}` : "./dummy.jpg")
    }
    return (
        <div className="w-full min-h-screen bg-cover bg-center overflow-x-hidden">
            <Navbar />
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-10 px-4 sm:px-6 py-6 mt-20">
                <img src="./profile1.png" alt="Profile" className="w-full h-[40vh] lg:w-[50%] lg:h-[80vh] object-cover rounded-lg" />

                <div className="flex justify-center items-center flex-col w-full lg:w-[50%] px-4 sm:px-6 gap-4 sm:gap-5">
                    <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold">Profile</h1>
                    <div className="relative">
                        {isEditing && (
                            <input
                                type="file"
                                id="profile-upload"
                                className="absolute opacity-0 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 cursor-pointer"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        )}
                        <img
                            src={imagePreview || (user?.profileImage ? `${BASE_URL}${user.profileImage}` : "./dummy.jpg")}
                            alt="Profile"
                            className={`w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full border-4 border-white object-cover ${isEditing ? 'cursor-pointer' : ''}`}
                            onClick={() => isEditing && document.getElementById('profile-upload')?.click()}
                        />
                        {isEditing && (
                            <div className="absolute bottom-0 right-0 bg-red-500 rounded-full p-2 cursor-pointer hover:bg-red-600">
                                <Pencil size={16} className="text-white" />
                            </div>
                        )}
                    </div>

                    {isEditing ? (
                        <div className="flex flex-col gap-4 w-full max-w-sm">
                            <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="border border-gray-300 rounded p-2 w-full"
                                placeholder="Name"
                            />
                            <input
                                type="email"
                                value={editEmail}
                                onChange={(e) => setEditEmail(e.target.value)}
                                className="border border-gray-300 rounded p-2 w-full"
                                placeholder="Email"
                            />
                            <div className="flex gap-2">
                                <button
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={handleUpdateProfile}
                                    disabled={loading}
                                >
                                    {loading ? <Loader2Icon className="animate-spin" /> : 'Save'}
                                </button>
                                <button
                                    className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-600 transition-colors"
                                    onClick={handleCancelEdit}
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <p className="text-white text-lg sm:text-xl md:text-2xl font-semibold">{user?.name}</p>
                            <p className="text-white text-base sm:text-lg">{user?.email}</p>
                            <button className="bg-red-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg flex items-center gap-2 hover:bg-red-600 transition-colors" onClick={() => setIsEditing(true)}>
                                <p className="text-white text-base sm:text-lg">Edit</p>
                                <Pencil size={18} />
                            </button>
                        </>
                    )}
                </div>
            </div>
            <Footer />
            <Dialog
                isOpen={dialog.isOpen}
                onClose={() => setDialog({ ...dialog, isOpen: false })}
                title={dialog.title}
                message={dialog.message}
                type={dialog.type}
                onConfirm={dialog.onConfirm}
            />
        </div>
    )
}

export default Profile