const ppaRows = [
  {
    vector: "Synthesis Area",
    baseline: "Repository RTL baseline compiled through Yosys + Design Compiler",
    optimized: "+21.4% Synthesis Area Efficiency",
    verification: "Gate-level netlist parity held at zero known defects",
  },
  {
    vector: "Critical Path",
    baseline: "OpenROAD timing reports across evolved placement candidates",
    optimized: "-14.2% Critical Path Latency Reduction",
    verification: "Slack deltas validated against semantic equivalence gates",
  },
  {
    vector: "Correctness",
    baseline: "Syntactic parse, elaboration, simulation, and semantic checks",
    optimized: "Zero Defect Verification",
    verification: "All accepted mutations pass compile and behavioral guards",
  },
  {
    vector: "Power Envelope",
    baseline: "Absolute PPA matrix with module-normalized switching estimates",
    optimized: "Closed-loop power regression tracking",
    verification: "Rejected candidates isolated before signoff promotion",
  },
];

const traces = [
  {
    title: "Multi-file repository-scale RTL evolution",
    copy: "CircuitEvolve treats a hardware repository as a connected transformation surface: module files, package dependencies, test harnesses, synthesis scripts, and downstream EDA reports are preserved as one optimization state instead of isolated snippets.",
  },
  {
    title: "LLM-guided mutation graph",
    copy: "Candidate edits are represented as graph branches with lineage metadata. The system keeps divergent RTL families alive, compares local and global gains, and avoids collapsing the search into a single recent candidate.",
  },
  {
    title: "Closed-loop EDA verification",
    copy: "Every promoted candidate moves through Yosys parsing and synthesis, OpenROAD physical feedback, and Synopsys Design Compiler grade checks where available. Failed compile, timing, or constraint states are fed back into the next mutation pass.",
  },
  {
    title: "Syntactic and semantic correctness matching",
    copy: "The acceptance loop separates syntax validity from behavioral validity: parsable Verilog is only a first gate, followed by interface preservation, simulation compatibility, and semantic equivalence checks against the intended RTL contract.",
  },
];

export default function TechnicalMatrix() {
  return (
    <>
      <section className="section theme-light section-wipe" id="matrix">
        <div className="section-inner">
          <p className="mono-tag eyebrow" data-reveal>
            TECHNICAL MATRIX // CLOSED LOOP
          </p>
          <h2 className="section-heading" data-reveal>
            Absolute PPA evidence, not prompt theater.
          </h2>

          <div className="matrix-shell" data-reveal>
            <div className="matrix-head">
              <div className="matrix-cell">Vector</div>
              <div className="matrix-cell">Baseline Capture</div>
              <div className="matrix-cell">Optimized Delta</div>
              <div className="matrix-cell">Acceptance Gate</div>
            </div>
            {ppaRows.map((row) => (
              <div className="matrix-row" key={row.vector}>
                <div className="matrix-cell">
                  <span className="matrix-value">{row.vector}</span>
                </div>
                <div className="matrix-cell">{row.baseline}</div>
                <div className="matrix-cell">
                  <span className="matrix-value">{row.optimized}</span>
                </div>
                <div className="matrix-cell">{row.verification}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section theme-light section-wipe" id="verification">
        <div className="section-inner">
          <p className="mono-tag eyebrow" data-reveal>
            REPOSITORY LOGS // MUTATION TRACE
          </p>
          <h2 className="section-heading" data-reveal>
            From RTL edit proposal to signoff-grade rejection or promotion.
          </h2>

          <div className="trace-grid">
            {traces.map((trace, index) => (
              <div className="trace-line" data-reveal key={trace.title}>
                <p className="mono-tag" style={{ color: "var(--dim)" }}>
                  TRACE_{String(index + 1).padStart(2, "0")}
                </p>
                <p className="sector-copy">
                  <strong>{trace.title}</strong>
                  {trace.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
