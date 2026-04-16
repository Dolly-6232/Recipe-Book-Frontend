import { Link } from "react-router-dom"
import { useState } from "react"
import { useAuth } from "../utils/authUtils"
import { useAppDispatch } from "../store/hooks"
import { clearUser } from "../store/slices/userSlice"
import { Menu, X } from 'lucide-react'
import Dialog from "./Dialog"

const Navbar = () => {
    const { logout } = useAuth()
    const dispatch = useAppDispatch()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [showLogoutDialog, setShowLogoutDialog] = useState(false)

    const handleLogoutClick = () => {
        setShowLogoutDialog(true)
        setIsMenuOpen(false)
    }

    const handleLogoutConfirm = async () => {
        // Clear from Redux
        dispatch(clearUser())
        // Logout from AuthContext
        await logout()
        setShowLogoutDialog(false)
    }

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-sm">
                <div className="flex justify-between items-center px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-2">
                        <img src="/logo.png" alt="Logo" className="h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16" />
                        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white">My Recipe Book</h1>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex gap-4 md:gap-6">
                        <Link to="/" className="text-white hover:text-gray-300 text-sm md:text-base">Home</Link>
                        <Link to="/add-recipe" className="text-white hover:text-gray-300 text-sm md:text-base">Add Recipe</Link>
                        <Link to="/favorites" className="text-white hover:text-gray-300 text-sm md:text-base">Favorites</Link>
                        <Link to="/profile" className="text-white hover:text-gray-300 text-sm md:text-base">Profile</Link>
                        <button
                            onClick={handleLogoutClick}
                            className="bg-red-500 text-white rounded px-3 py-1.5 md:px-4 md:py-2 hover:bg-red-600 text-sm md:text-base"
                        >
                            Logout
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden bg-black/90 backdrop-blur-sm px-4 py-4 space-y-3">
                        <Link
                            to="/"
                            className="block text-white hover:text-gray-300 py-2"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            to="/add-recipe"
                            className="block text-white hover:text-gray-300 py-2"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Add Recipe
                        </Link>
                        <Link
                            to="/favorites"
                            className="block text-white hover:text-gray-300 py-2"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Favorites
                        </Link>
                        <Link
                            to="/profile"
                            className="block text-white hover:text-gray-300 py-2"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Profile
                        </Link>
                        <button
                            onClick={handleLogoutClick}
                            className="w-full bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </nav>

            <Dialog
                isOpen={showLogoutDialog}
                onClose={() => setShowLogoutDialog(false)}
                title="Confirm Logout"
                message="Are you sure you want to logout?"
                type="warning"
                onConfirm={handleLogoutConfirm}
                onCancel={() => setShowLogoutDialog(false)}
                confirmText="Confirm"
                cancelText="Cancel"
            />
        </>
    )
}

export default Navbar