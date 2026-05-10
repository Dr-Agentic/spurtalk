/**
 * Cloudflare Pages Function: POST /api/waitlist
 *
 * Validates email, logs to console, sends notification via Resend API.
 *
 * Required secrets (add in Cloudflare Dashboard → Pages → spurtalk-landing → Settings → Functions → Bindings):
 *   RESEND_API_KEY  — your Resend API key
 */

const ALLOWED_ORIGINS = [
  'https://spurtalk-landing.pages.dev',
  'https://spurtalk.com',
  'http://localhost:3000',
];

interface Env {
  RESEND_API_KEY: string;
}

async function handlePost(request: Request, env: Env): Promise<Response> {
  // ── CORS headers ───────────────────────────────────────────────────────────
  const origin = request.headers.get('Origin') ?? '';
  const validOrigin = ALLOWED_ORIGINS.some(o => origin.startsWith(o));
  const corsOrigin = validOrigin ? origin : ALLOWED_ORIGINS[0];
  const corsHeaders = {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // ── Parse body ─────────────────────────────────────────────────────────────
  let email: string;
  try {
    const contentType = request.headers.get('Content-Type') ?? '';
    if (!contentType.includes('application/json')) {
      return jsonResponse({ error: 'Content-Type must be application/json' }, 400, corsHeaders);
    }
    const body = await request.json() as { email?: unknown };
    if (!body.email || typeof body.email !== 'string') {
      return jsonResponse({ error: 'Email is required' }, 400, corsHeaders);
    }
    email = body.email.trim().toLowerCase();
  } catch {
    return jsonResponse({ error: 'Invalid request body' }, 400, corsHeaders);
  }

  // ── Validate email format ──────────────────────────────────────────────────
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return jsonResponse({ error: 'Invalid email format' }, 400, corsHeaders);
  }

  // ── Log to console ─────────────────────────────────────────────────────────
  const timestamp = new Date().toISOString();
  console.log(`[waitlist] email=${email} ts=${timestamp}`);

  // ── Send email via Resend ──────────────────────────────────────────────────
  if (env.RESEND_API_KEY) {
    try {
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'SpurTalk Waitlist <noreply@spurtalk.com>',
          to: ['morsy@specialized.live'],
          subject: 'New SpurTalk waitlist signup',
          text: `Email: ${email}\nTime: ${timestamp}`,
        }),
      });

      if (!resendRes.ok) {
        const errText = await resendRes.text();
        console.error(`[waitlist] Resend error: ${resendRes.status} ${errText}`);
      } else {
        console.log(`[waitlist] email sent via Resend for ${email}`);
      }
    } catch (err) {
      console.error(`[waitlist] fetch error: ${err}`);
    }
  } else {
    console.warn('[waitlist] RESEND_API_KEY not set — skipping email send');
  }

  // ── Success response ───────────────────────────────────────────────────────
  return jsonResponse(
    { success: true, message: "You're on the list! We'll be in touch soon. 💚" },
    200,
    corsHeaders,
  );
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method === 'POST') {
      return handlePost(request, env);
    }

    return jsonResponse({ error: 'Method not allowed' }, 405, {
      'Access-Control-Allow-Origin': '*',
    });
  },
};