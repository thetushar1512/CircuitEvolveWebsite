"use client";

import { useEffect, useRef, useState } from "react";

const TOTAL_FRAMES = 296;
const LERP = 0.25; 
const MIN_DELTA_TO_DRAW = 0.01;
const POSTER_FRAME = 52;
const VIDEO_END = 0.86;
const SHRINK_START = 0.88;
const FRAME_ZOOM = 1;
const FRAME_FOCAL_X = 0.5;
const FRAME_FOCAL_Y = 0.5;

type FrameState = {
  loaded: number;
  ready: boolean;
  complete: boolean;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function easeInOut(value: number) {
  return value < 0.5
    ? 4 * value * value * value
    : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

export default function CanvasEngine() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const loadingFramesRef = useRef<Set<number>>(new Set());
  const loadedFramesRef = useRef<Set<number>>(new Set());
  const sequenceStartedRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  
  const targetFrameRef = useRef(POSTER_FRAME);
  const easedFrameRef = useRef(POSTER_FRAME);
  const renderedFrameRef = useRef(-1);
  const requestedFrameRef = useRef(-1);
  
  const [frameState, setFrameState] = useState<FrameState>({
    loaded: 0,
    ready: false,
    complete: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: false });

    if (!canvas || !context) return;

    let mounted = true;
    let sequenceTimer: number | null = null;

    const resizeCanvas = () => {
      if (!canvas || !context) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(canvas.offsetWidth * dpr));
      canvas.height = Math.max(1, Math.floor(canvas.offsetHeight * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      
      const current = requestedFrameRef.current;
      renderedFrameRef.current = -1;
      if (current >= 0) renderedFrameRef.current = drawFrame(current);
    };

    const drawFallback = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const gradient = context.createLinearGradient(0, 0, w, h);
      gradient.addColorStop(0, "#050505");
      gradient.addColorStop(0.48, "#111111");
      gradient.addColorStop(1, "#000000");
      context.fillStyle = gradient;
      context.fillRect(0, 0, w, h);
    };

    const getNearestLoadedFrame = (frameIndex: number) => {
      if (loadedFramesRef.current.has(frameIndex)) return frameIndex;
      if (loadedFramesRef.current.has(POSTER_FRAME)) return POSTER_FRAME;

      for (let offset = 1; offset < TOTAL_FRAMES; offset += 1) {
        const previous = frameIndex - offset;
        const next = frameIndex + offset;
        if (previous >= 0 && loadedFramesRef.current.has(previous)) return previous;
        if (next < TOTAL_FRAMES && loadedFramesRef.current.has(next)) return next;
      }

      return -1;
    };

    const drawFrame = (frameIndex: number) => {
      const drawableIndex = getNearestLoadedFrame(frameIndex);
      if (drawableIndex < 0) {
        drawFallback();
        return -1;
      }

      const frame = framesRef.current[drawableIndex];
      const canvasWidth = canvas.offsetWidth;
      const canvasHeight = canvas.offsetHeight;

      if (!frame || !frame.complete || frame.naturalWidth === 0) {
        drawFallback();
        return -1;
      }

      context.fillStyle = "#000000";
      context.fillRect(0, 0, canvasWidth, canvasHeight);

      const coverScale = Math.max(
        canvasWidth / frame.naturalWidth,
        canvasHeight / frame.naturalHeight,
      ) * FRAME_ZOOM;
      const drawWidth = frame.naturalWidth * coverScale;
      const drawHeight = frame.naturalHeight * coverScale;
      const minOffsetX = canvasWidth - drawWidth;
      const minOffsetY = canvasHeight - drawHeight;
      const offsetX = clamp(
        canvasWidth / 2 - drawWidth * FRAME_FOCAL_X,
        minOffsetX,
        0,
      );
      const offsetY = clamp(
        canvasHeight / 2 - drawHeight * FRAME_FOCAL_Y,
        minOffsetY,
        0,
      );

      context.drawImage(frame, offsetX, offsetY, drawWidth, drawHeight);
      return drawableIndex;
    };

    const loadFrame = (frameIndex: number) => {
      if (frameIndex < 0 || frameIndex >= TOTAL_FRAMES) return;
      if (loadedFramesRef.current.has(frameIndex) || loadingFramesRef.current.has(frameIndex)) return;

      loadingFramesRef.current.add(frameIndex);

      const image = new Image();
      image.decoding = "async";
      if (frameIndex === POSTER_FRAME) {
        image.fetchPriority = "high";
      }

      const markLoaded = () => {
        if (!mounted) return;

        loadingFramesRef.current.delete(frameIndex);
        loadedFramesRef.current.add(frameIndex);

        const requestedFrame = requestedFrameRef.current;
        const posterReady = loadedFramesRef.current.has(POSTER_FRAME);

        if (
          frameIndex === requestedFrame ||
          renderedFrameRef.current === -1 ||
          (frameIndex === POSTER_FRAME && requestedFrame < 0)
        ) {
          renderedFrameRef.current = drawFrame(requestedFrame >= 0 ? requestedFrame : POSTER_FRAME);
        }

        setFrameState({
          loaded: loadedFramesRef.current.size,
          ready: posterReady,
          complete: loadedFramesRef.current.size >= TOTAL_FRAMES,
        });
      };

      image.onload = markLoaded;
      image.onerror = markLoaded;
      image.src = `/assets/sequence/frame_${frameIndex}.jpg`;
      framesRef.current[frameIndex] = image;
    };

    const preloadFrameWindow = (frameIndex: number, radius = 4) => {
      loadFrame(frameIndex);
      for (let offset = 1; offset <= radius; offset += 1) {
        loadFrame(frameIndex - offset);
        loadFrame(frameIndex + offset);
      }
    };

    const startSequenceLoading = () => {
      if (sequenceStartedRef.current) return;
      sequenceStartedRef.current = true;

      let nextIndex = 0;
      const loadBatch = () => {
        for (let count = 0; count < 8 && nextIndex < TOTAL_FRAMES; count += 1) {
          loadFrame(nextIndex);
          nextIndex += 1;
        }

        if (nextIndex < TOTAL_FRAMES && mounted) {
          sequenceTimer = window.setTimeout(loadBatch, 90);
        }
      };

      loadBatch();
    };

    const updateScrollState = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const totalHeight = rect.height;
      
      // Calculate exactly how much the user has scrolled through this container section
      const scrolledPixels = -rect.top;
      const maxScroll = totalHeight - window.innerHeight;
      const totalProgress = clamp(scrolledPixels / maxScroll, 0, 1);

      // The window growth is entrance-based, so it is complete before the
      // long sticky playback range starts.
      const growStart = window.innerHeight;
      const growEnd = window.innerHeight * 0.42;
      const growProgress = clamp(
        (growStart - rect.top) / (growStart - growEnd),
        0,
        1,
      );

      // The frame sequence uses the sticky range. This keeps the section
      // pinned until the sequence is almost completely played.
      const videoProgress = clamp(totalProgress / VIDEO_END, 0, 1);

      // Shrink the frame back down after the video finishes.
      const shrinkProgress = clamp(
        (totalProgress - SHRINK_START) / (1 - SHRINK_START),
        0,
        1,
      );

      // Handle Smooth Canvas Sequence Updates
      targetFrameRef.current = POSTER_FRAME + videoProgress * (TOTAL_FRAMES - 1 - POSTER_FRAME);
      preloadFrameWindow(Math.round(targetFrameRef.current), sequenceStartedRef.current ? 3 : 1);

      // Handle Card Window Dimensional Scaling Properties
      if (frameRef.current) {
        const growEase = easeInOut(growProgress);
        const shrinkEase = easeInOut(shrinkProgress);
        const net = clamp(growEase - shrinkEase, 0, 1);

        const scale = 0.42 + (net * 0.58);
        const radius = 42 - (net * 14);
        const opacity = 0.72 + (net * 0.28);

        frameRef.current.style.setProperty("--cinema-scale", scale.toFixed(4));
        frameRef.current.style.setProperty("--cinema-radius", `${radius.toFixed(1)}px`);
        frameRef.current.style.setProperty("--cinema-opacity", opacity.toFixed(3));
      }

      if (introRef.current) {
        const introOpacity = 1 - clamp(growProgress * 1.8, 0, 1);
        introRef.current.style.opacity = introOpacity.toFixed(3);
        introRef.current.style.transform = `translateY(${(-20 * growProgress).toFixed(1)}px)`;
      }

      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${videoProgress.toFixed(4)})`;
      }
    };

    const tick = () => {
      updateScrollState();

      const target = targetFrameRef.current;
      const eased = easedFrameRef.current + (target - easedFrameRef.current) * LERP;
      const easedDistance = Math.abs(target - eased);
      
      easedFrameRef.current = easedDistance < MIN_DELTA_TO_DRAW ? target : eased;

      const nextFrame = clamp(
        Math.round(easedFrameRef.current),
        0,
        TOTAL_FRAMES - 1,
      );

      if (nextFrame !== requestedFrameRef.current) {
        requestedFrameRef.current = nextFrame;
        preloadFrameWindow(nextFrame, sequenceStartedRef.current ? 3 : 1);
        renderedFrameRef.current = drawFrame(nextFrame);
      }

      rafRef.current = window.requestAnimationFrame(tick);
    };

    resizeCanvas();
    drawFallback();

    framesRef.current = new Array(TOTAL_FRAMES);
    preloadFrameWindow(POSTER_FRAME, 4);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          startSequenceLoading();
          observer.disconnect();
        }
      },
      { rootMargin: "900px 0px" },
    );

    observer.observe(sectionRef.current ?? canvas);

    updateScrollState();
    tick();

    window.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", resizeCanvas);

    return () => {
      mounted = false;
      window.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", resizeCanvas);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
      if (sequenceTimer !== null) {
        window.clearTimeout(sequenceTimer);
      }
      observer.disconnect();
    };
  }, []);

  const progress = Math.min(
    100,
    Math.round((frameState.loaded / TOTAL_FRAMES) * 100),
  );

  return (
    <section 
      className="cinema-section theme-light" 
      ref={sectionRef} 
      style={{
        minHeight: "520vh",
        position: "relative",
        width: "100%",
        overflow: "visible",
        padding: 0,
        backgroundColor: "#f5f5f5",
      }}
    >
      <div 
        className="cinema-sticky" 
        ref={stickyRef} 
        style={{ 
          position: "sticky", 
          top: 0, 
          zIndex: 30,
          height: "100vh", 
          width: "100%",
          display: "flex", 
          flexDirection: "column", 
          justifyContent: "center", 
          alignItems: "center", 
          overflow: "hidden"
        }}
      >
        {/* Intro text starts centered above the card element */}
        <div className="cinema-intro" ref={introRef} data-reveal style={{ textAlign: "center", marginBottom: "2.5rem", zIndex: 10, pointerEvents: "none" }}>
          <p className="mono-tag eyebrow" style={{ fontSize: "0.75rem", letterSpacing: "2px", opacity: 0.6, margin: 0 }}>VISUAL CORE // MUTATION FIELD</p>
          <h2 className="section-heading" style={{ margin: "0.5rem 0 0 0", fontSize: "1.5rem", fontWeight: 400, color: "#111" }}>
            A controlled viewport for the optimization engine.
          </h2>
        </div>

        <div 
          className="cinema-frame" 
          ref={frameRef} 
          data-reveal
          style={{
            border: "1px solid rgba(255, 255, 255, 0.14)",
            borderRadius: "var(--cinema-radius, 42px)",
            opacity: "var(--cinema-opacity, 0.72)",
            width: "calc(100vw - clamp(32px, 6vw, 112px))",
            height: "calc(100vh - clamp(48px, 10vh, 132px))",
            maxWidth: "none",
            maxHeight: "none",
            aspectRatio: "auto",
            margin: 0,
            position: "absolute",
            top: "50%",
            left: "50%",
            backgroundColor: "#000",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            overflow: "hidden",
            boxShadow: "0 44px 110px -36px rgba(0,0,0,0.75), 0 0 0 1px rgba(0,0,0,0.32)",
            transform: "translate(-50%, -50%) scale(var(--cinema-scale, 0.42))",
            transformOrigin: "center center",
            willChange: "transform, border-radius"
          }}
        >
          <div className="cinema-meta cinema-meta-top" style={{ padding: "24px", display: "flex", justifyContent: "space-between", color: "#fff", zIndex: 5, fontSize: "0.7rem", fontFamily: "monospace", opacity: 0.8 }}>
            <span>FRAME_STREAM // 000-295</span>
            <span>{progress.toString().padStart(3, "0")}% LOADED</span>
          </div>

          <canvas 
            ref={canvasRef} 
            className="cinema-canvas" 
            aria-hidden="true" 
            style={{ 
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%", 
              height: "100%", 
              display: "block"
            }} 
          />

          <div className="cinema-shade" />

          {!frameState.complete ? (
            <div className="cinema-loader" aria-hidden="true" style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", color: "#fff", textAlign: "center", zIndex: 4, fontFamily: "monospace", fontSize: "0.75rem" }}>
              <span>COMPILING CIRCUIT EVOLVE OPTIMIZATION CORE ({progress}%)</span>
            </div>
          ) : null}

          <div className="cinema-meta cinema-meta-bottom" style={{ padding: "24px", display: "flex", justifyContent: "space-between", color: "#fff", zIndex: 5, fontSize: "0.7rem", fontFamily: "monospace", opacity: 0.8 }}>
            <span>SCROLL_LINKED_SCALE</span>
            <span>YOSYS // OPENROAD // DESIGN COMPILER</span>
          </div>

          <div className="cinema-progress" aria-hidden="true" style={{ position: "absolute", bottom: 0, left: 0, width: "100%", zIndex: 6 }}>
            <div ref={progressRef} style={{ height: "4px", backgroundColor: "#fff", transformOrigin: "left", transform: "scaleX(0)" }} />
          </div>
        </div>
      </div>
    </section>
  );
}
