import { NextResponse } from "next/server";
import { google } from "googleapis";

type WaitlistEntry = {
  name: string;
  email: string;
  instagram: string;
  userType: string;
  shareContent: string;
  sharedWithoutPermission: string;
  notifyAtLaunch: boolean;
  alphaTester: boolean;
  alphaId?: string;
};

function getAuth() {
  const key = process.env.GOOGLE_SHEETS_PRIVATE_KEY;
  const email = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;

  if (!key || !email) return null;

  const privateKey = key.includes("\\n") ? key.replace(/\\n/g, "\n") : key;

  return new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

async function appendToSheet(
  auth: ReturnType<typeof getAuth>,
  data: WaitlistEntry
) {
  if (!auth) return false;

  const sheetId = process.env.GOOGLE_SHEETS_SHEET_ID;
  if (!sheetId) return false;

  const sheets = google.sheets({ version: "v4", auth });

  const timestamp = new Date().toISOString();
  const alphaId = data.alphaId || `NS-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`;

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: "Sheet1!A:J",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          timestamp,
          alphaId,
          data.name,
          data.email,
          data.instagram,
          data.userType,
          data.shareContent,
          data.sharedWithoutPermission,
          data.notifyAtLaunch ? "Yes" : "No",
          data.alphaTester ? "Yes" : "No",
        ],
      ],
    },
  });

  return true;
}

async function sendToAppsScript(url: string, data: WaitlistEntry) {
  const timestamp = new Date().toISOString();
  const alphaId = data.alphaId || `NS-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`;

  const payload = {
    timestamp,
    alphaId,
    name: data.name,
    email: data.email,
    instagram: data.instagram,
    userType: data.userType,
    shareContent: data.shareContent,
    sharedWithoutPermission: data.sharedWithoutPermission,
    notifyAtLaunch: data.notifyAtLaunch ? "Yes" : "No",
    alphaTester: data.alphaTester ? "Yes" : "No",
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return response.ok;
}

// Simple in-memory rate limiter (works per Vercel serverless instance)
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();
const MAX_REQUESTS = 5; // 5 requests per IP
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

export async function POST(request: Request) {
  try {
    // 0. Rate Limiting
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (ip !== "unknown" && !checkRateLimit(ip)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const body: WaitlistEntry = await request.json();

    // 1. Strict Input Validation & Sanitization
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: "Invalid payload format" }, { status: 400 });
    }

    if (!body.name || typeof body.name !== 'string' || body.name.length > 100) {
      return NextResponse.json({ error: "Name is required and must be under 100 characters" }, { status: 400 });
    }

    if (!body.email || typeof body.email !== 'string' || body.email.length > 150 || !/^\S+@\S+\.\S+$/.test(body.email)) {
      return NextResponse.json({ error: "A valid email address is required" }, { status: 400 });
    }

    if (!body.instagram || typeof body.instagram !== 'string' || body.instagram.length > 50) {
      return NextResponse.json({ error: "Instagram handle is required and must be under 50 characters" }, { status: 400 });
    }

    // Sanitize optional string lengths
    body.userType = String(body.userType || "").substring(0, 100);
    body.shareContent = String(body.shareContent || "").substring(0, 200);
    body.sharedWithoutPermission = String(body.sharedWithoutPermission || "").substring(0, 100);

    // 1. Try Google Apps Script if URL is set
    const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
    if (appsScriptUrl) {
      const sent = await sendToAppsScript(appsScriptUrl, body);
      if (sent) {
        return NextResponse.json({ success: true, method: "apps-script" });
      }
    }

    // 2. Fall back to standard Google Sheets API
    const auth = getAuth();
    const saved = await appendToSheet(auth, body);

    if (!saved) {
      console.log("Waitlist submission (sheets not configured):", body);
      return NextResponse.json({ success: true, method: "mock" });
    }

    return NextResponse.json({ success: true, method: "googleapis" });
  } catch (error) {
    console.error("Waitlist API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
