import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface User {
  id: string
  name: string
  email: string
  profileImage: string
}

interface UserState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

const initialState: UserState = {
  user: null,
  token: null,
  isAuthenticated: false,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
    },
    clearUser: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
    },
    loadUserFromStorage: (state) => {
      const token = localStorage.getItem('token')
      const userStr = localStorage.getItem('user')

      if (token && userStr) {
        try {
          const user = JSON.parse(userStr)
          state.user = user
          state.token = token
          state.isAuthenticated = true
        } catch (error) {
          console.error('Error parsing user from localStorage:', error)
        }
      }
    },
  },
})

export const { setUser, clearUser, loadUserFromStorage } = userSlice.actions
export default userSlice.reducer
