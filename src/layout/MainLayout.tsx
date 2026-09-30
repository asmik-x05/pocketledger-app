"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Footer from "@/components/Footer";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const theme = useSelector((state: RootState) => state.userPreferences.theme);

  return (
    <div className={theme}>
      {children}
      <Footer />
    </div>
  );
};

export default MainLayout;
