"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";

export function GlareHover({
  children,
  className = "",
  glareColor = "#ffffff",
  glareOpacity = 0.35,
  glareAngle = -45,
  glareSize = 220,
  transitionDuration = 650,
}: {
  children: ReactNode;
  className?: string;
  glareColor?: string;
  glareOpacity?: number;
  glareAngle?: number;
  glareSize?: number;
  transitionDuration?: number;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const hex = glareColor.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const rgba = `rgba(${r}, ${g}, ${b}, ${glareOpacity})`;

  const overlayStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    background: `linear-gradient(${glareAngle}deg, hsla(0,0%,0%,0) 60%, ${rgba} 70%, hsla(0,0%,0%,0) 100%)`,
    backgroundSize: `${glareSize}% ${glareSize}%, 100% 100%`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "-100% -100%, 0 0",
    pointerEvents: "none",
    borderRadius: "inherit",
  };

  function animateIn() {
    const el = overlayRef.current;
    if (!el) return;
    el.style.transition = "none";
    el.style.backgroundPosition = "-100% -100%, 0 0";
    requestAnimationFrame(() => {
      el.style.transition = `${transitionDuration}ms ease`;
      el.style.backgroundPosition = "100% 100%, 0 0";
    });
  }

  function animateOut() {
    const el = overlayRef.current;
    if (!el) return;
    el.style.transition = `${transitionDuration}ms ease`;
    el.style.backgroundPosition = "-100% -100%, 0 0";
  }

  return (
    <div className={`relative overflow-hidden ${className}`} onMouseEnter={animateIn} onMouseLeave={animateOut}>
      {children}
      <div ref={overlayRef} style={overlayStyle} />
    </div>
  );
}
