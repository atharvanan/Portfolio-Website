"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";
import {
  profile as defaultProfile,
  sectionHeaders as defaultSectionHeaders,
  Profile,
  SectionHeaders,
} from "@/lib/data";
import Reveal from "./Reveal";

type Status = "idle" | "sending" | "sent" | "error";

export default function Contact({
  profile: propProfile,
  sectionHeaders: propHeaders,
}: {
  profile?: Profile;
  sectionHeaders?: SectionHeaders;
} = {}) {
  const [status, setStatus] = useState<Status>("idle");
  const profile = propProfile || defaultProfile;
  const headers = propHeaders || defaultSectionHeaders;
  const contactHeader = headers?.contact;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      window.location.href = `mailto:${profile.email}`;
      return;
    }

    setStatus("sending");
    try {
      await emailjs.sendForm(serviceId, templateId, form, { publicKey });
      setStatus("sent");
      form.reset();
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="bg-black py-24 text-white">
      <div className="mx-auto max-w-2xl px-5">
        <Reveal>
          <p className="text-center text-sm font-medium uppercase tracking-widest text-white/50">
            {contactHeader?.badge || "Get in touch"}
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mt-3 text-center text-3xl font-semibold tracking-tight sm:text-4xl">
            {contactHeader?.title || "Let’s work together"}
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p className="mx-auto mt-4 max-w-md text-center text-[15px] text-white/60">
            Have a project in mind or an opportunity to discuss? Send a
            message and I&rsquo;ll reply at{" "}
            <a
              href={`mailto:${profile.email}`}
              className="text-white underline underline-offset-2 transition-colors hover:text-accent"
            >
              {profile.email}
            </a>
            {profile.phone ? ` or ${profile.phone}` : ""}.
          </p>
        </Reveal>

        <Reveal delay={200}>
          <form onSubmit={handleSubmit} className="mt-12 grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="text"
                name="user_name"
                required
                placeholder="Your name"
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-accent"
              />
              <input
                type="email"
                name="user_email"
                required
                placeholder="Your email"
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-accent"
              />
            </div>
            <textarea
              name="message"
              required
              rows={5}
              placeholder="Your message"
              className="resize-y rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-accent"
            />

            <div className="mt-2 flex items-center justify-center gap-4">
              <button
                type="submit"
                disabled={status === "sending"}
                className="pill-btn bg-accent px-7 py-2.5 text-white hover:bg-accent-hover disabled:opacity-60"
              >
                {status === "sending" ? "Sending…" : "Send message"}
              </button>
            </div>

            {status === "sent" && (
              <p className="text-center text-sm text-emerald-400">
                {contactHeader?.successMessage || "Thanks — your message has been sent."}
              </p>
            )}
            {status === "error" && (
              <p className="text-center text-sm text-rose-400">
                {contactHeader?.errorMessage || "Something went wrong."}{" "}
                <a href={`mailto:${profile.email}`} className="underline">
                  Email me directly instead
                </a>
                .
              </p>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}
