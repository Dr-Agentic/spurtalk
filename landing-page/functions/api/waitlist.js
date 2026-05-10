/**
 * Cloudflare Pages Function: POST /api/waitlist
 *
 * Validates email, logs to console, sends notification via Resend API.
 * Required: RESEND_API_KEY bound in Pages → Settings → Functions → Environment Variables
 */

function jsonResponse(body, status, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
  });
}

// POST handler
export function onRequestPost(context) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (context.request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  return handlePost(context.request, context.env ?? {}, corsHeaders);
}

// GET handler — return 405 to indicate method not allowed
export function onRequestGet(context) {
  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
}

async function handlePost(request, env, corsHeaders) {
  let email;
  try {
    const ct = request.headers.get('Content-Type') ?? '';
    if (!ct.includes('application/json')) {
      return jsonResponse({ error: 'Content-Type must be application/json' }, 400, corsHeaders);
    }
    const body = await request.json();
    if (!body.email || typeof body.email !== 'string') {
      return jsonResponse({ error: 'Email is required' }, 400, corsHeaders);
    }
    email = body.email.trim().toLowerCase();
  } catch {
    return jsonResponse({ error: 'Invalid request body' }, 400, corsHeaders);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return jsonResponse({ error: 'Invalid email format' }, 400, corsHeaders);
  }

  const timestamp = new Date().toISOString();
  console.log(`[waitlist] email=${email} ts=${timestamp}`);

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
          to: ['spurtalk@specialized.live'],
          subject: 'New SpurTalk waitlist signup',
          text: `Email: ${email}\nTime: ${timestamp}`,
        }),
      });
      if (!resendRes.ok) {
        console.error(`[waitlist] Resend error: ${resendRes.status} ${await resendRes.text()}`);
      } else {
        console.log(`[waitlist] email sent via Resend for ${email}`);
      }
    } catch (err) {
      console.error(`[waitlist] fetch error: ${err}`);
    }
  } else {
    console.warn('[waitlist] RESEND_API_KEY not set — skipping email send');
  }

  return jsonResponse(
    { success: true, message: "You're on the list! We'll be in touch soon. 💚" },
    200,
    corsHeaders,
  );
}