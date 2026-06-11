"use client";

import { FormEvent, useState } from "react";

type Status = "idle" | "processing" | "confirmed";

const purposes = [
  "Analog circuit design",
  "RTL optimization",
  "EDA workflow automation",
  "Research / Academia",
  "Other",
];

export default function DemoForm() {
  const [status, setStatus] = useState<Status>("idle");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "processing") return;
    setStatus("processing");
    window.setTimeout(() => setStatus("confirmed"), 900);
  }

  if (status === "confirmed") {
    return (
      <div className="df-confirmed">
        <p className="df-confirmed-title">Request received.</p>
        <p className="df-confirmed-body">
          Thanks — our team will be in touch shortly at the email you provided.
        </p>
      </div>
    );
  }

  return (
    <form className="df-form" onSubmit={handleSubmit}>
      <div className="df-row">
        <div className="df-field">
          <label className="df-label" htmlFor="df-first">
            First Name <span className="df-req">*</span>
          </label>
          <input id="df-first" name="first_name" type="text" className="df-input" required autoComplete="given-name" />
        </div>
        <div className="df-field">
          <label className="df-label" htmlFor="df-last">
            Last Name <span className="df-req">*</span>
          </label>
          <input id="df-last" name="last_name" type="text" className="df-input" required autoComplete="family-name" />
        </div>
      </div>

      <div className="df-field">
        <label className="df-label" htmlFor="df-email">
          Email <span className="df-req">*</span>
        </label>
        <input id="df-email" name="email" type="email" className="df-input" required autoComplete="email" />
      </div>

      <div className="df-field">
        <label className="df-label" htmlFor="df-company">
          Company <span className="df-req">*</span>
        </label>
        <input id="df-company" name="company" type="text" className="df-input" required autoComplete="organization" />
      </div>

      <div className="df-field">
        <label className="df-label" htmlFor="df-job">
          Job Title
        </label>
        <input id="df-job" name="job_title" type="text" className="df-input" autoComplete="organization-title" />
      </div>

      <div className="df-field">
        <label className="df-label" htmlFor="df-purpose">
          Purpose
        </label>
        <select id="df-purpose" name="purpose" className="df-select">
          <option value="">Select...</option>
          {purposes.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div className="df-field df-field--textarea">
        <label className="df-label" htmlFor="df-info">
          Additional Information
        </label>
        <textarea
          id="df-info"
          name="info"
          rows={3}
          className="df-textarea"
          placeholder="Tell us about your use case..."
        />
      </div>

      <button type="submit" className="df-submit" disabled={status === "processing"}>
        {status === "processing" ? "Submitting…" : "Request Demo"}
      </button>

      <p className="df-contact">
        You can also reach us directly at{" "}
        <a href="mailto:hello@circuitevolve.com" className="df-email-link">
          hello@circuitevolve.com
        </a>
      </p>
    </form>
  );
}
