"use client";

import type { CSSProperties } from "react";
import { useCallback, useRef, useState } from "react";

type HeroLogoSceneProps = {
  className?: string;
};

export default function HeroLogoScene({ className = "" }: HeroLogoSceneProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const sceneClassName = [
    "hero-logo-scene",
    className,
    isActive ? "hero-ls--active" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const handleMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const y = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

    setIsActive(true);
    setTilt({
      x: Math.max(-1, Math.min(1, x)),
      y: Math.max(-1, Math.min(1, y)),
    });
  }, []);

  return (
    <div
      ref={ref}
      className={sceneClassName}
      onMouseMove={handleMove}
      onMouseLeave={() => {
        setIsActive(false);
        setTilt({ x: 0, y: 0 });
      }}
      style={{
        "--hero-ls-tilt-x": `${tilt.y * -5}deg`,
        "--hero-ls-tilt-y": `${tilt.x * 7}deg`,
        "--hero-ls-shift-x": `${tilt.x * 10}px`,
        "--hero-ls-shift-y": `${tilt.y * 10}px`,
      } as CSSProperties}
      aria-hidden="true"
    >
      <div className="hero-ls-orbit hero-ls-orbit-a" />
      <div className="hero-ls-orbit hero-ls-orbit-b" />
      <div className="hero-ls-aura" />
      <div className="hero-ls-mark">
        <img src="/assets/ce-logo.png" alt="" className="hero-ls-img" />
      </div>
    </div>
  );
}
