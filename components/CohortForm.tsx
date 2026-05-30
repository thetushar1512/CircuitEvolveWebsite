"use client";

import { FormEvent, useState } from "react";

type FormStatus = "idle" | "processing" | "confirmed";

export default function CohortForm() {
  const [status, setStatus] = useState<FormStatus>("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (status === "processing") {
      return;
    }

    setStatus("processing");

    window.setTimeout(() => {
      setStatus("confirmed");
      event.currentTarget.reset();
    }, 900);
  }

  const buttonLabel =
    status === "processing"
      ? "PROCESSING REQUEST"
      : status === "confirmed"
        ? "REQUEST CONFIRMED"
        : "REQUEST COHORT ACCESS";

  return (
    <form className="cohort-form" onSubmit={handleSubmit}>
      <div className="field">
        <label className="mono-tag" htmlFor="name">
          Principal Contact
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Full name"
          required
          autoComplete="name"
        />
      </div>

      <div className="field">
        <label className="mono-tag" htmlFor="email">
          Work Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="name@organization.com"
          required
          autoComplete="email"
        />
      </div>

      <div className="field">
        <label className="mono-tag" htmlFor="organization">
          Lab / Organization
        </label>
        <input
          id="organization"
          name="organization"
          type="text"
          placeholder="EDA team, research lab, or silicon group"
          required
          autoComplete="organization"
        />
      </div>

      <div className="field">
        <label className="mono-tag" htmlFor="domain">
          RTL Optimization Surface
        </label>
        <input
          id="domain"
          name="domain"
          type="text"
          placeholder="CPU blocks, accelerators, SoC subsystems, DSP datapaths"
          required
        />
      </div>

      <div className="field">
        <label className="mono-tag" htmlFor="toolchain">
          Verification Toolchain
        </label>
        <input
          id="toolchain"
          name="toolchain"
          type="text"
          placeholder="Yosys, OpenROAD, Design Compiler, custom signoff"
        />
      </div>

      <button
        className="submit-button"
        disabled={status === "processing"}
        type="submit"
      >
        {buttonLabel}
      </button>

      {status === "confirmed" ? (
        <div className="form-confirmation" role="status">
          <p className="mono-tag">CANDIDATE CAPTURED // QUEUE_POSITION: ACTIVE</p>
          <p style={{ marginTop: 14, lineHeight: 1.7 }}>
            Your cohort request has been staged for review. The next step is a
            repository-scale RTL workload fit check against the CircuitEvolve
            verification harness.
          </p>
        </div>
      ) : null}
    </form>
  );
}
