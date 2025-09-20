import nodemailer from "nodemailer";

const allow = (origin) => {
  const list = (process.env.ALLOWED_ORIGIN || "").split(",").map(s=>s.trim()).filter(Boolean);
  return list.length ? list.includes(origin) : true;
};

export default async function handler(req, res) {
  const origin = req.headers.origin || "";
  if (allow(origin)) res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { first_name = "", last_name = "", email = "", company = "", message = "" } = req.body || {};
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !String(message).trim()) {
    return res.status(400).json({ error: "Invalid form data." });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });

    const subject = "Sarge & Cents — New Website Lead";
    const text = `New website lead:

First name: ${first_name}
Last name: ${last_name}
Email: ${email}
Company: ${company}
Message:
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
    console.error(e);
    return res.status(500).json({ error: "Failed to send. Check SMTP env vars." });
  }
}

function escapeHtml(s = "") {
  return s.replace(/[&<>\"']/g, (c) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
}
