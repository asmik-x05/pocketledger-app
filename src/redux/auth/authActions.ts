import { createAsyncThunk } from "@reduxjs/toolkit";
import { login, signUp } from "@/api/auth";

interface LoginInput {
  email: string;
  password: string;
}

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface AuthResult {
  id: string;
  name: string;
  email: string;
  token: string;
}

export interface ApiError {
  message: string;
}

export const loginUser = createAsyncThunk<AuthResult, LoginInput, { rejectValue: ApiError }>(
  "login",
  async (data, { rejectWithValue }) => {
    try {
      const result = await login(data);
      localStorage.setItem("authToken", result.token);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.response.data as ApiError);
    }
  },
);

export const registerUser = createAsyncThunk<AuthResult, RegisterInput, { rejectValue: ApiError }>(
  "register",
  async (data, { rejectWithValue }) => {
    try {
      const result = await signUp(data);
      localStorage.setItem("authToken", result.token);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.response.data as ApiError);
    }
  },
);