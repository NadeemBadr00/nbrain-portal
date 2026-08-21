/**
 * NBrain Enterprise Cloud Functions (Gen 2)
 * Secure Multimodal Gemini AI Streaming Endpoint
 * Features: Zero-Trust Origin Guard, IP Rate Limiter, Payload Sanitizer & Auto-Failover
 * Author: Eng. Nadeem Badr
 */

const { onRequest } = require("firebase-functions/v2/https");

// Secure Server-side API Key Pool (Base64 encoded)
const DEFAULT_GEMINI_KEYS_ENC = [
  "QVEuQWI4Uk42TC1XNGVLQjZKM2o4cTQ2czV6NERrZ0k5N1k0YlNXcXl5Q3JfOUNRZk5pY0E=",
  "QVEuQWI4Uk42THpNSWF5Wmh3RmZYd2RldFZyMkpRLTNuUjJWVmlZbkpqT1J1OTI3Ukp0QXc=",
  "QVEuQWI4Uk42STlWWXg1a2pyR29HSnlNSldlWHNYM0FlOGlFcmo4WVpZOUZ6Q0g5OWxycHc=",
  "QVEuQWI4Uk42S1daUVpXb2RKc0RpTnpGMjNqZ0Z3VElhSmE3N1RDcjBib0FDRHhRZ1puRUE=",
  "QVEuQWI4Uk42S3dRcWFqNDA3U0p5Szk3aHl6a0x5ZC0wVlVSV0Ytb1NxMnI1Tnl3N0dia1E=",
  "QVEuQWI4Uk42SVNQNmhnZEQwc1B5ZkNvbEd3cDkzOXFmbVVsRmlrczlxMkdKbm9QVlZuR2c=",
  "QVEuQWI4Uk42TGIzaWRFRXFNc0d4ckJwS3RUR1hTcHlpVVFLRDY4NXl5bzFTbUpadGhQSUE=",
  "QVEuQWI4Uk42S2QzaFZJdzJjdWRPakRqRVJSamVmUHVCeHlPZjdonTk5clR1WGJ6NnNvdkE="
];

// Load keys from environment variable or fallback to default pool
const GEMINI_KEYS = process.env.GEMINI_KEYS
  ? process.env.GEMINI_KEYS.split(",").map((k) => k.trim()).filter(Boolean)
  : DEFAULT_GEMINI_KEYS_ENC.map(k => {
      try { return Buffer.from(k, 'base64').toString('utf8'); } catch(e) { return ''; }
    }).filter(Boolean);

let currentKeyIndex = 0;
function getNextApiKey() {
  const key = GEMINI_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % GEMINI_KEYS.length;
  return key;
}

// Optimized model sequence: Fast engine first for minimal TTFT, then reasoning engine
const SUPPORTED_MODELS = ["gemini-2.5-flash", "gemini-3.7-flash"];

// In-Memory Sliding Window Rate Limiting (Anti-Abuse / Denial-of-Wallet Shield)
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 60; // 60 requests/minute per IP
const ipRequestHistory = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const timestamps = ipRequestHistory.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    ipRequestHistory.set(ip, recent);
    return true;
  }

  recent.push(now);
  ipRequestHistory.set(ip, recent);

  // Periodic cleanup of stale IPs to prevent memory leaks
  if (ipRequestHistory.size > 2000) {
    for (const [key, list] of ipRequestHistory.entries()) {
      if (list.length === 0 || now - list[list.length - 1] >= RATE_LIMIT_WINDOW_MS) {
        ipRequestHistory.delete(key);
      }
    }
  }

  return false;
}

// Origin & Referer Verification Guard
const ALLOWED_ORIGIN_PATTERNS = [
  /^https:\/\/(www\.)?nbra\.in$/,
  /^https:\/\/nbrain-a654f\.(web\.app|firebaseapp\.com)$/,
  /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/,
];

function isOriginAllowed(origin, referer) {
  if (!origin && !referer) return true; // Direct server-to-server or curl
  const checkList = [origin, referer].filter(Boolean);
  for (const checkUrl of checkList) {
    try {
      const parsed = new URL(checkUrl);
      const originStr = `${parsed.protocol}//${parsed.host}`;
      if (ALLOWED_ORIGIN_PATTERNS.some((pattern) => pattern.test(originStr))) {
        return true;
      }
    } catch (_) {}
  }
  return false;
}

/**
 * Core Request Handler for Multimodal Gemini Streaming
 */
async function handleChat(req, res) {
  const clientOrigin = req.headers.origin || "";
  const clientReferer = req.headers.referer || "";
  const clientIp =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    "unknown-ip";

  const allowOrigin = clientOrigin || "*";

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", allowOrigin);
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    res.setHeader("Access-Control-Max-Age", "86400");
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Method Not Allowed. Please send a POST request." }));
    return;
  }

  // 1. Origin Guard Check
  if (!isOriginAllowed(clientOrigin, clientReferer)) {
    res.statusCode = 403;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Access Forbidden: Unauthorized origin." }));
    return;
  }

  // 2. IP Rate Limit Check
  if (isRateLimited(clientIp)) {
    res.statusCode = 429;
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Retry-After", "60");
    res.end(
      JSON.stringify({
        error: "Too Many Requests: Rate limit exceeded. Please wait a moment before sending more queries.",
      })
    );
    return;
  }

  // 3. Payload Validation & Sanitization
  const { contents, systemInstruction, generationConfig, tools } = req.body || {};

  if (!contents || !Array.isArray(contents) || contents.length === 0) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Bad Request: 'contents' array is required." }));
    return;
  }

  // Bound conversation history to prevent huge memory spikes (max 20 messages)
  const sanitizedContents = contents.slice(-20).map((msg) => {
    return {
      role: msg.role === "model" ? "model" : "user",
      parts: (msg.parts || []).map((part) => {
        if (part.text) {
          return { text: String(part.text).slice(0, 15000) };
        }
        if (part.inline_data && part.inline_data.data && part.inline_data.mime_type) {
          return {
            inline_data: {
              mime_type: String(part.inline_data.mime_type).slice(0, 50),
              data: String(part.inline_data.data),
            },
          };
        }
        return { text: "" };
      }),
    };
  });

  // Clamp thinking budget if provided
  let sanitizedConfig = undefined;
  if (generationConfig && typeof generationConfig === "object") {
    sanitizedConfig = {};
    if (generationConfig.thinkingConfig && generationConfig.thinkingConfig.thinkingBudget) {
      const budget = parseInt(generationConfig.thinkingConfig.thinkingBudget, 10);
      sanitizedConfig.thinkingConfig = {
        thinkingBudget: Math.max(0, Math.min(budget || 0, 8192)),
      };
    }
  }

  // Build standard payload for Google Gemini API
  const geminiPayload = {
    contents: sanitizedContents,
    ...(systemInstruction ? { systemInstruction } : {}),
    ...(sanitizedConfig ? { generationConfig: sanitizedConfig } : {}),
    ...(tools && Array.isArray(tools) && tools.length > 0 ? { tools } : {}),
  };

  // Prepare SSE Response Headers
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.setHeader("Access-Control-Allow-Origin", allowOrigin);

  const maxKeyAttempts = Math.min(GEMINI_KEYS.length, 4);
  let streamSucceeded = false;

  // Retry loop across keys and fallback models
  for (let attempt = 0; attempt < maxKeyAttempts; attempt++) {
    const apiKey = getNextApiKey();

    for (const model of SUPPORTED_MODELS) {
      try {
        const targetUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?key=${apiKey}&alt=sse`;

        const upstreamResponse = await fetch(targetUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(geminiPayload),
        });

        if (upstreamResponse.ok && upstreamResponse.body) {
          const reader = upstreamResponse.body.getReader();

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            res.write(Buffer.from(value));
          }

          streamSucceeded = true;
          res.end();
          return;
        }
      } catch (err) {
        console.warn(`[NBrain AI Proxy] Attempt with model ${model} failed:`, err.message);
      }
    }
  }

  // If all attempts fail, close SSE stream with clean error event
  if (!streamSucceeded) {
    const errorMsg = JSON.stringify({
      error: { message: "All Gemini AI engine connections were exhausted. Please try again shortly." },
    });
    res.write(`data: ${errorMsg}\n\n`);
    res.end();
  }
}

// Export for Firebase Functions Gen 2
exports.chat = onRequest(
  {
    cors: true,
    region: "us-central1",
    timeoutSeconds: 120,
    maxInstances: 20,
    memory: "256MiB",
  },
  handleChat
);

// Export raw handler for local testing & development servers
exports.handleChat = handleChat;
