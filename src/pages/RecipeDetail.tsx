import { useLocation } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
const BASE_URL = import.meta.env.VITE_BASE_URL

const RecipeDetail = () => {

    const location = useLocation()

    const recipe = location.state?.recipe

    if (!recipe) {
        return <p className="text-white text-center">No recipe data</p>
    }

    return (
        <div className="w-full min-h-screen overflow-x-hidden">
            <Navbar />
            <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 mt-16 sm:mt-20">
                <div className="w-full bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl">
                   <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-10">
                     <div className="w-full lg:w-1/2">
                        <img
                           src={recipe.image.startsWith('http') ? recipe.image : `${BASE_URL}${recipe.image}`}
                        alt={recipe.title}
                            className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-xl shadow-lg"
                        />
                     </div>

                     <div className="w-full lg:w-1/2">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl text-white font-bold mb-4 sm:mb-6">
                            {recipe.title}
                        </h1>

                        <h2 className="text-lg sm:text-xl md:text-2xl text-white font-semibold mb-3 sm:mb-4">
                            Ingredients
                        </h2>

                        <ul className="text-gray-200 list-disc pl-5 sm:pl-6 space-y-2 mb-6 sm:mb-8">
                            {recipe.ingredients.map((item: string, index: number) => (
                                <li key={index} className="text-sm sm:text-base">{item}</li>
                            ))}
                        </ul>

                        <h2 className="text-lg sm:text-xl md:text-2xl text-white font-semibold mb-3 sm:mb-4">
                            Instructions
                        </h2>

                        <p className="text-gray-200 whitespace-pre-line text-sm sm:text-base leading-relaxed">
                            {recipe.instructions}
                        </p>
                   </div>
                   </div>

                    <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-400/30">
                        <p className="text-gray-300 text-sm sm:text-base">
                            By: <span className="text-white font-semibold">{recipe.createdBy?.name}</span>
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default RecipeDetail
