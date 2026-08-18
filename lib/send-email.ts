import nodemailer from 'nodemailer'

// Sends via the Gmail account configured in Vercel's Environment
// Variables (Project Settings → Environment Variables) — GMAIL_USER and
// GMAIL_APP_PASSWORD. The app password is the 16-character code from
// Google Account → Security → App Passwords, NOT the account's normal
// login password (Gmail blocks plain-password SMTP login when 2-Step
// Verification is on, which app passwords require in the first place).
// Neither value is ever hardcoded here — if they're missing, sendMail
// throws clearly instead of silently failing.
export async function sendMail(opts: { to: string; subject: string; html: string }) {
  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD
  if (!user || !pass) {
    throw new Error('GMAIL_USER / GMAIL_APP_PASSWORD are not set in this environment')
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass }
  })

  await transporter.sendMail({
    from: `"Tour de Callisto" <${user}>`,
    to: opts.to,
    subject: opts.subject,
    html: opts.html
  })
}
