"use client";

import { projects } from "@/lib/data";
import Reveal from "./Reveal";

export default function Projects() {
  return (
    <section id="projects" className="bg-white py-32">
      <div className="mx-auto max-w-content-wide px-6">
        <Reveal>
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted">
              Work
            </p>
            <div className="section-divider" />
          </div>
        </Reveal>
        <Reveal delay={100}>
          <h2 className="mt-10 text-center text-[32px] font-semibold tracking-tight text-ink sm:text-[40px] md:text-[48px]">
            Projects
          </h2>
        </Reveal>

        <div className="mt-16 space-y-8">
          {projects.map((project, i) => (
            <Reveal key={project.name} delay={i * 120} variant="fade-scale">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block overflow-hidden rounded-3xl bg-surface p-10 sm:p-14 transition-all duration-500 ease-apple hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1"
              >
                <span className="inline-block rounded-full bg-white px-4 py-1.5 text-xs font-medium tracking-wide text-muted shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
                  {project.year}
                </span>

                <h3 className="mt-6 text-[32px] font-semibold tracking-tight text-ink sm:text-[40px] md:text-[48px] leading-[1.1]">
                  {project.name}
                </h3>

                <p className="mt-5 max-w-xl text-[17px] leading-[1.65] text-muted">
                  {project.description}
                </p>

                <div className="mt-7 flex flex-wrap gap-2.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white px-4 py-1.5 text-[13px] font-medium text-ink shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-shadow duration-300 group-hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-8 flex items-center gap-6 text-[15px]">
                  <span className="font-medium text-accent transition-all duration-300 group-hover:tracking-wide">
                    Visit site&nbsp;→
                  </span>
                  <span
                    role="link"
                    tabIndex={0}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(project.githubUrl, "_blank", "noopener,noreferrer");
                    }}
                    className="font-medium text-muted transition-colors duration-300 hover:text-ink"
                  >
                    View code&nbsp;→
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
