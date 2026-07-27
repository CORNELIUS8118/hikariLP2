import nodemailer from 'nodemailer';

interface SendMailArgs {
  to: string;
  subject: string;
  html: string;
  text: string;
}

let cachedTransporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    throw new Error('SMTP環境変数が未設定です');
  }

  cachedTransporter = nodemailer.createTransport({
    host,
    port: Number(port),
    secure: Number(port) === 465,
    auth: { user, pass },
    connectionTimeout: 8000,
    socketTimeout: 8000,
  });

  return cachedTransporter;
}

export async function sendMail({ to, subject, html, text }: SendMailArgs): Promise<void> {
  const from = process.env.MAIL_FROM;
  if (!from) {
    throw new Error('MAIL_FROM環境変数が未設定です');
  }

  const transporter = getTransporter();
  await transporter.sendMail({ from, to, subject, html, text });
}
