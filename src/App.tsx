import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useEffect } from "react"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import AddRecipe from "./pages/AddRecipe"
import RecipeDetail from "./pages/RecipeDetail"
import Favorites from "./pages/Favorites"
import { AuthProvider } from "./context/AuthContext"
import { useAuth } from "./utils/authUtils"
import { useAppDispatch } from "./store/hooks"
import { loadUserFromStorage } from "./store/slices/userSlice"
import Profile from "./pages/Profile"

const AppRoutes = () => {
  const { isAuthenticated } = useAuth()
  const dispatch = useAppDispatch()

  useEffect(() => {
    // Load existing user data from localStorage into Redux
    dispatch(loadUserFromStorage())
  }, [dispatch])

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Home /> : <Navigate to="/signup" replace />}
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Signup />}
        />
        <Route
          path="/add-recipe"
          element={isAuthenticated ? <AddRecipe /> : <Navigate to="/signup" replace />}
        />
        <Route path="/recipes/:id" element={<RecipeDetail />} />
        <Route
          path="/favorites"
          element={isAuthenticated ? <Favorites /> : <Navigate to="/signup" replace />}
        />
        <Route
          path="/profile"
          element={isAuthenticated ? <Profile /> : <Navigate to="/signup" replace />}
        />
      </Routes>
    </>
  )
}

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App