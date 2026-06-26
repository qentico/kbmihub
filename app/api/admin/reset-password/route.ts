import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

function generateTempPassword(): string {
  const digits = Math.floor(1000 + Math.random() * 9000)
  return `Kbmi@${digits}`
}

export async function POST(req: NextRequest) {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) {
    return NextResponse.json(
      { error: 'SUPABASE_SERVICE_ROLE_KEY is not configured. Add it to your environment variables.' },
      { status: 503 }
    )
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  // Verify the caller is an authenticated super admin
  const authHeader = req.headers.get('Authorization')
  const token = authHeader?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: { user: callerUser }, error: authError } = await supabaseAdmin.auth.getUser(token)
  if (authError || !callerUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: callerProfile } = await supabaseAdmin
    .from('profiles').select('role').eq('id', callerUser.id).single()
  if (callerProfile?.role !== 'super_admin') {
    return NextResponse.json({ error: 'Forbidden — super admin only' }, { status: 403 })
  }

  // Parse request body
  const { requestId, email } = await req.json()
  if (!requestId || !email) {
    return NextResponse.json({ error: 'requestId and email are required' }, { status: 400 })
  }

  // Find the target user's auth ID via their profile
  const { data: targetProfile } = await supabaseAdmin
    .from('profiles').select('id').eq('email', email).single()
  if (!targetProfile) {
    return NextResponse.json({ error: `No account found for ${email}` }, { status: 404 })
  }

  // Set temporary password
  const tempPassword = generateTempPassword()
  const { error: resetError } = await supabaseAdmin.auth.admin.updateUserById(
    targetProfile.id,
    { password: tempPassword }
  )
  if (resetError) {
    return NextResponse.json({ error: resetError.message }, { status: 500 })
  }

  // Mark the request as resolved
  await supabaseAdmin.from('password_reset_requests').update({
    resolved_at: new Date().toISOString(),
    resolved_by: callerUser.id,
  }).eq('id', requestId)

  return NextResponse.json({ tempPassword, email })
}
