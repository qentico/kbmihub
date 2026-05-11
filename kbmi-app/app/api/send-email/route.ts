import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const { name, email } = await req.json()

  if (!name || !email) {
    return NextResponse.json({ error: 'Missing name or email' }, { status: 400 })
  }

  const { error } = await resend.emails.send({
    from: 'KBMI App <onboarding@resend.dev>',
    to: email,
    subject: 'Welcome to KBMI Family App!',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#f9f9fb;border-radius:16px;">
        <div style="background:#2D1B5E;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
          <span style="font-size:32px;font-weight:900;color:#fff;letter-spacing:-1px;">KBMI</span>
          <p style="color:#c4b5fd;margin:4px 0 0;font-size:13px;">Keluarga Besar Mat Indra</p>
        </div>
        <h2 style="color:#1e1b4b;margin:0 0 8px;">Selamat datang, ${name}! 👋</h2>
        <p style="color:#4b5563;line-height:1.6;margin:0 0 16px;">
          Your account has been created successfully. You are now part of the KBMI family network.
        </p>
        <p style="color:#4b5563;line-height:1.6;margin:0 0 24px;">
          You can now access announcements, events, the family marketplace, and more.
        </p>
        <p style="color:#9ca3af;font-size:12px;margin:0;">
          If you did not sign up for this account, please ignore this email.
        </p>
      </div>
    `,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
