"use client";

import { FaGithub } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-surface px-6 py-4 flex flex-col items-center gap-2 sm:relative sm:flex-row sm:justify-center text-sm text-text-secondary">
      <span>© {new Date().getFullYear()} PocketLedger</span>
      <a
        href="https://github.com/asmik-x05"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 hover:text-primary transition-colors sm:absolute sm:right-6"
      >
        <FaGithub size={18} />
        Check out my GitHub
      </a>
    </footer>
  );
};

export default Footer;
