import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "SpurTalk <noreply@spurtalk.com>";
const APP_URL = process.env.APP_URL || "http://localhost:7100";

export interface PasswordResetEmail {
  to: string;
  resetToken: string;
}

export async function sendPasswordResetEmail({ to, resetToken }: PasswordResetEmail): Promise<void> {
  const resetLink = `${APP_URL}/reset-password?token=${resetToken}`;

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Reset your SpurTalk password",
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 24px; color: #1a1a1a; margin: 0;">SpurTalk</h1>
        </div>
        <div style="background: #f9fafb; border-radius: 12px; padding: 32px;">
          <h2 style="font-size: 20px; color: #1a1a1a; margin: 0 0 16px;">Reset your password</h2>
          <p style="font-size: 15px; color: #4b5563; margin: 0 0 24px; line-height: 1.6;">
            You requested a password reset for your SpurTalk account. Click the button below to set a new password. This link expires in <strong>1 hour</strong>.
          </p>
          <a href="${resetLink}" style="display: inline-block; background: #10b981; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; padding: 12px 24px; border-radius: 8px; margin-bottom: 24px;">
            Reset password
          </a>
          <p style="font-size: 13px; color: #9ca3af; margin: 0; line-height: 1.6;">
            If you didn't request this, you can safely ignore this email. The link will stop working after 1 hour.
          </p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
          <p style="font-size: 12px; color: #9ca3af; margin: 0;">
            Copy this link if the button doesn't work: <br />
            <span style="word-break: break-all; color: #6b7280;">${resetLink}</span>
          </p>
        </div>
      </div>
    `,
  });
}