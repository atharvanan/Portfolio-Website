"use client";

import { useEffect, useRef } from "react";

type RevealVariant = "fade-up" | "fade-scale" | "slide-left" | "slide-right";

const variantClassMap: Record<RevealVariant, string> = {
  "fade-up": "reveal",
  "fade-scale": "reveal-scale",
  "slide-left": "reveal-left",
  "slide-right": "reveal-right",
};

export default function Reveal({
  children,
  className = "",
  delay = 0,
  variant = "fade-up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: RevealVariant;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("in-view");
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${variantClassMap[variant]} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
