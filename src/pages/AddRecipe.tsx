import { useState } from "react"
import Navbar from "../components/Navbar"
import API from "../api/axios"
import Footer from "../components/Footer"
import Dialog from "../components/Dialog"
import { Loader2Icon } from "lucide-react"

const AddRecipe = () => {
    const [title, setTitle] = useState("")
    const [ingredients, setIngredients] = useState("")
    const [instructions, setInstructions] = useState("")
    const [image, setImage] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [dialog, setDialog] = useState({ isOpen: false, title: '', message: '', type: 'success' as 'success' | 'error', onConfirm: undefined as (() => void) | undefined })
    const [loading, setLoading] = useState(false)

    const handleRecipeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        // Create FormData for file upload
        const formData = new FormData()
        formData.append("title", title)
        formData.append("ingredients", ingredients)
        formData.append("instructions", instructions)
        if (image) {
            formData.append("image", image)
        }

        try {
            const res = await API.post("/recipes", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            console.log(res.data, 'recipe added')

            // Clear form
            setTitle("")
            setIngredients("")
            setInstructions("")
            setImage(null)
            setPreview(null)

            setDialog({
                isOpen: true,
                title: "Success",
                message: "Recipe added successfully!",
                type: "success",
                onConfirm: undefined
            })
        } catch (error: Error | unknown) {
            console.error("Error adding recipe:", error)
            const errorMessage = error instanceof Error ? error.message : "Failed to add recipe"
            setDialog({
                isOpen: true,
                title: "Error",
                message: errorMessage,
                type: "error",
                onConfirm: undefined
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full min-h-screen bg-cover bg-center overflow-x-hidden">
            <Navbar />
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-10 px-4 sm:px-6 py-6 mt-20">
                <div className="flex flex-col w-full lg:w-[50%] px-4 sm:px-6">
                    <h1 className="text-white text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Add Recipe</h1>

                    <form className="flex flex-col gap-4 w-full" onSubmit={handleRecipeSubmit}>

                        <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 mx-auto">
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute opacity-0 w-full h-full cursor-pointer"
                                onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    setImage(file || null)
                                    if (file) {
                                        const reader = new FileReader()
                                        reader.onloadend = () => {
                                            setPreview(reader.result as string)
                                        }
                                        reader.readAsDataURL(file)
                                    }
                                }}
                            />
                            <div className="w-full h-full rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center hover:border-gray-300 transition-colors">
                                {preview ? (
                                    <img src={preview} alt="Preview" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <span className="text-gray-400 text-xs sm:text-sm text-center">Upload Image</span>
                                )}
                            </div>
                        </div>

                        <input
                            className="border border-gray-300 rounded p-2 sm:p-3 w-full"
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />

                        <textarea
                            className="border border-gray-300 rounded p-2 sm:p-3 w-full"
                            placeholder="Ingredients"
                            value={ingredients}
                            onChange={(e) => setIngredients(e.target.value)}
                            rows={3}
                            required
                        />

                        <textarea
                            className="border border-gray-300 rounded p-2 sm:p-3 w-full"
                            placeholder="Instructions"
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                            rows={5}
                            required
                        />

                        <button className="bg-red-500 text-white rounded p-2 sm:p-3 w-full hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" type="submit" disabled={loading}>
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <Loader2Icon className="animate-spin" />
                                </div>
                            ) : 'Add Recipe'}
                        </button>

                    </form>
                </div>
                <img src="./cookingform.png" alt="Add Recipe" className="w-full h-[40vh] lg:w-[50%] lg:h-[80vh] object-cover rounded-lg" />
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

export default AddRecipe