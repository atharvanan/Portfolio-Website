import Image from "next/image";
import { profile } from "@/lib/data";
import Reveal from "./Reveal";

export default function Hero() {
  return (
    <section id="top" className="relative flex min-h-screen items-center bg-white pt-12">
      <div className="mx-auto w-full max-w-content-wide px-6 py-28 text-center">
        <Reveal variant="fade-scale">
          <div className="mx-auto mb-10 h-[180px] w-[180px] overflow-hidden rounded-full ring-1 ring-black/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
            <Image
              src={profile.photo}
              alt={profile.name}
              width={180}
              height={180}
              className="h-full w-full object-cover"
              priority
            />
          </div>
        </Reveal>

        <Reveal delay={100}>
          <h1 className="text-gradient text-5xl font-bold tracking-tightest3 sm:text-6xl md:text-7xl lg:text-[80px] lg:leading-[1.05]">
            {profile.name}
          </h1>
        </Reveal>

        <Reveal delay={200}>
          <p className="mt-4 text-xl font-normal tracking-tight text-muted sm:text-2xl md:text-[28px]">
            {profile.title}
          </p>
        </Reveal>

        <Reveal delay={300}>
          <div className="mt-10 flex items-center justify-center">
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="pill-btn border-[1.5px] border-accent text-accent hover:bg-accent hover:text-white"
            >
              GitHub
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
