import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { NextRequest, NextResponse } from "next/server";

const sns = new SNSClient({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { first_name, last_name, email, company, job_title, purpose, info } = body;

  if (!first_name || !last_name || !email || !company) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const message = [
    "New Demo Request — circuitEvolve",
    "",
    `Name:      ${first_name} ${last_name}`,
    `Email:     ${email}`,
    `Company:   ${company}`,
    `Job Title: ${job_title || "—"}`,
    `Purpose:   ${purpose || "—"}`,
    `Notes:     ${info || "—"}`,
  ].join("\n");

  try {
    await sns.send(
      new PublishCommand({
        TopicArn: process.env.AWS_SNS_TOPIC_ARN!,
        Subject: `Demo request: ${first_name} ${last_name} — ${company}`,
        Message: message,
      })
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("SNS publish failed:", err);
    return NextResponse.json({ error: "Failed to publish notification" }, { status: 500 });
  }
}
