const ALLOW = ("https://sargeandcents.com,https://www.sargeandcents.com,https://darron-code.github.io").split(",").map(s=>s.trim()).filter(Boolean);
const ok = (o) => ALLOW.includes(o);
async function getJson(req) {
  if (req.body && typeof req.body === "object") return req.body;
  const chunks = []; for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks).toString(); try { return JSON.parse(raw || "{}"); } catch { return {}; }
}
export default async function handler(req, res) {
  const origin = req.headers.origin || "";
  if (ok(origin)) res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  const body = await getJson(req);
  return res.status(200).json({ method: req.method, hasBody: !!Object.keys(body||{}).length, body });
}
