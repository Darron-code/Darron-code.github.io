import nodemailer from "nodemailer";

export default async function handler(req, res) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });
    await transporter.verify(); // connect & auth only
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(200).json({ ok: false, message: e?.message, code: e?.code });
  }
}
