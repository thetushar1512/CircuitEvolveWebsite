"use client";

import { useRef, useState, useCallback } from "react";

type SimState = "idle" | "running" | "done";

export default function VideoWindow() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [simState, setSimState] = useState<SimState>("idle");
  const [progress, setProgress] = useState(0);

  const handleSimClick = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (simState === "idle" || simState === "done") {
      if (simState === "done") video.currentTime = 0;
      video.play();
      setSimState("running");
    } else {
      video.pause();
      setSimState("idle");
    }
  }, [simState]);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    setProgress(video.currentTime / video.duration);
  }, []);

  const handleEnded = useCallback(() => {
    setSimState("done");
    setProgress(1);
  }, []);

  const statusLabel =
    simState === "running" ? "RUNNING" : simState === "done" ? "COMPLETE" : "READY";

  return (
    <div className="vw-shell">
      {/* ── Titlebar ─────────────────────────────────────────── */}
      <div className="vw-titlebar">
        <div className="vw-traffic">
          <span className="vw-dot vw-dot--close" />
          <span className="vw-dot vw-dot--min" />
          <span className="vw-dot vw-dot--max" />
        </div>

        <div className="vw-title-left-icons">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="vw-icon-btn">
            <path d="M2 4h9M2 6.5h9M2 9h9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="vw-icon-btn">
            <path d="M5 3l-3 3.5 3 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div className="vw-title-center-group">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="vw-icon-btn">
            <path d="M2 5h6M5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="vw-title-text">Show</span>
          <span className="vw-title-chevron">⌄</span>
          <span className={`vw-status-pill vw-status-pill--${simState}`} aria-live="polite">
            <span className="vw-status-pip" />
            {statusLabel}
          </span>
        </div>

        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="vw-icon-btn vw-icon-right">
          <path d="M8 3l3 3.5-3 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* ── Body ─────────────────────────────────────────────── */}
      <div className="vw-body">
        {/* Left sidebar */}
        <aside className="vw-sidebar">
          <div className="vw-sidebar-header">
            <img src="/assets/ce-logo.png" alt="" className="vw-sidebar-logo" />
            <span className="vw-project-name">CircuitEvolve</span>
            <span className="vw-chevron">⌄</span>
          </div>

          <div className="vw-tabs">
            <button className="vw-tab">Parts</button>
            <button className="vw-tab vw-tab--active">Simulations</button>
          </div>

          <div className="vw-section-label">
            <span>∨ Simulations</span>
            <span className="vw-plus">+</span>
          </div>

          <button
            className={`vw-sim-item${simState !== "idle" ? " vw-sim-item--active" : ""}`}
            onClick={handleSimClick}
            title={simState === "running" ? "Click to pause" : "Click to run simulation"}
          >
            <div className="vw-sim-row">
              <p className="vw-sim-name">mutation-42b</p>
              <span className={`vw-sim-badge vw-sim-badge--${simState}`}>
                {simState === "running" ? "▶" : simState === "done" ? "✓" : "▷"}
              </span>
            </div>
            <p className="vw-sim-date">2026-06-04, 00:49</p>
            {simState === "running" && (
              <div className="vw-sim-progress">
                <div
                  className="vw-sim-progress-fill"
                  style={{ transform: `scaleX(${progress})` }}
                />
              </div>
            )}
          </button>
        </aside>

        {/* Main video area */}
        <div className="vw-main">
          <video
            ref={videoRef}
            src="/assets/demo.mp4"
            muted
            playsInline
            preload="none"
            className="vw-video"
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
          />

          {simState === "idle" && (
            <button className="vw-play-overlay" onClick={handleSimClick} aria-label="Run simulation" />
          )}
        </div>
      </div>
    </div>
  );
}
