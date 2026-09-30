"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { toggleTheme } from "@/redux/userPreferences/userPreferenceSlice";
import { logout } from "@/redux/auth/authSlice";
import { FaSun, FaMoon, FaBars, FaXmark } from "react-icons/fa6";
import { FaSignOutAlt } from "react-icons/fa";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Transactions", href: "/transactions" },
  { label: "Goals", href: "/goals" },
];

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const theme = useSelector((state: RootState) => state.userPreferences.theme);
  const { user } = useSelector((state: RootState) => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  return (
    <header className="border-b border-border bg-surface relative">
      <div className="px-6 py-4 flex items-center justify-between">
        <span className="font-semibold text-lg text-text">PocketLedger</span>

        <nav className="hidden sm:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                pathname === item.href
                  ? "text-btn-primary font-medium text-sm"
                  : "text-text-secondary hover:text-primary text-sm transition-colors"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={() => dispatch(toggleTheme())}
            className="text-primary cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <FaSun size={18} /> : <FaMoon size={18} />}
          </button>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-medium cursor-pointer"
            >
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </button>

            {menuOpen && (
              <div className="absolute right-0 w-40 bg-surface border border-border rounded-lg shadow-lg ">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer flex items-center gap-2"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setMobileNavOpen((prev) => !prev)}
            className="sm:hidden text-text cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileNavOpen ? <FaXmark size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      {mobileNavOpen && (
        <nav className="sm:hidden flex flex-col border-t border-border px-6 py-3 gap-3 bg-surface">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                pathname === item.href
                  ? "text-primary font-medium text-sm"
                  : "text-text-secondary hover:text-primary text-sm transition-colors"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;
