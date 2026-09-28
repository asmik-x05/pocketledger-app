import { createSlice } from "@reduxjs/toolkit";

interface UserPreferencesState {
  theme: "light" | "dark";
}

const initialState: UserPreferencesState = {
  theme: "dark",
};

const userPreferences = createSlice({
  name: "userPreferences",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
  },
});

export const { toggleTheme } = userPreferences.actions;

export default userPreferences.reducer;
