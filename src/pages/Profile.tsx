import { useAuth } from "../utils/authUtils"
import { useAppSelector } from "../store/hooks"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Pencil } from "lucide-react"
import API from "../api/axios"
import { useEffect, useState } from "react"


const Profile = () => {
    const { user: authUser } = useAuth()
    const { user: reduxUser } = useAppSelector((state) => state.user)
    console.log(reduxUser, 'iiiiii')

    const user = reduxUser || authUser
    console.log("User object:", user)
    console.log("ProfileImage exists:", !!user?.profileImage)
    console.log("ProfileImage length:", user?.profileImage?.length)
    console.log("ProfileImage starts with:", user?.profileImage?.substring(0, 50))
    const [profileImage, setProfileImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState(user?.profileImage || "")

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setProfileImage(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const result = await API.get("/auth/profile")
                const data = result.data
                console.log(data)
            } catch (error) {
                console.error(error)
            }
        }
        fetchUser()
    }, [user])

    const handleUpdateProfile = async () => {
        try {
            const formData = new FormData()
            formData.append("name", user?.name || "")
            formData.append("email", user?.email || "")

            if (profileImage) {
                formData.append("profileImage", profileImage)
            }

            const result = await API.patch("/auth/update-profile", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            const data = result.data
            console.log(data)
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <div className="w-full min-h-screen bg-cover bg-center overflow-x-hidden">
            <Navbar />
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-10 px-4 sm:px-6 py-6 mt-20">
                <img src="./profile1.png" alt="Profile" className="w-full h-[40vh] lg:w-[50%] lg:h-[80vh] object-cover rounded-lg" />

                <div className="flex justify-center items-center flex-col w-full lg:w-[50%] px-4 sm:px-6 gap-4 sm:gap-5">
                    <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold">Profile</h1>
                    <div className="relative">
                        <input
                            type="file"
                            id="profile-upload"
                            className="absolute opacity-0 w-full h-full cursor-pointer"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        <img
                            src={imagePreview || (user?.profileImage ? `http://localhost:5000${user.profileImage}` : "./dummy.jpg")}
                            className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full border-4 border-white object-cover"
                        />
                    </div>

                    <p className="text-white text-lg sm:text-xl md:text-2xl font-semibold">{user?.name}</p>
                    <p className="text-white text-base sm:text-lg">{user?.email}</p>
                    <button className="bg-red-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg flex items-center gap-2 hover:bg-red-600 transition-colors" onClick={handleUpdateProfile}>
                        <p className="text-white text-base sm:text-lg">Edit</p>
                        <Pencil size={18} />
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Profile