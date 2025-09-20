// api/contact.js
import nodemailer from "nodemailer";

const DEFAULT_ALLOW = process.env.ALLOWED_ORIGIN || "https://sargeandcents.com,https://www.sargeandcents.com,https://darron-code.github.io";

// CORS allowlist check
const allow = (origin = "") => {
  const list = DEFAULT_ALLOW.split(",").map(s => s.trim()).filter(Boolean);
  return list.includes(origin);
};

function escapeHtml(s = "") {
  return s.replace(/[&<>\"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "\"":"&quot;", "'":"&#39;" }[c]));
}

// Helper to parse JSON body if req.body is missing (plain Node serverless)
async function getJsonBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString();
  if (!raw) return {};
  try { return JSON.parse(raw); } catch { return {}; }
}

export default async function handler(req, res) {
  const origin = req.headers.origin || "";

  // Always set CORS headers (and handle preflight)
  if (allow(origin)) res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const body = await getJsonBody(req);
    const {
      first_name = "",
      last_name = "",
      email = "",
      company = "",
      message = ""
    } = body || {};

    if (!email || !/^([^\s@]+)@([^\s@]+)\.([^\s@]+)$/.test(email) || !String(message).trim()) {
      return res.status(400).json({ error: "Invalid form data." });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });

    // (Optional) Verify SMTP; if it fails we still try sendMail, but you’ll see logs.
    try { await transporter.verify(); } catch (e) { console.warn("SMTP verify warning:", e?.message || e); }

    const subject = "Sarge & Cents — New Website Lead";
    const text = `New website lead:

First name: ${first_name}
Last name: ${last_name}
Email: ${email}
Company: ${company}

${message}`;

    const html = `<h2>New website lead</h2>
<ul>
  <li><b>First name:</b> ${escapeHtml(first_name)}</li>
  <li><b>Last name:</b> ${escapeHtml(last_name)}</li>
  <li><b>Email:</b> ${escapeHtml(email)}</li>
  <li><b>Company:</b> ${escapeHtml(company)}</li>
</ul>
<p><b>Message:</b></p>
<pre style="white-space:pre-wrap;font:inherit">${escapeHtml(message)}</pre>`;

    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: process.env.TO_EMAIL,
      replyTo: email,
      subject, text, html
    });

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("CONTACT_HANDLER_ERROR:", e);
    // Still include CORS on error so the browser can read it
    if (allow(origin)) res.setHeader("Access-Control-Allow-Origin", origin);
    return res.status(500).json({ error: "Failed to send. Check server logs & SMTP env." });
  }
}
