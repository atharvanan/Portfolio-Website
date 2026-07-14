import { profile } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="bg-black py-8 text-center text-xs text-white/40">
      <p>
        © {new Date().getFullYear()} {profile.name}. Built with Next.js.
      </p>
    </footer>
  );
}
