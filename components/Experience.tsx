import {
  experience as defaultExperience,
  sectionHeaders as defaultSectionHeaders,
  ExperienceEntry,
  SectionHeaders,
} from "@/lib/data";
import Reveal from "./Reveal";

export default function Experience({
  experience: propExperience,
  sectionHeaders: propHeaders,
}: {
  experience?: ExperienceEntry[];
  sectionHeaders?: SectionHeaders;
} = {}) {
  const experience = propExperience || defaultExperience;
  const headers = propHeaders || defaultSectionHeaders;

  return (
    <section id="experience" className="bg-surface py-32">
      <div className="mx-auto max-w-content-wide px-6">
        <Reveal>
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted">
              {headers?.experience?.badge || "Career"}
            </p>
            <div className="section-divider" />
          </div>
        </Reveal>
        <Reveal delay={100}>
          <h2 className="mt-10 text-center text-[32px] font-semibold tracking-tight text-ink sm:text-[40px] md:text-[48px]">
            {headers?.experience?.title || "Experience"}
          </h2>
        </Reveal>

        <div className="relative mx-auto mt-16 max-w-4xl">
          <div className="absolute left-[15px] top-0 bottom-0 w-[1px] bg-hair sm:left-[19px]" />

          {experience.map((job, i) => (
            <Reveal key={job.id || `${job.company}-${i}`} delay={i * 150}>
              <div className="relative pl-12 pb-24 last:pb-0 sm:pl-14">
                <div className="absolute left-[9px] top-1.5 h-[13px] w-[13px] rounded-full border-[2.5px] border-accent bg-white sm:left-[13px]" />

                {job.period && (
                  <span className="inline-block rounded-full bg-accent/[0.08] px-3.5 py-1 text-[12px] font-medium tracking-wide text-accent">
                    {job.period}
                  </span>
                )}

                <h3 className="mt-4 text-[22px] font-semibold tracking-tight text-ink leading-snug">
                  {job.role}
                </h3>
                <p className="mt-1.5 text-[15px] text-muted">
                  {job.company}
                  {job.location && (
                    <>
                      <span className="mx-2 text-hair">·</span>
                      {job.location}
                    </>
                  )}
                </p>

                {job.bullets && job.bullets.length > 0 && (
                  <ul className="mt-6 space-y-4">
                    {job.bullets.map((b, idx) => (
                      <li
                        key={idx}
                        className="relative pl-6 text-[15px] leading-[1.7] text-ink/80"
                      >
                        <span className="absolute left-0 top-[11px] h-1.5 w-1.5 rounded-full bg-accent" />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}

                {job.technologies && job.technologies.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {job.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full bg-white px-3 py-1 text-[12px] font-medium text-ink/70 border border-black/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
