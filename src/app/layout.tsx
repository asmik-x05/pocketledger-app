import type { Metadata } from "next";
import "./globals.css";
import AppProvider from "@/redux/provider";
import { ToastContainer } from "react-toastify";
import MainLayout from "@/layout/MainLayout";

export const metadata: Metadata = {
  title: "PocketLedger",
  description: "A simple expense tracker",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={` h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AppProvider>
          <MainLayout>{children}</MainLayout>
        </AppProvider>
        <ToastContainer autoClose={2000} />
      </body>
    </html>
  );
}
