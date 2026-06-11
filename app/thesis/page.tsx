import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Next Era of Analog Design | circuitEvolve",
  description:
    "For decades semiconductor innovation followed a simple pattern. Analog design never made that transition.",
};

const paragraphs = [
  {
    lead: "For decades semiconductor innovation followed a simple pattern.",
    body: "Digital design became software. Hardware description languages, synthesis engines, and automated place and route transformed chip development into a scalable engineering discipline. A designer could describe behavior and trust the tools to construct the silicon.",
  },
  {
    lead: "Analog design never made that transition.",
    body: "Analog circuits operate directly in the physical domain of voltages, currents, and device physics. Every transistor dimension, bias point, and compensation network shapes the behavior of the system. The design space is continuous, nonlinear, and deeply coupled. Instead of synthesis flows, analog engineers still rely on experience, manual iteration, and thousands of simulations to converge on a working design.",
  },
  {
    lead: "This gap has become one of the defining constraints of modern semiconductor development.",
    body: "Nearly every system that powers the physical world depends on analog silicon. Cars rely on power management, sensing, and control circuits. Aircraft and industrial systems require precision signal conditioning. Telecommunications infrastructure, renewable energy systems, and wireless devices all depend on specialized analog interfaces that connect computation to reality. As these systems become more complex, the number of custom analog blocks required in each chip continues to grow.",
  },
  {
    lead: "Yet the way these circuits are designed has barely changed.",
    body: "Analog design has not scaled with the rest of semiconductor automation. The process remains labor intensive and expertise driven. Training a strong analog designer takes many years, and the global supply of engineers with this expertise cannot keep pace with demand. Across the industry, analog blocks increasingly define the critical path of chip development.",
  },
  {
    lead: "A new class of design systems is emerging.",
    body: "Instead of treating circuits as static artifacts tuned through manual iteration, these systems treat them as structures that can be explored, reasoned about, and improved through automated search. They combine advances in computational intelligence, large scale simulation, and programmatic representations of circuits to explore design spaces that humans rarely have the time to investigate.",
  },
  {
    lead: "This shift changes what is possible in analog design.",
    body: "Architectures that once required months of exploration can be evaluated in days. Circuit structures can be reexamined rather than simply tuned. Engineers can move from transistor level trial and error toward higher level reasoning about performance, constraints, and system behavior.",
  },
  {
    lead: "This is why circuitEvolve exists.",
    body: "We believe the next era of semiconductor innovation will require a fundamentally different approach to analog design. One that expands the space of circuits engineers can explore and accelerates the path from specification to silicon. One that allows designers to focus on insight and architecture while computation handles the search.",
  },
  {
    lead: "Analog design has always been where silicon meets the real world.",
    body: "The tools used to create it are about to change.",
  },
];

export default function ThesisPage() {
  return (
    <main className="tp-root">
      {/* ── Nav ── */}
      <nav className="tp-nav">
        <Link href="/" className="tp-back">
          <span className="tp-back-arrow">←</span>
          <img src="/assets/ce-logo.png" alt="" className="tp-nav-logo" />
          <span className="tp-back-label">circuitEvolve</span>
        </Link>
      </nav>

      {/* ── Logo hero ── */}
      <header className="tp-hero">
        <img src="/assets/ce-logo.png" alt="" className="tp-hero-logo" />
        <h1 className="tp-title">The Next Era of<br />Analog Design</h1>
      </header>

      {/* ── Article ── */}
      <article className="tp-article">
        {paragraphs.map(({ lead, body }, i) => (
          <div className="tp-para" key={i}>
            <p className="tp-lead">{lead}</p>
            {body && <p className="tp-body">{body}</p>}
          </div>
        ))}
      </article>

      {/* ── Contact ── */}
      <footer className="tp-footer">
        <div className="tp-divider" />
        <p className="tp-contact-label">Contact Us</p>
        <a href="mailto:hello@circuitevolve.com" className="tp-contact-email">
          hello@circuitevolve.com
        </a>
        <Link href="/" className="tp-home-link">← Back to circuitEvolve</Link>
      </footer>
    </main>
  );
}
