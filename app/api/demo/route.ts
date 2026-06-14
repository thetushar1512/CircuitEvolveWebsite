import { NextRequest, NextResponse } from "next/server";

// Allow self-signed certs on local network (dev only)
if (process.env.NODE_ENV !== "production") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const DEMO_EMAIL_TO = process.env.DEMO_REQUEST_TO_EMAIL ?? "hello@circuitevolve.com";
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "circuitEvolve <onboarding@resend.dev>";

export async function POST(req: NextRequest) {
  if (!RESEND_API_KEY) {
    console.error("Missing RESEND_API_KEY in environment.");
    return NextResponse.json({ error: "Missing RESEND_API_KEY" }, { status: 500 });
  }

  const body = await req.json();
  const { first_name, last_name, email, company, job_title, purpose, info } = body;

  if (!first_name || !last_name || !email || !company) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const html = `
    <div style="font-family: sans-serif; max-width: 560px; color: #111;">
      <h2 style="margin-bottom: 24px;">New Demo Request</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0; color: #666; width: 120px;">Name</td><td>${first_name} ${last_name}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Email</td><td><a href="mailto:${email}">${email}</a></td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Company</td><td>${company}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Job Title</td><td>${job_title || "—"}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Purpose</td><td>${purpose || "—"}</td></tr>
        <tr><td style="padding: 8px 0; color: #666; vertical-align: top;">Notes</td><td>${info || "—"}</td></tr>
      </table>
    </div>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: RESEND_FROM_EMAIL,
      to: DEMO_EMAIL_TO,
      subject: `Demo request: ${first_name} ${last_name} — ${company}`,
      html,
    }),
  });

  const text = await res.text();
  console.error("Resend response:", res.status, text);

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to send email", detail: text }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
