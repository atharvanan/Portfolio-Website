import { profile as defaultProfile, Profile } from "@/lib/data";

export default function Footer({ profile: propProfile }: { profile?: Profile } = {}) {
  const profile = propProfile || defaultProfile;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black py-8 text-center text-xs text-white/40">
      <div className="mb-3 flex items-center justify-center gap-5 text-white/60">
        {profile.github && (
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-white"
          >
            GitHub
          </a>
        )}
        {profile.linkedin && (
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-white"
          >
            LinkedIn
          </a>
        )}
        {profile.leetcode && (
          <a
            href={profile.leetcode}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-white"
          >
            LeetCode
          </a>
        )}
        {profile.email && (
          <a
            href={`mailto:${profile.email}`}
            className="transition-colors hover:text-white"
          >
            Email
          </a>
        )}
      </div>
      <p>
        © {currentYear} {profile.name}. Built with Next.js.
      </p>
    </footer>
  );
}
