import { NextResponse } from "next/server";

// Dynamic configuration matching Supabase project details if env vars are missing
const FALLBACK_SUPABASE_URL = "https://rxfnazmusofikwaggntb.supabase.co";
const FALLBACK_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4Zm5hem11c29maWt3YWdnbnRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwNjkzMDYsImV4cCI6MjA5NjY0NTMwNn0.iWzajlIUEO0LteexPc4hF2X0ldGS_JRI4IXD4xncmf4";

// Simple in-memory rate limiter (5 requests per IP per hour)
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();
const MAX_REQUESTS = 5;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || record.expiresAt < now) {
    rateLimitMap.set(ip, { count: 1, expiresAt: now + WINDOW_MS });
    return true;
  }
  
  if (record.count >= MAX_REQUESTS) {
    return false;
  }
  
  record.count++;
  return true;
}

// Write to Supabase using REST API (PostgREST)
async function saveToSupabase(name: string, phoneNumber: string, suggestion: string) {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase config variables missing");
    return false;
  }

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/alpha_feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": supabaseAnonKey,
        "Authorization": `Bearer ${supabaseAnonKey}`,
        "Prefer": "return=representation",
      },
      body: JSON.stringify({
        name,
        phone_number: phoneNumber,
        suggestion,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Supabase REST Error:", errText);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error inserting feedback to Supabase:", error);
    return false;
  }
}

// Send Email via Resend REST API (using fetch to avoid installing npm packages)
async function sendEmailViaResend(name: string, phone: string, suggestion: string) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const notificationEmail = process.env.NOTIFICATION_EMAIL || "shubhamsahu.personal@gmail.com";

  if (!resendApiKey) {
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "NO SUS Alpha <onboarding@resend.dev>",
        to: notificationEmail,
        subject: "New NO SUS Alpha Feedback Received",
        text: `New NO SUS Alpha Feedback Received\n\nName:\n${name}\n\nPhone:\n${phone}\n\nSuggestion:\n${suggestion}`,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Resend API response error:", errText);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to send email via Resend:", error);
    return false;
  }
}

// Forward to Apps Script if set up (can trigger mail or sheet insertion there)
async function sendToAppsScript(name: string, phone: string, suggestion: string) {
  const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
  if (!appsScriptUrl) return false;

  try {
    const res = await fetch(appsScriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "alpha_feedback",
        timestamp: new Date().toISOString(),
        name,
        phone,
        suggestion,
      }),
    });
    return res.ok;
  } catch (e) {
    console.error("Apps Script forwarding failed:", e);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    // 1. Rate Limiting
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (ip !== "unknown" && !checkRateLimit(ip)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    // 2. Parse payload
    const body = await request.json();
    const { name, phone_number, suggestion } = body;

    // 3. Validation
    if (!name || typeof name !== "string" || name.trim().length === 0 || name.length > 100) {
      return NextResponse.json({ error: "Name is required and must be under 100 characters" }, { status: 400 });
    }

    if (!phone_number || typeof phone_number !== "string" || phone_number.trim().length === 0 || phone_number.length > 30) {
      return NextResponse.json({ error: "Phone number is required and must be under 30 characters" }, { status: 400 });
    }

    if (!suggestion || typeof suggestion !== "string" || suggestion.trim().length === 0 || suggestion.length > 2000) {
      return NextResponse.json({ error: "Suggestion/feedback is required and must be under 2000 characters" }, { status: 400 });
    }

    const sanitizedName = name.trim();
    const sanitizedPhone = phone_number.trim();
    const sanitizedSuggestion = suggestion.trim();

    // 4. Save to Supabase
    const dbSuccess = await saveToSupabase(sanitizedName, sanitizedPhone, sanitizedSuggestion);

    // 5. Send notifications
    let emailSent = false;
    let appsScriptSent = false;

    // Try Resend first
    if (process.env.RESEND_API_KEY) {
      emailSent = await sendEmailViaResend(sanitizedName, sanitizedPhone, sanitizedSuggestion);
    }

    // Try Apps Script as secondary / fallback
    if (process.env.GOOGLE_APPS_SCRIPT_URL) {
      appsScriptSent = await sendToAppsScript(sanitizedName, sanitizedPhone, sanitizedSuggestion);
    }

    // Return status
    return NextResponse.json({
      success: true,
      savedToDb: dbSuccess,
      emailNotified: emailSent,
      appsScriptNotified: appsScriptSent,
    });
  } catch (error) {
    console.error("Alpha feedback submission error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Add a GET endpoint to retrieve the count of submissions or active testers (cached / anonymous)
export async function GET() {
  try {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY;

    // Fetch the count using Supabase PostgREST count query (Prefer: count=exact)
    const res = await fetch(`${supabaseUrl}/rest/v1/alpha_feedback?select=id`, {
      method: "HEAD",
      headers: {
        "apikey": supabaseAnonKey,
        "Authorization": `Bearer ${supabaseAnonKey}`,
        "Prefer": "count=exact",
      },
    });

    let count = 10; // Default fallback to match Founding Alpha Testers count
    if (res.ok) {
      const contentRange = res.headers.get("content-range");
      if (contentRange) {
        // format is "0-9/10" or "*/10" or "empty"
        const parts = contentRange.split("/");
        if (parts.length > 1) {
          const dbCount = parseInt(parts[1], 10);
          if (!isNaN(dbCount)) {
            count = dbCount + 10; // Offset by 10 founding early supporters
          }
        }
      }
    }

    // Fetch the last few names anonymously (only first name / initial) for the Contribution Wall
    const listRes = await fetch(`${supabaseUrl}/rest/v1/alpha_feedback?select=name,created_at&order=created_at.desc&limit=5`, {
      method: "GET",
      headers: {
        "apikey": supabaseAnonKey,
        "Authorization": `Bearer ${supabaseAnonKey}`,
      },
    });

    let contributors: string[] = [];
    if (listRes.ok) {
      const data = await listRes.json();
      contributors = data.map((item: { name: string }) => {
        const parts = item.name.trim().split(" ");
        if (parts.length > 1) {
          return `${parts[0]} ${parts[parts.length - 1][0]}.`;
        }
        return item.name;
      });
    }

    return NextResponse.json({ count, contributors });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ count: 10, contributors: [] });
  }
}
