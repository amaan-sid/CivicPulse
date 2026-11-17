import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { User } from "../../types/user"

interface AuthState {
  user: User | null
}

const initialState: AuthState = {
  user: null
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
    },
    logoutUser: (state) => {
      state.user = null
    }
  }
})

export const { setUser, logoutUser } = authSlice.actions
export default authSlice.reducer