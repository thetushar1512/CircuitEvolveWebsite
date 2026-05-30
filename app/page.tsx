import CanvasEngine from "@/components/CanvasEngine";
import HeroLogoScene from "@/components/HeroLogoScene";
import CohortForm from "@/components/CohortForm";
import ScrollReveal from "@/components/ScrollReveal";
import TechnicalMatrix from "@/components/TechnicalMatrix";
import ThesisSection from "@/components/ThesisSection";
import type { CSSProperties } from "react";

const sectors = [
  {
    title: "Cross-Module Scope Analysis",
    copy: "CircuitEvolve evaluates RTL as a repository-scale organism: shared packages, module boundaries, generated artifacts, synthesis constraints, and downstream verification scripts are mapped before mutation so every accepted edit remains coherent across the codebase.",
  },
  {
    title: "Automated Yosys Validation Loops",
    copy: "Mutation candidates are compiled through Yosys front-end checks, synthesis passes, hierarchy validation, and report extraction. Invalid Verilog, broken elaboration, and module-interface drift are rejected before PPA scoring.",
  },
  {
    title: "Graph Code Mutation Maps",
    copy: "LLM-generated patches become a navigable mutation graph. Branch ancestry, failure cause, semantic risk, and PPA deltas are retained so earlier high-potential RTL lineages can be revived instead of buried by recency bias.",
  },
];

const brandLetters = "CircuitEvolve".split("");

export default function Home() {
  return (
    <>
      <ScrollReveal />

      <main className="site-shell">
        <header className="site-header">
          <a className="mono-tag header-brand" href="#top" aria-label="CircuitEvolve home">
            <img src="/assets/ce-logo.png" alt="" className="header-logo" aria-hidden="true" />
            CircuitEvolve // CE-RTL
          </a>
          <p className="mono-tag header-center">VIEWPORT_TRACK // 000-295</p>
          <div className="header-status">
            <span className="mono-tag">CORE_ENGINE // OPERATIONAL</span>
            <span className="status-dot" aria-hidden="true" />
          </div>
        </header>

        <section className="section hero theme-light" id="top">
          <div className="section-inner hero-grid">
            <div>
              <p className="mono-tag eyebrow">
                LLM-GUIDED RTL EVOLUTION // CLOSED-LOOP EDA
              </p>
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
              <p className="hero-copy">
                CircuitEvolve transforms multi-file hardware repositories into
                measurable optimization loops: graph-aware RTL mutations,
                production EDA verification, and accepted candidates that
                preserve correctness while improving Power-Performance-Area
                outcomes.
              </p>
              <a href="/thesis" className="thesis-cta-btn">Our Thesis</a>
            </div>

            <aside className="hero-spec">
              <HeroLogoScene />
              <p className="mono-tag">LIVE OPTIMIZATION SURFACE</p>
              <p>
                The brand mark responds like a routing surface: traces wake,
                packets move, and the CE core locks to the cursor while the
                system maps modules, dependencies, generated build surfaces, and
                toolchain feedback into one optimization state.
              </p>
            </aside>
          </div>
        </section>

        <section className="section theme-light section-wipe" id="scope">
          <div className="section-inner">
            <p className="mono-tag eyebrow" data-reveal>
              CORE INGESTION // REPO SCALE
            </p>
            <h2 className="section-heading" data-reveal>
              A monochrome control surface for autonomous hardware search.
            </h2>

            <div className="data-columns">
              {sectors.map((sector, index) => (
                <article className="data-sector" data-reveal key={sector.title}>
                  <p className="mono-tag sector-index">
                    SECTOR_{String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="sector-title">{sector.title}</h3>
                  <p className="sector-copy">{sector.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <CanvasEngine />

        <TechnicalMatrix />

        <ThesisSection />

        <section className="section theme-light section-wipe" id="cohort">
          <div className="section-inner form-wrap">
            <div>
              <p className="mono-tag eyebrow" data-reveal>
                COHORT ACCESS // LIMITED RUN
              </p>
              <h2 className="section-heading" data-reveal>
                Bring a real RTL workload into the loop.
              </h2>
              <p className="form-copy" data-reveal>
                Early cohort candidates are evaluated for repositories with
                meaningful synthesis surfaces, deterministic verification
                harnesses, and measurable PPA pressure. CircuitEvolve is tuned
                for teams ready to test autonomous mutation against real EDA
                constraints rather than isolated demo modules.
              </p>
            </div>

            <div data-reveal>
              <CohortForm />
            </div>
          </div>
        </section>

        <footer className="site-footer theme-light">
          <div className="footer-brand" aria-hidden="true">
            <div className="footer-brand-ring" />
            <img src="/assets/ce-logo.png" alt="" className="footer-brand-logo" />
          </div>
          <p className="mono-tag">
            CIRCUITEVOLVE // RTL MUTATION GRAPH // YOSYS + OPENROAD + SYNOPSYS
            DESIGN COMPILER // ZERO DEFECT VERIFICATION TARGET
          </p>
        </footer>
      </main>
    </>
  );
}
