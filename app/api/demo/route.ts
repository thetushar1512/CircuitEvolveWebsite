import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { first_name, last_name, email, company, job_title, purpose, info } = body;

  if (!first_name || !last_name || !email || !company) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: "circuitEvolve <onboarding@resend.dev>",
    to: "hello@circuitevolve.com",
    subject: `Demo request from ${first_name} ${last_name} — ${company}`,
    html: `
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
    `,
  });

  if (error) {
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
