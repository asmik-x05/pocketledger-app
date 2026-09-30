"use client";
import Theme from "@/components/theme/FloatingToggler";
import { RootState } from "@/redux/store";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import { useSelector } from "react-redux";

export default function Home() {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <>
      <main className="h-screen w-full flex flex-col items-center justify-center gap-8 px-6 bg-background text-text">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="text-sm font-medium tracking-wide text-primary uppercase">
            PocketLedger
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-text">
            Track every rupee you save
          </h1>
          <p className="text-text-secondary text-base sm:text-lg max-w-md">
            Log savings and withdrawals, set goal targets, and see your
            balance at a glance.
          </p>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <Link
              href={"/dashboard"}
              className="px-6 py-3 rounded-xl border border-border text-text hover:bg-surface-secondary transition-colors flex items-center gap-2"
            >
              Go to Dashboard<FaArrowRight />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-6 py-3 rounded-xl border border-border text-text hover:bg-btn-primary hover:text-white transition-colors"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="px-6 py-3 rounded-xl bg-surface-secondary dark:text-white text-text hover:bg-primary-hover/20 transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </main>      
      <Theme />
    </>
  );
}
