# Atharva Nandurkar — Portfolio

Personal portfolio built with Next.js 14 (App Router), TypeScript, and Tailwind CSS. Contact form uses EmailJS, so there's no backend.

## Local setup

```bash
npm install
npm run dev
```

Runs at http://localhost:3000.

## Content

All text (profile, about, projects, experience, skills) is in `lib/data.ts`. Update that file for content changes — components don't need to change.

Profile photo goes at `public/profile.jpg`, ideally 800x800px or larger.

## EmailJS

The contact form needs three env vars to actually send mail. Without them it falls back to a `mailto:` link.

1. Create a free account at emailjs.com and add an Email Service (e.g. Gmail).
2. Create an Email Template with fields `{{user_name}}`, `{{user_email}}`, `{{message}}`, and set the "To email" to your own address.
3. Copy `.env.local.example` to `.env.local` and fill in:
   ```
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_xxxxxxx
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_xxxxxxx
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx
   ```
4. Restart `npm run dev`.

Free tier covers 200 emails/month.

## Deploy

Push to GitHub, import the repo on Vercel, add the same three env vars under Project Settings → Environment Variables, and deploy.

## Stack

Next.js 14 (App Router), TypeScript, Tailwind CSS, @emailjs/browser, Vercel.
