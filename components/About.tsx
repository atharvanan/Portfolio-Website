import {
  about as defaultAbout,
  education as defaultEducation,
  certifications as defaultCertifications,
  sectionHeaders as defaultSectionHeaders,
  EducationEntry,
  Certification,
  SectionHeaders,
} from "@/lib/data";
import Reveal from "./Reveal";

export default function About({
  about: propAbout,
  education: propEducation,
  certifications: propCertifications,
  sectionHeaders: propHeaders,
}: {
  about?: { badge?: string; headline: string; summary: string };
  education?: EducationEntry[];
  certifications?: Certification[];
  sectionHeaders?: SectionHeaders;
} = {}) {
  const about = propAbout || defaultAbout;
  const educationList = propEducation && propEducation.length > 0 ? propEducation : defaultEducation;
  const certList = propCertifications && propCertifications.length > 0 ? propCertifications : defaultCertifications;
  const headers = propHeaders || defaultSectionHeaders;

  return (
    <section id="about" className="bg-surface py-32">
      <div className="mx-auto max-w-content-wide px-6">
        <Reveal>
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted">
              {headers?.about?.badge || "About"}
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

              {educationList.map((edu, idx) => (
                <div key={edu.id || `${edu.degree}-${idx}`} className={idx > 0 ? "mt-6 pt-6 border-t border-hair/50" : ""}>
                  <p className="text-[17px] font-semibold text-ink leading-snug">
                    {edu.degree}
                  </p>
                  {edu.specialization && (
                    <p className="mt-1 text-[14px] text-accent font-medium">
                      {edu.specialization}
                    </p>
                  )}
                  {edu.school && (
                    <p className="mt-2 text-[15px] text-muted leading-relaxed">
                      {edu.school}
                    </p>
                  )}
                  {edu.years && (
                    <p className="mt-1 text-[14px] text-muted/70">
                      {edu.years}
                    </p>
                  )}
                  {edu.details && (
                    <p className="mt-2 text-[14px] text-muted leading-relaxed">
                      {edu.details}
                    </p>
                  )}
                </div>
              ))}
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
                {certList.map((c) => {
                  const cert = typeof c === "string" ? { id: c, name: c } : c;
                  const hasMetadata = Boolean(
                    cert.issueDate ||
                    cert.credentialId ||
                    (cert.issuer && !cert.name.toLowerCase().includes(cert.issuer.toLowerCase()))
                  );

                  return (
                    <li
                      key={cert.id || cert.name}
                      className="text-[15px] text-ink leading-relaxed pl-4 relative before:absolute before:left-0 before:top-[10px] before:h-[5px] before:w-[5px] before:rounded-full before:bg-accent/40"
                    >
                      {cert.credentialUrl ? (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 transition-colors duration-300 hover:text-accent group"
                        >
                          <span>{cert.name}</span>
                          <span className="text-[11px] text-muted transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                            ↗
                          </span>
                        </a>
                      ) : (
                        <span>{cert.name}</span>
                      )}
                      {hasMetadata && (
                        <span className="block text-[13px] text-muted leading-tight mt-0.5">
                          {[
                            cert.issuer && !cert.name.toLowerCase().includes(cert.issuer.toLowerCase()) ? cert.issuer : null,
                            cert.issueDate,
                            cert.credentialId ? `ID: ${cert.credentialId}` : null,
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
