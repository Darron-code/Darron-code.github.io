# Sarge & Cents — Vercel (API + Site)
Deploy on Vercel to get /api/contact without running a server.

Env vars to set in Vercel:
- SMTP_HOST
- SMTP_PORT (587 or 465)
- SMTP_USER
- SMTP_PASS
- FROM_EMAIL
- TO_EMAIL=darron@sargeandcents.com

After deploy, test:
- /api/health  -> {"ok":true}
- POST /api/contact with JSON body (email + message required)
