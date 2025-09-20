// api/debug.js
const list = ["ALLOWED_ORIGIN","SMTP_HOST","SMTP_PORT","SMTP_USER","SMTP_PASS","FROM_EMAIL","TO_EMAIL"];
const ALLOW = (process.env.ALLOWED_ORIGIN || "").split(",").map(s=>s.trim()).filter(Boolean);
const ok = (o) => ALLOW.includes(o);

export default function handler(req, res) {
  const origin = req.headers.origin || "";
  if (ok(origin)) res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  const envs = Object.fromEntries(list.map(k => [k, !!process.env[k]]));
  envs.node = process.version;
  return res.status(200).json(envs);
}
