import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import API from "../../services/api";
import type { User } from "../../types/user";

interface AuthState {
  user: User | null;
  initialized: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  initialized: false,
  loading: false,
};

export const fetchCurrentUser = createAsyncThunk<User | null>(
  "auth/fetchCurrentUser",
  async () => {
    try {
      const res = await API.get<{ user: User }>("/auth/me");
      return res.data.user ?? null;
    } catch {
      return null;
    }
  }
);

export const signOutUser = createAsyncThunk<void>("auth/signOutUser", async () => {
  try {
    await API.post("/auth/logout");
  } catch {
    // Always clear client auth state even if network request fails.
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.initialized = true;
    },
    logoutUser: (state) => {
      state.user = null;
      state.initialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.initialized = true;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null;
        state.loading = false;
        state.initialized = true;
      })
      .addCase(signOutUser.fulfilled, (state) => {
        state.user = null;
        state.initialized = true;
      });
  },
});

export const { setUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
