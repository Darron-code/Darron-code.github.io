export default function handler(_req,res){res.status(200).json({ok:true,time:new Date().toISOString()})}
export default function handler(req, res){
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Vary", "Origin");
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }
  return res.status(200).json({ ok: true, time: new Date().toISOString() });
}
