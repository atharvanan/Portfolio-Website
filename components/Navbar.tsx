"use client";

import { useEffect, useState } from "react";
import { profile as defaultProfile, navLinks as defaultNavLinks, Profile, NavLink } from "@/lib/data";

export default function Navbar({
  profile: propProfile,
  navLinks: propNavLinks,
}: {
  profile?: Profile;
  navLinks?: NavLink[];
} = {}) {
  const profile = propProfile || defaultProfile;
  const links = propNavLinks || defaultNavLinks;
  const [active, setActive] = useState("#about");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const sections = links
      .map((l) => document.querySelector(l.href))
      .filter(Boolean) as Element[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [links]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 h-12 backdrop-blur-2xl transition-all duration-500 ease-apple ${
        scrolled
          ? "bg-white/80 border-b border-black/[0.08] shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          : "bg-white/60 border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-full max-w-content-wide items-center justify-between px-6">
        <a
          href="#top"
          className="text-[15px] font-semibold tracking-tight text-ink transition-opacity duration-300 hover:opacity-70"
        >
          {profile.name}
        </a>

        <nav className="relative hidden items-center gap-5 lg:gap-9 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`relative py-3.5 text-[14px] font-normal transition-colors duration-300 ${
                active === link.href
                  ? "text-ink"
                  : "text-muted hover:text-ink"
              }`}
            >
              {link.label}
              <span
                className={`absolute inset-x-0 -bottom-[1px] h-[2px] rounded-full bg-ink transition-all duration-500 ease-apple ${
                  active === link.href
                    ? "opacity-100 scale-x-100"
                    : "opacity-0 scale-x-0"
                }`}
              />
            </a>
          ))}
        </nav>

        <button
          aria-label="Toggle menu"
          className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] md:hidden"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span
            className={`block h-[1.5px] w-[18px] bg-ink transition-all duration-300 ease-apple ${
              menuOpen ? "translate-y-[3.5px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-[1.5px] w-[18px] bg-ink transition-all duration-300 ease-apple ${
              menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      <div
        className={`absolute inset-x-0 top-12 border-b border-black/[0.08] bg-white/95 backdrop-blur-2xl md:hidden transition-all duration-500 ease-apple overflow-hidden ${
          menuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0 border-transparent"
        }`}
      >
        <nav className="flex flex-col px-6 py-2">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`border-b border-black/[0.04] py-3.5 text-[15px] transition-colors duration-300 last:border-none ${
                active === link.href
                  ? "text-ink font-medium"
                  : "text-muted"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
