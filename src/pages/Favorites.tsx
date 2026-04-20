import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import API from "../api/axios"
import Footer from "../components/Footer"
import { Heart, Loader2Icon } from "lucide-react"
const BASE_URL = import.meta.env.VITE_BASE_URL

interface Recipe {
    _id: string
    title: string
    ingredients: string[]
    instructions: string
    image?: string
    createdBy?: {
        name: string
    }
    likes?: number
    likedBy?: string[]
}

const Favorites = () => {
    const [favorites, setFavorites] = useState<Recipe[]>([])
    const [loading, setLoading] = useState(true)
    const [favoritedRecipes, setFavoritedRecipes] = useState<string[]>([])

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const result = await API.get(`/api/recipes/favorites`)
                const data = result.data
                setFavorites(data)
                // Set the favorited recipes IDs
                setFavoritedRecipes(data.map((recipe: Recipe) => recipe._id))
            } catch (error) {
                console.error("Error fetching favorites:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchFavorites()
    }, [])

    const handleRemoveFavorite = async (recipeId: string) => {
        try {
            await API.delete(`/api/recipes/favorite/${recipeId}`)
            setFavoritedRecipes(favoritedRecipes.filter(id => id !== recipeId))
            setFavorites(favorites.filter(recipe => recipe._id !== recipeId))
            console.log("Recipe unfavorited")
        } catch (error) {
            console.error(error)
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen pt-16">
                <Navbar />
                <div className="flex-grow container mx-auto px-4 sm:px-6 py-6 flex items-center justify-center">
                   <div className="flex items-center justify-center">
                                    <Loader2Icon className="animate-spin" />
                                </div>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen pt-16">
            <Navbar />
            <div className="flex-grow container mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 sm:mb-8 text-center">
                    My Favorites
                </h1>

                {favorites.length === 0 ? (
                    <p className="text-white text-center text-sm sm:text-base">
                        No favorites yet. Start liking recipes!
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {favorites.map((recipe) => (
                            <div
                                key={recipe._id}
                                className="bg-transparent border border-gray-700 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                            >
                                {recipe.image && (
                                    <img
                                        src={recipe.image.startsWith('http') ? recipe.image : `${BASE_URL}${recipe.image}`}
                                        alt={recipe.title}
                                        className="w-full h-48 sm:h-52 md:h-55 lg:h-60 object-cover"
                                    />
                                )}
                                <div className="p-3 sm:p-4">
                                    <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-white">
                                        {recipe.title}
                                    </h2>
                                    <div className="flex items-center justify-between">
                                          <Heart
                                            className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 cursor-pointer hover:text-red-400"
                                            fill="red"
                                            stroke="red"
                                            onClick={() => handleRemoveFavorite(recipe._id)}
                                        />
                                        <button className="bg-gray-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base">
                                            <Link
                                                to={`/recipes/${recipe._id}`}
                                                state={{ recipe }}
                                            >
                                                View
                                            </Link>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    )
}

export default Favorites
