// app/api/contact/route.js
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

async function verifyRecaptcha(token) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) throw new Error("Missing RECAPTCHA_SECRET_KEY");
  if (!token) return false;

  const params = new URLSearchParams();
  params.append("secret", secret);
  params.append("response", token);

  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  const data = await res.json();
  return Boolean(data?.success);
}

export async function POST(req) {
  try {
    const body = await req.json();

    // ✅ FIX: include captchaToken from the request body
    const { name, email, subject, message, captchaToken } = body || {};

    // ✅ Optional but recommended: handle missing token cleanly (no crash)
    if (!captchaToken) {
      return NextResponse.json(
        { ok: false, error: "Captcha token missing." },
        { status: 400 }
      );
    }

    const ok = await verifyRecaptcha(captchaToken);
    if (!ok) {
      return NextResponse.json(
        { ok: false, error: "Captcha verification failed." },
        { status: 400 }
      );
    }

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Basic server-side validation
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      return NextResponse.json(
        { ok: false, error: "Invalid email address." },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailTo = process.env.MAIL_TO;
    const mailFrom = process.env.MAIL_FROM || process.env.SMTP_USER;

    if (!mailTo) {
      return NextResponse.json(
        { ok: false, error: "Missing MAIL_TO in environment variables." },
        { status: 500 }
      );
    }

    await transporter.sendMail({
      from: mailFrom,
      to: mailTo,
      replyTo: email,
      subject: `[Portfolio] ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6">
          <h2 style="margin:0 0 8px">New Portfolio Message</h2>
          <p style="margin:0 0 12px">
            <strong>Name:</strong> ${escapeHtml(name)}<br/>
            <strong>Email:</strong> ${escapeHtml(email)}<br/>
            <strong>Subject:</strong> ${escapeHtml(subject)}
          </p>

          <div style="padding:12px;border:1px solid #eee;border-radius:8px">
            ${escapeHtml(message).replace(/\n/g, "<br/>")}
          </div>
        </div>
      `,
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("CONTACT_API_ERROR:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to send message." },
      { status: 500 }
    );
  }
}

// Simple HTML escape to avoid injection in email templates
function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
