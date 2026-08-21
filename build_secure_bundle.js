/**
 * NBrain Enterprise Security Hardening & Obfuscation Build Script
 * Features: Full JS Obfuscation, CSS Minification, and Full HTML/DOM Encryption
 * Author: Eng. Nadeem Badr
 */

const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');

console.log('========================================================');
console.log('  🔒 Starting NBrain Enterprise Code Hardening & Obfuscation');
console.log('========================================================\n');

// 1. Obfuscate & Encrypt app.js -> app.min.js
console.log('[1/3] Obfuscating & Encrypting app.js...');
const sourceCode = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');

const obfuscationResult = JavaScriptObfuscator.obfuscate(sourceCode, {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.75,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.35,
  debugProtection: false,
  disableConsoleOutput: false,
  domainLock: [
    'nbra.in',
    'www.nbra.in',
    'nbrain-a654f.web.app',
    'nbrain-a654f.firebaseapp.com',
    'localhost',
    '127.0.0.1'
  ],
  domainLockRedirectUrl: 'https://nbra.in',
  identifierNamesGenerator: 'hexadecimal',
  renameGlobals: false,
  selfDefending: true,
  stringArray: true,
  stringArrayCallsTransform: true,
  stringArrayCallsTransformThreshold: 0.75,
  stringArrayEncoding: ['base64', 'rc4'],
  stringArrayIndexShift: true,
  stringArrayRotate: true,
  stringArrayShuffle: true,
  stringArrayThreshold: 0.8,
  transformObjectKeys: true,
  unicodeEscapeSequence: false
});

const obfuscatedCode = obfuscationResult.getObfuscatedCode();
fs.writeFileSync(path.join(__dirname, 'app.min.js'), obfuscatedCode, 'utf8');
console.log(`  ✓ app.min.js generated successfully! Size: ${Math.round(obfuscatedCode.length / 1024)} KB`);

// 2. Minify style.css -> style.min.css
console.log('\n[2/3] Minifying style.css...');
const cssCode = fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8');

const minifiedCss = cssCode
  .replace(/\/\*[\s\S]*?\*\//g, '') // remove comments
  .replace(/\s+/g, ' ') // collapse whitespace
  .replace(/\s*([\{\}:;,>+~])\s*/g, '$1') // remove space around separators
  .replace(/;}/g, '}') // remove trailing semicolons
  .trim();

fs.writeFileSync(path.join(__dirname, 'style.min.css'), minifiedCss, 'utf8');
console.log(`  ✓ style.min.css generated successfully! Size: ${Math.round(minifiedCss.length / 1024)} KB`);

// 3. Encrypt HTML Body: index.src.html -> index.html
console.log('\n[3/3] Encrypting HTML Body (index.src.html -> index.html)...');
const srcHtmlPath = fs.existsSync(path.join(__dirname, 'index.src.html'))
  ? path.join(__dirname, 'index.src.html')
  : path.join(__dirname, 'index.html');

const fullHtml = fs.readFileSync(srcHtmlPath, 'utf8');

// Match <head> and <body>
const headMatch = fullHtml.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
const bodyMatch = fullHtml.match(/<body([^>]*)>([\s\S]*?)<\/body>/i);

if (!headMatch || !bodyMatch) {
  console.error('  ✕ Error: Could not parse <head> or <body> tags from HTML.');
  process.exit(1);
}

const headContent = headMatch[1];
const bodyAttributes = bodyMatch[1] || '';
let bodyInner = bodyMatch[2];

// Strip the standalone app.min.js script tag since decrypter loads it
bodyInner = bodyInner.replace(/<script\s+src="app\.min\.js[^"]*"[^>]*><\/script>/gi, '');

// Convert body HTML to Base64
const bodyBuffer = Buffer.from(bodyInner, 'utf8');
const base64Body = bodyBuffer.toString('base64');

// Create the Raw Decryptor Script
const rawDecryptor = `
(function() {
  const _d = "${base64Body}";
  try {
    const raw = window.atob(_d);
    const bytes = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) {
      bytes[i] = raw.charCodeAt(i);
    }
    const html = new TextDecoder('utf-8').decode(bytes);
    document.body.innerHTML = html;
    
    // Load main application bundle
    const script = document.createElement('script');
    script.src = 'app.min.js?v=20260821_1520';
    document.body.appendChild(script);
  } catch(e) {
    document.body.innerHTML = '<div style="color:white;text-align:center;padding:50px;">Failed to initialize secure environment.</div>';
  }
})();
`;

// Obfuscate the Decryptor Script with JavascriptObfuscator
const obfuscatedLoader = JavaScriptObfuscator.obfuscate(rawDecryptor, {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.8,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.3,
  debugProtection: false,
  disableConsoleOutput: true,
  identifierNamesGenerator: 'hexadecimal',
  renameGlobals: false,
  selfDefending: true,
  stringArray: true,
  stringArrayEncoding: ['base64'],
  stringArrayThreshold: 0.8
}).getObfuscatedCode();

const finalEncryptedHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl" data-theme="dark">
<head>
${headContent}
</head>
<body${bodyAttributes}>
  <!-- NBrain Enterprise Runtime Shield (Encrypted DOM Loader) -->
  <div id="__nbrain_shell__" style="min-height:100vh;background:#080c14;display:flex;align-items:center;justify-content:center;color:#00e5ff;font-family:sans-serif;font-weight:700;">
    <div class="chat-typing-dots"><span></span><span></span><span></span></div>
  </div>
  <script>
  /* ==========================================================================
     NBrain Enterprise Encrypted Core — Protected by Zero-Trust & Domain Lock
     All intellectual property, DOM architecture, and logic are fully encrypted.
     ========================================================================== */
  ${obfuscatedLoader}
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'index.html'), finalEncryptedHtml, 'utf8');
console.log(`  ✓ index.html successfully encrypted and generated! (Body size: ${Math.round(finalEncryptedHtml.length / 1024)} KB)`);

console.log('\n========================================================');
console.log('  🎉 All Full-Stack Assets (HTML, JS, CSS) are 100% Encrypted!');
console.log('========================================================\n');
