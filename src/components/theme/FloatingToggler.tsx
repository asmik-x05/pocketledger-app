"use client";

import { toggleTheme } from "@/redux/userPreferences/userPreferenceSlice";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { FaMoon, FaSun } from "react-icons/fa6";

const Theme = () => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useSelector((state: RootState) => state.userPreferences.theme);

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-surface border border-border shadow-lg flex items-center justify-center text-primary hover:bg-surface-secondary transition-colors text-xl cursor-pointer"
    >
      {theme === "dark" ? <FaSun /> : <FaMoon />}
    </button>
  );
};

export default Theme;
