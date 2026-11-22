import { Resend } from 'resend'

const DEFAULT_FROM = 'DevStash <onboarding@resend.dev>'

let resend: Resend | null = null

function getResend(): Resend {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) throw new Error('RESEND_API_KEY is not set')
    resend = new Resend(apiKey)
  }
  return resend
}

export async function sendVerificationEmail(
  to: string,
  verifyUrl: string
): Promise<void> {
  const { error } = await getResend().emails.send({
    from: process.env.EMAIL_FROM ?? DEFAULT_FROM,
    to,
    subject: 'Verify your DevStash email',
    text: `Welcome to DevStash! Verify your email by opening this link:\n\n${verifyUrl}\n\nThe link expires in 24 hours. If you didn't create an account, you can ignore this email.`,
    html: `
      <p>Welcome to DevStash!</p>
      <p>Verify your email address to finish creating your account:</p>
      <p><a href="${verifyUrl}">Verify email</a></p>
      <p>The link expires in 24 hours. If you didn't create an account, you can ignore this email.</p>
    `
  })
  if (error) throw new Error(`Resend failed: ${error.message}`)
}
