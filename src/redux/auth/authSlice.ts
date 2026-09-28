import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loginUser, registerUser } from "./authActions";
import { REHYDRATE } from "redux-persist";

interface AuthUser {
  id: string;
  email: string;
  name: string;
  token: string;
}

interface ApiError {
  message: string;
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: ApiError | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("authToken");
    },
    setUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) =>
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.user = null;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.payload ?? null;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.user = null;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.payload ?? null;
      }),
});

export const { logout, setUser, clearError } = authSlice.actions;
export default authSlice.reducer;
