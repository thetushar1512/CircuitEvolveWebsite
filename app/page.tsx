import VideoWindow from "@/components/VideoWindow";
import ScrollReveal from "@/components/ScrollReveal";
import DemoForm from "@/components/DemoForm";
import type { CSSProperties } from "react";

const brandLetters = "circuitEvolve".split("");

export default function Home() {
  return (
    <>
      <ScrollReveal />
      <main className="site-shell">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="section hero theme-light hero-centered" id="top">
        <div className="hero-centered-inner">
          <img src="/assets/ce-logo.png" alt="" className="hero-center-logo-bare" />

          <h1 className="hero-title hero-brand-title" aria-label="CircuitEvolve">
            <span className="hero-brand-word" aria-hidden="true">
              {brandLetters.map((letter, index) => (
                <span
                  className="hero-brand-char"
                  key={`${letter}-${index}`}
                  style={{
                    animationDelay: `${260 + index * 48}ms`,
                    "--char-index": index,
                  } as CSSProperties}
                >
                  {letter}
                </span>
              ))}
            </span>
          </h1>

          <p className="hero-tagline">Design. Iterate. Converge.</p>

          <a href="/thesis" className="thesis-cta-btn hero-thesis-btn">Our Thesis</a>
        </div>
      </section>

      {/* ── Video window ─────────────────────────────────────────────────── */}
      <section className="section theme-light video-window-section">
        <div className="section-inner video-window-wrap">
          <VideoWindow />
        </div>
      </section>

      {/* ── Request a Demo ───────────────────────────────────────────────── */}
      <section className="section theme-light section-wipe demo-section" id="demo">
        <div className="demo-card">
          <div className="demo-card-left" data-reveal>
            <p className="mono-tag demo-card-eyebrow">CONTACT // LIMITED RUN</p>
            <h2 className="demo-card-heading">Request a Demo</h2>
            <p className="demo-card-sub">
              See how circuitEvolve can accelerate your analog circuit design
              workflow. Fill out the form and our team will get in touch.
            </p>
            <a href="mailto:hello@circuitevolve.com" className="demo-card-email">
              hello@circuitevolve.com
            </a>
          </div>
          <div className="demo-card-right" data-reveal>
            <DemoForm />
          </div>
        </div>
      </section>

      </main>
    </>
  );
}
