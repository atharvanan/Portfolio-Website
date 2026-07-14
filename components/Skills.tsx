import { skillGroups } from "@/lib/data";
import Reveal from "./Reveal";

export default function Skills() {
  return (
    <section id="skills" className="bg-[#1d1d1f] py-32 text-white">
      <div className="mx-auto max-w-content-wide px-6">
        <Reveal>
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/50">
              Toolkit
            </p>
            <div className="mx-auto h-[1px] w-10 bg-white/20" />
          </div>
        </Reveal>
        <Reveal delay={100}>
          <h2 className="mt-10 text-center text-[32px] font-semibold tracking-tight sm:text-[40px] md:text-[48px]">
            <span className="text-gradient-light">Skills</span>
          </h2>
        </Reveal>

        <div className="mx-auto mt-16 max-w-6xl grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group, i) => (
            <Reveal key={group.label} delay={i * 80} variant="fade-scale">
              <div className="rounded-2xl bg-white/[0.06] backdrop-blur-sm p-7 transition-all duration-500 ease-apple hover:bg-white/[0.1] border border-white/[0.06] hover:border-white/[0.12]">
                <p className="text-[13px] font-semibold uppercase tracking-[0.15em] text-accent mb-5">
                  {group.label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/[0.12] px-3.5 py-1.5 text-[13px] text-white/80 transition-all duration-300 hover:bg-white/[0.08] hover:text-white hover:border-white/[0.25]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
