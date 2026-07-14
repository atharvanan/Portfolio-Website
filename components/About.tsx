import { about } from "@/lib/data";
import Reveal from "./Reveal";

export default function About() {
  return (
    <section id="about" className="bg-surface py-32">
      <div className="mx-auto max-w-content-wide px-6">
        <Reveal>
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted">
              About
            </p>
            <div className="section-divider" />
          </div>
        </Reveal>

        <Reveal delay={100}>
          <h2 className="mx-auto mt-10 max-w-4xl text-center text-[32px] font-semibold leading-[1.15] tracking-tight text-ink sm:text-[40px] md:text-[48px]">
            {about.headline}
          </h2>
        </Reveal>

        <Reveal delay={200}>
          <p className="mx-auto mt-8 max-w-2xl text-center text-[17px] leading-[1.65] text-muted">
            {about.summary}
          </p>
        </Reveal>

        <div className="mx-auto mt-20 max-w-5xl grid gap-0 sm:grid-cols-2">
          <Reveal delay={300} variant="slide-left">
            <div className="border-t border-hair py-8 pr-8">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-[14px]">
                  🎓
                </span>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">
                  Education
                </p>
              </div>
              <p className="text-[17px] font-semibold text-ink leading-snug">
                {about.education.degree}
              </p>
              <p className="mt-2 text-[15px] text-muted leading-relaxed">
                {about.education.school}
              </p>
              <p className="mt-1 text-[14px] text-muted/70">
                {about.education.years}
              </p>
            </div>
          </Reveal>

          <Reveal delay={400} variant="slide-right">
            <div className="border-t border-hair py-8 sm:pl-8 sm:border-l">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-[14px]">
                  🏅
                </span>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">
                  Certifications
                </p>
              </div>
              <ul className="space-y-3">
                {about.certifications.map((c) => (
                  <li
                    key={c}
                    className="text-[15px] text-ink leading-relaxed pl-4 relative before:absolute before:left-0 before:top-[10px] before:h-[5px] before:w-[5px] before:rounded-full before:bg-accent/40"
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
