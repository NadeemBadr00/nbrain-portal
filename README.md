# NBrain AI Ecosystem Portal (`nbra.in`)

Official portal and enterprise console for **NBrain Software & AI Solutions**, led by **Eng. Nadeem Badr**.

## 🚀 Live Overview
- **Domain:** [nbra.in](https://nbra.in)
- **Architecture:** 3-Column Enterprise Console Grid (Firebase Console / Nile ERP design system)
- **Palette:** Strict HSL Color Token Architecture (Zero hex / RGB)
- **Theme:** Default High-Contrast Dark Mode with instant Light Mode switcher

---

## 🛠️ Key Capabilities & Offerings
1. **VIP Enterprise Bundle (All-In-One 360°):** Full-stack web + Google Play 2026 App (16KB Page Aligned) + Gemini AI Sales Bot + AI Promo Video + Cloudflare DDoS Shield + Free Domain & Cloud Hosting.
2. **Industry Solutions Matrix:** E-Commerce, EdTech LMS, Fleet Mobility & Vision (YOLOv12x & MediaPipe), Enterprise Document AI, and Chrome Extensions (Manifest V3).
3. **Flexible Engagement Models:** Turnkey Fixed-Price, Fast-Track MVP (7–14 days), and Dedicated Retainer Squads.
4. **Interactive AI Tools:** Live AI Sales Advisor Simulator (Budget matching e.g. 5,999 EGP), AI ROI & Cost Calculator, and Interactive RFP Customizer.
5. **Verified Live Demos:** NanoGrad LMS, Safqa Pro Marketplace, Anubis AI Tour Guide, Nitro Download Manager, Traffic & Driver Vision, and SmartDocs.

---

## 👨‍💻 Engineering Leadership
- **Chief Software Architect:** Nadeem Badr
- **Institution:** Helwan International Technological University (HITU) — IT & AI
- **GitHub:** [@NadeemBadr00](https://github.com/NadeemBadr00)
- **WhatsApp:** `+201222777345`
- **Email:** `nadeem@nbra.in` / `nadeembadr1@gmail.com`

---

## 💻 Local Development
Run the lightweight local PowerShell HTTP listener:
```powershell
powershell -ExecutionPolicy Bypass -File .\server.ps1
```
Open `http://localhost:3000` in your browser.

---

## 🚀 Firebase Hosting Deployment Guide (`nbra.in`)

### 1. Project Configuration
- **Firebase Project ID:** `nbrain-a654f`
- **Primary Custom Domain:** `https://nbra.in`
- **Default Site URL:** `https://nbrain-a654f.web.app`

### 2. Deploy Commands
```bash
# Set active project
npx -y firebase-tools@latest use nbrain-a654f

# Deploy to live production hosting
npx -y firebase-tools@latest deploy --only hosting
```

### 3. Preview Channels (Testing before live)
```bash
npx -y firebase-tools@latest hosting:channel:deploy beta --expires 7d
```

