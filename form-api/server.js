import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const API = "https://darron-code-github-io.vercel.app/api/contact";

const app = express();
app.use(helmet());
app.use(express.json({ limit: "25kb" }));

const allowed = new Set([process.env.ALLOWED_ORIGIN, "http://localhost:5173", "http://localhost:3000", "http://localhost:8080"].filter(Boolean));
app.use(cors({ origin: (origin, cb) => { if (!origin || allowed.has(origin)) return cb(null, true); return cb(new Error("Not allowed by CORS")); } }));

app.use("/api/", rateLimit({ windowMs: 60_000, max: 20 }));
app.get("/health", (_req, res) => res.json({ ok: true }));

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});

app.post("/api/contact", async (req, res) => {
  try {
    const { first_name = "", last_name = "", email = "", company = "", message = "" } = req.body || {};
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !String(message).trim()) {
      return res.status(400).json({ error: "Invalid form data." });
    }
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
    await transporter.sendMail({ from: process.env.FROM_EMAIL, to: process.env.TO_EMAIL, replyTo: email, subject, text, html });
    return res.json({ ok: true });
  } catch (err) {
    console.error("Email error:", err);
    return res.status(500).json({ error: "Failed to send. Try again later." });
  }
});

function escapeHtml(s = "") { return s.replace(/[&<>"']/g, (c) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c])); }

const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => console.log(`Form API listening on :${PORT}`));
