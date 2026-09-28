"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const theme = useSelector((state: RootState) => state.userPreferences.theme);

  return <div className={theme}>{children}</div>;
};

export default MainLayout;