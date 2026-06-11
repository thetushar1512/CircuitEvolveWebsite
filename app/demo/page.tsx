import DemoForm from "@/components/DemoForm";

export default function DemoPage() {
  return (
    <div className="demo-root">
      <div className="demo-inner">
        <a href="/" className="demo-back">
          <span className="demo-back-arrow">←</span>
          Back to Home
        </a>
        <h1 className="demo-heading">Request a Demo</h1>
        <p className="demo-sub">
          See how circuitEvolve can accelerate your analog circuit design workflow.
          Fill out the form below and our team will get in touch.
        </p>
        <DemoForm />
      </div>
    </div>
  );
}
