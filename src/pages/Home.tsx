import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import API from "../api/axios"
import Carosal from "../components/Carosal"
import Footer from "../components/Footer"
import { Heart } from 'lucide-react';
import Dialog from "../components/Dialog"
const BASE_URL = import.meta.env.VITE_BASE_URL

const Home = () => {
    const [recipes, setRecipes] = useState<any[]>([])
    const [favoritedRecipes, setFavoritedRecipes] = useState<string[]>([])
    const [dialog, setDialog] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'success' as 'success' | 'error',
        onConfirm: undefined
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await API.get("/api/recipes")
                const data = result.data
                setRecipes(data)
                console.log(data)
            } catch (error) {
                console.error(error)
            }
        }

        const fetchFavorites = async () => {
            try {
                const result = await API.get("/api/recipes/favorites")
                const favorites = result.data
                setFavoritedRecipes(favorites.map((fav: any) => fav._id))
            } catch (error) {
                console.error("Error fetching favorites:", error)
            }
        }

        fetchData()
        fetchFavorites()
    }, [])

    const handleAddFavorite = async (recipeId: string) => {
        try {
            await API.post(`/api/recipes/favorite/${recipeId}`)
            setFavoritedRecipes([...favoritedRecipes, recipeId])
            setDialog({
                isOpen: true,
                title: 'Recipe Favorited!',
                message: 'Recipe has been added to your favorites.',
                type: 'success',
                onConfirm: undefined
            })
            console.log("Recipe favorited")
        } catch (error) {
            setDialog({
                isOpen: true,
                title: 'Error',
                message: 'Failed to add recipe to favorites.',
                type: 'error',
                onConfirm: undefined
            })
        }
    }

    const handleRemoveFavorite = async (recipeId: string) => {
        try {
            await API.delete(`/api/recipes/favorite/${recipeId}`)
            setFavoritedRecipes(favoritedRecipes.filter(id => id !== recipeId))
            setDialog({
                isOpen: true,
                title: 'Recipe Unfavorited!',
                message: 'Recipe has been removed from your favorites.',
                type: 'success',
                onConfirm: undefined
            })
        } catch (error) {
            setDialog({
                isOpen: true,
                title: 'Error',
                message: 'Failed to remove recipe from favorites.',
                type: 'error',
                onConfirm: undefined
            })
        }
    }



    return (
        <div className="pt-16 overflow-x-hidden">
            <Navbar />
            <Carosal />
            <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 sm:mb-8 text-center">Recipes</h1>

                {recipes.length === 0 ? (
                    <p className="text-white text-center text-sm sm:text-base">No recipes found. Add your first recipe!</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

                        {recipes.map((recipe: any) => (
                            <div
                                className="bg-transparent border border-gray-700 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                            >

                               <img src={recipe.image ? (recipe.image.startsWith('http') ? recipe.image : `${BASE_URL}${recipe.image}`) : "./dummy.jpg"} alt="Recipe" className="w-full h-48 sm:h-52 md:h-55 lg:h-60 object-cover" />

                                <div className="p-3 sm:p-4">
                                    <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-white">
                                        {recipe.title}
                                    </h2>
                                    <div className="flex gap-3 sm:gap-5 justify-end items-center">
                                        <button className="bg-gray-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base">
                                            <Link
                                                key={recipe._id}
                                                to={`/recipes/${recipe._id}`}
                                                state={{ recipe }}
                                            >
                                                View
                                            </Link>
                                        </button>
                                        <Heart
                                            className={`w-5 h-5 sm:w-6 sm:h-6 ${favoritedRecipes.includes(recipe._id) ? "cursor-pointer" : "text-gray-500 cursor-pointer hover:text-red-400"}`}
                                            fill={favoritedRecipes.includes(recipe._id) ? "red" : "none"}
                                            stroke={favoritedRecipes.includes(recipe._id) ? "red" : "currentColor"}
                                            onClick={() => {
                                                favoritedRecipes.includes(recipe._id) ? handleRemoveFavorite(recipe._id) : handleAddFavorite(recipe._id)
                                            }}
                                        />

                                    </div>
                                </div>

                            </div>


                        ))}

                    </div>
                )}
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

export default Home