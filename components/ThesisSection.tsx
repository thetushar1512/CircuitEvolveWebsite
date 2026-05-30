"use client";

import { useState } from "react";

// ── Shared sub-components ────────────────────────────────────────────────────

function Panel({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="thesis-panel">
      <button className="thesis-panel-trigger" onClick={onToggle} aria-expanded={isOpen}>
        <span>{title}</span>
        <span className="thesis-chevron" aria-hidden="true">
          {isOpen ? "−" : "+"}
        </span>
      </button>
      {isOpen && <div className="thesis-panel-body">{children}</div>}
    </div>
  );
}

function ComparisonTable({
  caption,
  headers,
  rows,
}: {
  caption?: string;
  headers: [string, string, string, string];
  rows: [string, string, string, string][];
}) {
  return (
    <div className="thesis-table-wrap">
      {caption && (
        <p className="mono-tag" style={{ marginBottom: "10px", opacity: 0.6 }}>
          {caption}
        </p>
      )}
      <table className="thesis-table">
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} className={j === 3 ? "thesis-col-improvement" : ""}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FigureImage({
  src,
  alt,
  caption,
  variant,
}: {
  src: string;
  alt: string;
  caption: string;
  variant?: "narrow" | "chart";
}) {
  const cls = `thesis-figure-img${variant ? ` thesis-figure-img--${variant}` : ""}`;
  return (
    <figure className="thesis-figure">
      <img src={src} alt={alt} className={cls} />
      <figcaption className="thesis-caption">{caption}</figcaption>
    </figure>
  );
}

// ── Accordion content ────────────────────────────────────────────────────────

function ProblemContent() {
  return (
    <div className="thesis-prose">
      <p>
        Analog circuit design remains largely a <strong>manual optimization process</strong>.
        Engineers must iteratively explore circuit topologies, adjust device sizing, and repeatedly
        validate designs through simulation to meet target specifications. Even with modern design
        environments, much of this exploration is guided by expert intuition and trial-and-error
        iteration.
      </p>
      <p>
        As a result, convergence to a valid design can require{" "}
        <u>thousands of SPICE simulations and significant engineering time</u>. The design space is
        both large and tightly constrained: topology choices, transistor sizing, bias allocation,
        and compensation strategies must simultaneously satisfy requirements for stability, power,
        noise, bandwidth, and robustness across process, voltage, and temperature variations.
      </p>
      <p>
        <u>Existing approaches typically address only a portion of this problem.</u> Many tools
        focus on parameter optimization within a fixed circuit topology, while recent machine
        learning systems attempt to accelerate sizing for predefined circuit structures. These
        approaches improve local optimization but do not address the broader challenge of{" "}
        <strong>exploring both circuit topology and device sizing</strong> under real analog
        constraints.
      </p>
      <p>
        The core problem is therefore not only faster sizing, but{" "}
        <u>scalable automation of the full design search process</u>. This includes discovering
        viable circuit structures, tuning device parameters, and verifying performance through
        simulation. That is the technical gap circuitEvolve is designed to address.
      </p>
    </div>
  );
}

function WhatContent() {
  const steps: [string, string][] = [
    [
      "Step 1 — Design Specifications and Baseline Circuit",
      "The system begins with a problem specification and an initial circuit design. The starting design may be a baseline design schematic or a parameterized circuit template. In addition to the circuit description, the system receives a set of design rules and constraints that define the allowable device types, node naming conventions, and bias source interfaces used within the design environment.",
    ],
    [
      "Step 2 — LLM-Guided Circuit Edits",
      "A large language model proposes candidate modifications to the circuit. These modifications can include adjustments to device parameters as well as structural edits such as inserting additional devices, modifying current paths, or altering bias configurations. To maintain robustness, the model output is restricted to a structured format that limits changes to predefined editable sections of the design schematic.",
    ],
    [
      "Step 3 — Harness Rebuild",
      "The system extracts the editable portion of the proposal and integrates it into a standardized simulation harness. The harness reconstructs the complete design schematic including supplies, loads, device models, stimuli, and measurement directives. This ensures that every candidate design is evaluated within an identical simulation environment.",
    ],
    [
      "Step 4 — Simulation-Based Evaluation",
      "Each candidate circuit is evaluated using a circuit simulator such as ngspice, Spectre, or HSPICE. The simulator computes the required performance metrics, including gain, bandwidth, noise, power consumption, and stability. These metrics provide the ground-truth assessment of circuit behavior.",
    ],
    [
      "Step 5 — Fitness Evaluation",
      "Simulation results are converted into a fitness score representing how well the candidate design satisfies the target specifications. Designs that violate critical constraints receive penalties, while designs that improve key performance metrics are assigned higher scores.",
    ],
    [
      "Step 6 — Evolutionary Selection",
      "The system stores each evaluated candidate along with its performance metrics. An evolutionary selection process chooses high-performing circuits to act as parents for the next generation. The selection process also preserves diversity across candidate circuits to prevent premature convergence to local optima. This loop continues until the system converges to a design that satisfies the target specifications or until a predefined search budget is exhausted.",
    ],
  ];

  return (
    <div className="thesis-prose">
      <div className="thesis-lead">
        <h3 className="thesis-sub-heading">What is circuitEvolve?</h3>
        <p className="thesis-tagline">
          A simulator-grounded search system for topology and sizing optimization in analog circuit
          design.
        </p>
      </div>

      <blockquote className="thesis-block">
        circuitEvolve is a simulator-grounded search system for analog circuit optimization. The
        system operates directly on circuit design schematics and iteratively proposes modifications
        to both circuit topology and device parameters. Each candidate design is evaluated through
        SPICE simulation, and the results are used to guide further exploration of the design space.
        By combining large language model-guided edits with simulation feedback, circuitEvolve
        enables automated exploration of circuit structures rather than restricting optimization to
        parameter tuning within a fixed architecture.
      </blockquote>

      <h3 className="thesis-sub-heading">Design Search Formulation</h3>
      <p>
        Analog circuit design can be formulated as a constrained search problem over circuit
        structures and device parameters. The design space includes topology selection, transistor
        sizing, bias allocation, and compensation strategies. These choices must satisfy strict
        constraints including stability, voltage headroom, noise performance, power consumption, and
        robustness across process, voltage, and temperature variations.
      </p>
      <p>
        Because of the nonlinear and tightly coupled behavior of analog circuits, analytical models
        alone are insufficient to guarantee design correctness. As a result, circuit simulation
        remains the primary mechanism for validating circuit behavior. In this setting, the design
        task becomes an iterative search process in which candidate circuits are generated,
        simulated, and evaluated against target specifications.
      </p>
      <p>
        circuitEvolve formulates analog design as a simulation-driven optimization framework
        operating directly on circuit design schematics. Instead of treating the circuit structure
        as fixed, the system searches over both topology and parameter configurations in order to
        discover designs that satisfy performance constraints.
      </p>

      <h3 className="thesis-sub-heading">System Architecture</h3>
      <p>
        circuitEvolve performs iterative circuit optimization by generating candidate design
        schematic modifications, evaluating them through simulation, and using the resulting
        performance signals to guide subsequent search. Starting from a baseline circuit, the system
        repeatedly proposes modifications to the design, evaluates the circuits through simulation,
        and retains high-performing candidates for further exploration.
      </p>

      <FigureImage
        src="/assets/figure1.png"
        alt="circuitEvolve optimization loop flowchart"
        caption="Figure 1: circuitEvolve optimization loop. Candidate circuits are generated by an LLM, evaluated through SPICE simulation, and refined through evolutionary selection."
        variant="narrow"
      />

      {steps.map(([title, body], i) => (
        <div className="thesis-step" key={i}>
          <p className="thesis-step-title">{title}</p>
          <p>{body}</p>
        </div>
      ))}

      <h3 className="thesis-sub-heading" style={{ marginTop: "8px" }}>
        Overcoming Recency Bias in Agentic Design Systems
      </h3>
      <p>
        Agentic optimization systems that rely on sequential reasoning often exhibit a strong
        recency bias. Candidate designs are generated primarily from the most recently explored
        design state, causing the search process to follow a single trajectory through the design
        space. When this trajectory encounters a local optimum, the system may fail to recover
        earlier design alternatives that could lead to better solutions.
      </p>
      <p>
        circuitEvolve mitigates this limitation by maintaining a population of candidate circuits
        across multiple generations. Instead of relying only on the most recent design, the
        evolutionary framework preserves multiple design lineages simultaneously. This allows the
        system to revisit earlier design branches and continue exploring structural variations that
        may have initially appeared less promising.
      </p>
      <figure className="thesis-figure">
        <p className="thesis-caption" style={{ marginBottom: "8px" }}>
          Animation 1: Evolution of candidate circuit lineages across the optimization process,
          illustrating how preserved branches can later produce the strongest final design.
        </p>
        <img src="/assets/animation1.gif" alt="Lineage map animation" className="thesis-figure-img" />
      </figure>

      <FigureImage
        src="/assets/figure2.png"
        alt="Evolutionary lineage map Gen 34"
        caption="Figure 2: Evolutionary lineage map of circuit optimization. The final optimal circuit originates from an earlier branch rather than a recent candidate trajectory."
      />
    </div>
  );
}

function EvaluationContent() {
  return (
    <div className="thesis-prose">
      <p>
        We compare circuitEvolve against three optimization systems from the literature:{" "}
        <strong>BAGNet</strong>, a reinforcement learning based analog sizing system evaluated on
        the two-stage amplifier task; <strong>EEsizer</strong>, a general purpose agent for analog
        circuit sizing; and <strong>AmpAgent</strong>, a recently proposed method for LLM guided
        circuit optimization evaluated on the AZC amplifier benchmark. Each comparison reports
        three quantities: peak performance reached during optimization, number of evaluations
        required to reach a defined target threshold, and a search-efficiency score computed as
        peak performance divided by total evaluations at peak. These metrics jointly characterize
        solution quality, sample efficiency, and optimization effectiveness under a fixed evaluation
        budget.
      </p>

      {/* Comparison I */}
      <p className="mono-tag eyebrow" style={{ marginTop: "8px" }}>
        COMPARISON I
      </p>
      <h3 className="thesis-sub-heading">BAGNet</h3>
      <p>
        BAGNet applies reinforcement learning to the two-stage amplifier sizing problem, treating
        device parameter selection as a sequential decision process. We evaluate circuitEvolve on
        the same task under an identical composite objective and compare across the three reported
        quantities. The target threshold is set at 0.65, corresponding to a level BAGNet reaches
        after extensive search.
      </p>
      <ComparisonTable
        headers={["Metric", "BAGNet", "circuitEvolve", "Improvement"]}
        rows={[
          ["Peak performance", "0.70", "1.00", "1.43× higher"],
          ["Evaluations to reach target (0.65)", "589", "74", "7.96× fewer"],
          ["Peak performance / evaluations at peak", "0.000736", "0.005000", "6.79× better"],
        ]}
      />
      <p>
        circuitEvolve reaches the target threshold in 74 evaluations compared to 589 for BAGNet,
        attains a higher peak score of 1.00 against 0.70, and produces a search-efficiency score
        6.79× greater. The result indicates that simulation-grounded topology search extracts
        substantially more value from each evaluation than policy gradient sizing alone.
      </p>

      <h4 className="thesis-step-title" style={{ marginTop: "4px" }}>
        Per-evaluation runtime
      </h4>
      <p>
        Per-evaluation runtime determines how many circuit candidates can be assessed within a
        fixed wall-clock budget. A lower cost per evaluation directly expands the practical search
        horizon.
      </p>
      <FigureImage
        src="/assets/figure3.png"
        alt="Per-Evaluation Cost bar chart"
        caption="Figure 3: circuitEvolve reduces evaluation time from 4,153 ms to 335 ms, yielding 12.4× faster evaluation and 91.9% less evaluation time relative to BAGNet. This directly increases the practical search budget available under fixed compute."
        variant="chart"
      />

      <h4 className="thesis-step-title">Solution quality under fixed budget</h4>
      <p>
        Solution quality under a fixed evaluation budget provides a more complete picture than raw
        iteration count alone. circuitEvolve reaches the target threshold earlier and continues
        improving to a stronger final solution (peak 1.00 at ~200 evaluations), while BAGNet
        requires substantially more evaluations and saturates at a lower peak (0.70 at ~961
        evaluations).
      </p>
      <FigureImage
        src="/assets/figure4.png"
        alt="Optimization Quality vs Search Budget chart"
        caption="Figure 4: Optimization quality versus search budget. circuitEvolve reaches the target threshold (0.65) in 74 evaluations whereas BAGNet requires 589. circuitEvolve also reaches a higher peak performance (1.00) than BAGNet (0.70), indicating superior sample efficiency and stronger final optimization quality."
        variant="chart"
      />

      {/* Comparison II */}
      <p className="mono-tag eyebrow" style={{ marginTop: "8px" }}>
        COMPARISON II
      </p>
      <h3 className="thesis-sub-heading">EEsizer</h3>
      <p>
        EEsizer is an industrial sizing optimization framework that applies structured parameter
        search within a fixed circuit topology. Both systems are evaluated under the same composite
        objective and SPICE harness. The target threshold is set at 5.
      </p>
      <ComparisonTable
        headers={["Metric", "EEsizer", "circuitEvolve", "Improvement"]}
        rows={[
          ["Peak performance", "5.1869", "8.3003", "1.60× higher"],
          ["Evaluations to reach target (5)", "25", "7", "3.57× fewer"],
        ]}
      />

      {/* Comparison III */}
      <p className="mono-tag eyebrow" style={{ marginTop: "8px" }}>
        COMPARISON III
      </p>
      <h3 className="thesis-sub-heading">AmpAgent (AZC Amplifier)</h3>
      <p>
        AmpAgent applies an LLM guided optimization loop to the AZC amplifier, a widely used
        analog benchmark circuit. Performance is measured using the IFOMS objective, which
        aggregates gain-bandwidth product, phase margin, supply current, and load conditions into a
        single scalar. We compare the best circuit found by AmpAgent against the best circuit found
        by circuitEvolve on the same task.
      </p>
      <p>
        Using a target threshold of 192,000 IFOMS, corresponding to the baseline reference value
        reported in the AmpAgent paper, we compare search efficiency across both systems.
      </p>
      <ComparisonTable
        caption="AZC SEARCH EFFICIENCY (TARGET: 192,000 IFOMS)"
        headers={["Metric", "AmpAgent", "circuitEvolve", "Improvement"]}
        rows={[
          ["Peak performance", "322,340", "429,908", "1.33× higher"],
          ["Evaluations to reach target (192,000)", "20", "3", "6.67× fewer"],
          ["Performance at target / evaluations used", "9,600", "68,373", "7.12× better"],
        ]}
      />
      <p>
        circuitEvolve reaches the 192,000 IFOMS threshold in three evaluations. AmpAgent requires
        twenty. At the moment the threshold is crossed, circuitEvolve achieves a target-efficiency
        score of 68,373 against 9,600 for AmpAgent, a 7.12× difference. This indicates that
        circuitEvolve not only finds better circuits but converges to acceptable performance with
        substantially less search effort.
      </p>

      {/* Summary */}
      <div className="thesis-summary">
        <h3 className="thesis-sub-heading">Summary</h3>
        <p>
          Across all three comparisons the results are consistent. circuitEvolve achieves higher
          peak performance, reaches target thresholds in fewer evaluations, and produces stronger
          search-efficiency scores relative to each baseline. The gains are largest in sample
          efficiency, where circuitEvolve requires between 3.57× and 7.96× fewer evaluations to
          reach a given performance level. This pattern holds across reinforcement learning based
          sizing (BAGNet), general purpose analog sizing (EEsizer), and LLM guided circuit search
          (AmpAgent), suggesting the improvement is not task-specific but reflects a general
          advantage of simulation-grounded topology exploration over parameter-only optimization
          strategies.
        </p>
      </div>
    </div>
  );
}

// ── Main export ──────────────────────────────────────────────────────────────

export default function ThesisSection() {
  const [open, setOpen] = useState<string | null>(null);
  const toggle = (id: string) => setOpen((prev) => (prev === id ? null : id));

  return (
    <section className="section theme-light section-wipe" id="thesis">
      <div className="section-inner">
        <p className="mono-tag eyebrow" data-reveal>
          RESEARCH FOUNDATION // DESIGN THESIS
        </p>
        <h2 className="section-heading" data-reveal>
          Design. Iterate. Converge.
        </h2>

        <div className="thesis-panels" data-reveal>
          <Panel
            title="What problem are we solving?"
            isOpen={open === "problem"}
            onToggle={() => toggle("problem")}
          >
            <ProblemContent />
          </Panel>
          <Panel
            title="What is circuitEvolve?"
            isOpen={open === "what"}
            onToggle={() => toggle("what")}
          >
            <WhatContent />
          </Panel>
          <Panel
            title="Empirical Evaluation"
            isOpen={open === "empirical"}
            onToggle={() => toggle("empirical")}
          >
            <EvaluationContent />
          </Panel>
        </div>
      </div>
    </section>
  );
}
