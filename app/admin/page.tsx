"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  PortfolioData,
  defaultPortfolioData,
  ExperienceEntry,
  Project,
  Certification,
  SkillGroup,
  EducationEntry,
} from "@/lib/data";

type Tab = "experience" | "projects" | "certifications" | "skills" | "profile" | "education";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<PortfolioData>(defaultPortfolioData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("experience");
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Check authentication & load portfolio data
  useEffect(() => {
    async function init() {
      try {
        const authRes = await fetch("/api/auth/check");
        const authData = await authRes.json();
        if (!authData.authenticated) {
          router.push("/admin/login");
          return;
        }

        const dataRes = await fetch("/api/portfolio");
        const json = await dataRes.json();
        if (json.data) {
          setData(json.data);
        }
      } catch (err) {
        console.error("Failed to load admin data", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [router]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4500);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(data),
      });

      let resData: any = {};
      try {
        resData = await res.json();
      } catch {
        resData = { error: `Server returned ${res.status}: ${res.statusText || "Error"}` };
      }

      if (!res.ok) {
        showToast(resData.error || `Failed to save changes (${res.status})`, "error");
        setSaving(false);
        return;
      }

      showToast("🎉 Changes saved! Live website updated instantly.", "success");
    } catch (err) {
      showToast((err as Error).message || "An error occurred while saving.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  // ---------------------------------------------------------------------------
  // Experience Handlers
  // ---------------------------------------------------------------------------
  const updateExperience = (index: number, field: keyof ExperienceEntry, value: any) => {
    const list = [...data.experience];
    list[index] = { ...list[index], [field]: value };
    setData({ ...data, experience: list });
  };

  const updateBulletPoint = (jobIndex: number, bulletIndex: number, text: string) => {
    const list = [...data.experience];
    const bullets = [...list[jobIndex].bullets];
    bullets[bulletIndex] = text;
    list[jobIndex] = { ...list[jobIndex], bullets };
    setData({ ...data, experience: list });
  };

  const addBulletPoint = (jobIndex: number) => {
    const list = [...data.experience];
    const bullets = [...list[jobIndex].bullets, ""];
    list[jobIndex] = { ...list[jobIndex], bullets };
    setData({ ...data, experience: list });
  };

  const removeBulletPoint = (jobIndex: number, bulletIndex: number) => {
    const list = [...data.experience];
    const bullets = list[jobIndex].bullets.filter((_, idx) => idx !== bulletIndex);
    list[jobIndex] = { ...list[jobIndex], bullets };
    setData({ ...data, experience: list });
  };

  const addExperienceRecord = () => {
    const newJob: ExperienceEntry = {
      id: `exp-${Date.now()}`,
      role: "Job Title",
      company: "Company Name",
      location: "City, Country",
      period: "Month Year – Present",
      bullets: ["Describe key responsibility or achievement here."],
      technologies: ["React.js", "Node.js"],
    };
    setData({ ...data, experience: [newJob, ...data.experience] });
    showToast("Added new experience record");
  };

  const deleteExperienceRecord = (index: number) => {
    if (!confirm("Are you sure you want to delete this experience record?")) return;
    const list = data.experience.filter((_, idx) => idx !== index);
    setData({ ...data, experience: list });
  };

  // ---------------------------------------------------------------------------
  // Project Handlers
  // ---------------------------------------------------------------------------
  const updateProject = (index: number, field: keyof Project, value: any) => {
    const list = [...data.projects];
    list[index] = { ...list[index], [field]: value };
    setData({ ...data, projects: list });
  };

  const addProject = () => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      name: "New Project Title",
      year: new Date().getFullYear().toString(),
      description: "Project overview and engineering impact.",
      tags: ["Next.js", "TypeScript", "Tailwind CSS"],
      liveUrl: "",
      githubUrl: "",
    };
    setData({ ...data, projects: [newProj, ...data.projects] });
    showToast("Added new project");
  };

  const deleteProject = (index: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    const list = data.projects.filter((_, idx) => idx !== index);
    setData({ ...data, projects: list });
  };

  // ---------------------------------------------------------------------------
  // Certification Handlers
  // ---------------------------------------------------------------------------
  const updateCert = (index: number, field: keyof Certification, value: any) => {
    const list = [...data.certifications];
    list[index] = { ...list[index], [field]: value };
    setData({ ...data, certifications: list });
  };

  const addCert = () => {
    const newCert: Certification = {
      id: `cert-${Date.now()}`,
      name: "Certification Name",
      issuer: "Microsoft",
      issueDate: new Date().getFullYear().toString(),
      credentialId: "",
      credentialUrl: "",
    };
    setData({ ...data, certifications: [...data.certifications, newCert] });
    showToast("Added new certification");
  };

  const deleteCert = (index: number) => {
    const list = data.certifications.filter((_, idx) => idx !== index);
    setData({ ...data, certifications: list });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-muted font-sans">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent mb-4" />
        <p className="text-[15px] font-medium">Loading workspace...</p>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "experience", label: "Experience", count: data.experience?.length },
    { id: "projects", label: "Projects", count: data.projects?.length },
    { id: "certifications", label: "Certifications", count: data.certifications?.length },
    { id: "skills", label: "Skills", count: data.skillGroups?.length },
    { id: "profile", label: "About & Profile" },
    { id: "education", label: "Education", count: data.education?.length },
  ];

  return (
    <div className="min-h-screen bg-white text-ink font-sans antialiased selection:bg-accent/15 selection:text-accent">
      {/* =================================================================== */}
      {/* Sticky Header matching the exact Portfolio Navbar                   */}
      {/* =================================================================== */}
      <header className="fixed inset-x-0 top-0 z-50 h-14 backdrop-blur-2xl bg-white/85 border-b border-black/[0.08] shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all duration-500 ease-apple">
        <div className="mx-auto flex h-full max-w-content-wide items-center justify-between px-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <span className="text-[15px] font-semibold tracking-tight text-ink">
              {data.profile.name}
            </span>
            <span className="inline-block rounded-full bg-accent/[0.08] px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-accent border border-accent/20">
              CMS Editor
            </span>
          </div>

          {/* Center Tabs Navigation */}
          <nav className="relative hidden items-center gap-1 sm:gap-4 md:gap-7 lg:gap-8 md:flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative py-4 text-[14px] transition-colors duration-300 flex items-center gap-1.5 ${
                  activeTab === tab.id ? "text-ink font-semibold" : "text-muted hover:text-ink font-normal"
                }`}
              >
                <span>{tab.label}</span>
                {typeof tab.count === "number" && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-medium transition-colors ${
                      activeTab === tab.id
                        ? "bg-accent/15 text-accent"
                        : "bg-black/[0.05] text-muted"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
                <span
                  className={`absolute inset-x-0 -bottom-[1px] h-[2px] rounded-full bg-ink transition-all duration-500 ease-apple ${
                    activeTab === tab.id ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
                  }`}
                />
              </button>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="pill-btn border-[1.5px] border-hair text-ink text-[13px] py-1.5 px-4 hover:border-ink hover:text-ink transition-all duration-300 hidden sm:inline-flex"
            >
              Live Site&nbsp;↗
            </a>

            <button
              onClick={handleSave}
              disabled={saving}
              className="pill-btn bg-accent text-white hover:bg-accent-hover text-[13px] py-1.5 px-5 shadow-[0_2px_12px_rgba(0,113,227,0.25)] hover:shadow-[0_4px_16px_rgba(0,113,227,0.35)] disabled:opacity-50 transition-all duration-300"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>

            <button
              onClick={handleLogout}
              className="text-xs text-muted hover:text-ink transition-colors ml-1"
              title="Sign Out"
            >
              Exit
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex items-center gap-2 overflow-x-auto px-6 py-2 border-t border-black/[0.04] bg-surface/80 md:hidden no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "bg-ink text-white font-medium"
                  : "bg-white text-muted border border-black/[0.06]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Floating Toast Notification */}
      {notification && (
        <div className="fixed bottom-8 inset-x-0 z-50 flex justify-center pointer-events-none px-4">
          <div
            className={`pointer-events-auto rounded-full px-6 py-3.5 text-[14px] font-medium shadow-[0_12px_36px_rgba(0,0,0,0.18)] flex items-center gap-3 transition-all duration-500 ease-apple animate-fade-in-up ${
              notification.type === "success"
                ? "bg-ink text-white"
                : "bg-rose-600 text-white"
            }`}
          >
            <span>{notification.type === "success" ? "✓" : "⚠"}</span>
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* Main Content Area                                                   */}
      {/* =================================================================== */}
      <main className="mx-auto max-w-content px-6 pt-28 pb-32">
        {/* ================================================================= */}
        {/* TAB 1: WORK EXPERIENCE                                            */}
        {/* ================================================================= */}
        {activeTab === "experience" && (
          <section className="space-y-12">
            {/* Section Header */}
            <div className="flex flex-col items-center gap-3">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted">
                Career
              </p>
              <div className="section-divider" />
              <h2 className="mt-4 text-center text-[32px] sm:text-[40px] md:text-[48px] font-semibold tracking-tight text-ink">
                Work Experience
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-center text-[17px] leading-[1.65] text-muted">
                Edit roles, companies, dates, and responsibilities. Add or update individual bullet points.
              </p>
              <button
                onClick={addExperienceRecord}
                className="pill-btn border-[1.5px] border-accent text-accent hover:bg-accent hover:text-white text-sm py-2 px-6 mt-4"
              >
                + Add New Experience
              </button>
            </div>

            {/* List of Experience Cards */}
            <div className="space-y-10 mt-12">
              {data.experience.map((job, jobIdx) => (
                <div
                  key={job.id || jobIdx}
                  className="group relative block overflow-hidden rounded-3xl bg-surface p-8 sm:p-12 transition-all duration-500 ease-apple border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)]"
                >
                  <div className="flex items-center justify-between border-b border-hair/70 pb-5 mb-6">
                    <div className="flex items-center gap-3">
                      <span className="inline-block rounded-full bg-accent/[0.08] px-3.5 py-1 text-[12px] font-medium tracking-wide text-accent">
                        Experience #{jobIdx + 1}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteExperienceRecord(jobIdx)}
                      className="text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors"
                    >
                      Delete Record
                    </button>
                  </div>

                  {/* Primary Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-accent mb-2">
                        Job Title / Role
                      </label>
                      <input
                        type="text"
                        value={job.role}
                        onChange={(e) => updateExperience(jobIdx, "role", e.target.value)}
                        className="w-full rounded-2xl border border-hair/80 bg-white px-4 py-3 text-[15px] font-semibold text-ink outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-accent mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={job.company}
                        onChange={(e) => updateExperience(jobIdx, "company", e.target.value)}
                        className="w-full rounded-2xl border border-hair/80 bg-white px-4 py-3 text-[15px] text-ink outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-accent mb-2">
                        Duration (Period)
                      </label>
                      <input
                        type="text"
                        value={job.period}
                        onChange={(e) => updateExperience(jobIdx, "period", e.target.value)}
                        placeholder="e.g. Apr 2025 – Dec 2025"
                        className="w-full rounded-2xl border border-hair/80 bg-white px-4 py-3 text-[15px] text-ink outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-accent mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={job.location || ""}
                        onChange={(e) => updateExperience(jobIdx, "location", e.target.value)}
                        placeholder="e.g. Gurugram, India (Remote)"
                        className="w-full rounded-2xl border border-hair/80 bg-white px-4 py-3 text-[15px] text-ink outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
                      />
                    </div>
                  </div>

                  {/* Bullet Points with exact timeline style */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">
                        Key Responsibilities & Bullet Points ({job.bullets.length})
                      </label>
                      <button
                        type="button"
                        onClick={() => addBulletPoint(jobIdx)}
                        className="text-xs font-medium text-accent hover:underline flex items-center gap-1"
                      >
                        + Add Bullet Point
                      </button>
                    </div>

                    <div className="space-y-3 pl-2 sm:pl-4 border-l-2 border-hair/60 relative">
                      {job.bullets.map((bullet, bulletIdx) => (
                        <div key={bulletIdx} className="relative pl-6 flex items-start gap-3">
                          <span className="absolute left-[-5px] top-4 h-2 w-2 rounded-full bg-accent ring-4 ring-surface" />
                          <textarea
                            rows={2}
                            value={bullet}
                            onChange={(e) => updateBulletPoint(jobIdx, bulletIdx, e.target.value)}
                            placeholder="Describe achievement, feature built, or engineering impact..."
                            className="flex-1 rounded-2xl border border-hair/80 bg-white px-4 py-3 text-[15px] text-ink leading-relaxed outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
                          />
                          <button
                            type="button"
                            onClick={() => removeBulletPoint(jobIdx, bulletIdx)}
                            className="text-muted hover:text-rose-500 mt-3 p-1 transition-colors text-sm"
                            title="Remove bullet"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technologies tags */}
                  <div className="mt-6 pt-5 border-t border-hair/60">
                    <label className="block text-xs font-medium uppercase tracking-[0.1em] text-muted mb-2">
                      Technologies Used (comma separated)
                    </label>
                    <input
                      type="text"
                      value={job.technologies ? job.technologies.join(", ") : ""}
                      onChange={(e) => {
                        const tags = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                        updateExperience(jobIdx, "technologies", tags);
                      }}
                      placeholder="React.js, Next.js, Node.js, Express.js, MongoDB"
                      className="w-full rounded-2xl border border-hair/80 bg-white px-4 py-3 text-[14px] text-ink outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================================================================= */}
        {/* TAB 2: PROJECTS                                                   */}
        {/* ================================================================= */}
        {activeTab === "projects" && (
          <section className="space-y-12">
            <div className="flex flex-col items-center gap-3">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted">
                Work
              </p>
              <div className="section-divider" />
              <h2 className="mt-4 text-center text-[32px] sm:text-[40px] md:text-[48px] font-semibold tracking-tight text-ink">
                Projects
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-center text-[17px] leading-[1.65] text-muted">
                Manage your featured portfolio projects, descriptions, tech stacks, and live demo links.
              </p>
              <button
                onClick={addProject}
                className="pill-btn border-[1.5px] border-accent text-accent hover:bg-accent hover:text-white text-sm py-2 px-6 mt-4"
              >
                + Add New Project
              </button>
            </div>

            <div className="space-y-10 mt-12">
              {data.projects.map((proj, idx) => (
                <div
                  key={proj.id || idx}
                  className="group relative block overflow-hidden rounded-3xl bg-surface p-8 sm:p-12 transition-all duration-500 ease-apple border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)]"
                >
                  <div className="flex items-center justify-between border-b border-hair/70 pb-5 mb-6">
                    <span className="inline-block rounded-full bg-white px-4 py-1.5 text-xs font-medium tracking-wide text-muted shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
                      Project #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => deleteProject(idx)}
                      className="text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors"
                    >
                      Delete Project
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-accent mb-2">
                        Project Title
                      </label>
                      <input
                        type="text"
                        value={proj.name}
                        onChange={(e) => updateProject(idx, "name", e.target.value)}
                        className="w-full rounded-2xl border border-hair/80 bg-white px-4 py-3 text-[18px] font-semibold text-ink outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-accent mb-2">
                        Year
                      </label>
                      <input
                        type="text"
                        value={proj.year || ""}
                        onChange={(e) => updateProject(idx, "year", e.target.value)}
                        placeholder="2026"
                        className="w-full rounded-2xl border border-hair/80 bg-white px-4 py-3 text-[15px] text-ink outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
                      />
                    </div>
                  </div>

                  <div className="mb-5">
                    <label className="block text-xs font-medium uppercase tracking-[0.1em] text-muted mb-2">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={proj.description}
                      onChange={(e) => updateProject(idx, "description", e.target.value)}
                      className="w-full rounded-2xl border border-hair/80 bg-white px-4 py-3 text-[15px] text-ink leading-relaxed outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-[0.1em] text-muted mb-2">
                        Technologies (comma separated)
                      </label>
                      <input
                        type="text"
                        value={proj.tags ? proj.tags.join(", ") : ""}
                        onChange={(e) => {
                          const tags = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                          updateProject(idx, "tags", tags);
                        }}
                        className="w-full rounded-2xl border border-hair/80 bg-white px-4 py-3 text-[14px] text-ink outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-[0.1em] text-muted mb-2">
                        Live Demo URL
                      </label>
                      <input
                        type="url"
                        value={proj.liveUrl || ""}
                        onChange={(e) => updateProject(idx, "liveUrl", e.target.value)}
                        placeholder="https://..."
                        className="w-full rounded-2xl border border-hair/80 bg-white px-4 py-3 text-[14px] text-ink outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-[0.1em] text-muted mb-2">
                        GitHub Repository URL
                      </label>
                      <input
                        type="url"
                        value={proj.githubUrl || ""}
                        onChange={(e) => updateProject(idx, "githubUrl", e.target.value)}
                        placeholder="https://github.com/..."
                        className="w-full rounded-2xl border border-hair/80 bg-white px-4 py-3 text-[14px] text-ink outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================================================================= */}
        {/* TAB 3: CERTIFICATIONS                                             */}
        {/* ================================================================= */}
        {activeTab === "certifications" && (
          <section className="space-y-12">
            <div className="flex flex-col items-center gap-3">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted">
                Credentials
              </p>
              <div className="section-divider" />
              <h2 className="mt-4 text-center text-[32px] sm:text-[40px] md:text-[48px] font-semibold tracking-tight text-ink">
                Certifications
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-center text-[17px] leading-[1.65] text-muted">
                Add or modify certifications, issuing bodies, and credential verification URLs.
              </p>
              <button
                onClick={addCert}
                className="pill-btn border-[1.5px] border-accent text-accent hover:bg-accent hover:text-white text-sm py-2 px-6 mt-4"
              >
                + Add Certification
              </button>
            </div>

            <div className="space-y-6 mt-12">
              {data.certifications.map((cert, idx) => (
                <div
                  key={cert.id || idx}
                  className="rounded-3xl bg-surface p-8 transition-all duration-500 ease-apple border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)]"
                >
                  <div className="flex items-center justify-between border-b border-hair/70 pb-4 mb-5">
                    <span className="text-xs font-semibold uppercase tracking-[0.15em] text-accent flex items-center gap-2">
                      <span>🏅</span>
                      <span>Certification #{idx + 1}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => deleteCert(idx)}
                      className="text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2">
                      <label className="block text-xs font-medium uppercase tracking-[0.1em] text-muted mb-2">
                        Certification Name
                      </label>
                      <input
                        type="text"
                        value={cert.name}
                        onChange={(e) => updateCert(idx, "name", e.target.value)}
                        className="w-full rounded-2xl border border-hair/80 bg-white px-4 py-3 text-[15px] font-medium text-ink outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-[0.1em] text-muted mb-2">
                        Issuer
                      </label>
                      <input
                        type="text"
                        value={cert.issuer || ""}
                        onChange={(e) => updateCert(idx, "issuer", e.target.value)}
                        placeholder="Microsoft, AWS, etc."
                        className="w-full rounded-2xl border border-hair/80 bg-white px-4 py-3 text-[15px] text-ink outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-[0.1em] text-muted mb-2">
                        Issue Year
                      </label>
                      <input
                        type="text"
                        value={cert.issueDate || ""}
                        onChange={(e) => updateCert(idx, "issueDate", e.target.value)}
                        placeholder="2026"
                        className="w-full rounded-2xl border border-hair/80 bg-white px-4 py-3 text-[15px] text-ink outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
                      />
                    </div>
                    <div className="lg:col-span-2">
                      <label className="block text-xs font-medium uppercase tracking-[0.1em] text-muted mb-2">
                        Credential Verification URL
                      </label>
                      <input
                        type="url"
                        value={cert.credentialUrl || ""}
                        onChange={(e) => updateCert(idx, "credentialUrl", e.target.value)}
                        placeholder="https://..."
                        className="w-full rounded-2xl border border-hair/80 bg-white px-4 py-3 text-[14px] text-ink outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================================================================= */}
        {/* TAB 4: SKILLS                                                     */}
        {/* ================================================================= */}
        {activeTab === "skills" && (
          <section className="space-y-12">
            <div className="flex flex-col items-center gap-3">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted">
                Toolkit
              </p>
              <div className="section-divider" />
              <h2 className="mt-4 text-center text-[32px] sm:text-[40px] md:text-[48px] font-semibold tracking-tight text-ink">
                Technical Skills
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-center text-[17px] leading-[1.65] text-muted">
                Update technologies, languages, and frameworks in each categorized skill group.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {data.skillGroups.map((group, idx) => (
                <div
                  key={group.id || idx}
                  className="rounded-3xl bg-surface p-7 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-all duration-500 ease-apple"
                >
                  <p className="text-[13px] font-semibold uppercase tracking-[0.15em] text-accent mb-4">
                    {group.label}
                  </p>

                  <textarea
                    rows={5}
                    value={group.items.join(", ")}
                    onChange={(e) => {
                      const items = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                      const list = [...data.skillGroups];
                      list[idx] = { ...list[idx], items };
                      setData({ ...data, skillGroups: list });
                    }}
                    className="w-full rounded-2xl border border-hair/80 bg-white p-3.5 text-[14px] text-ink leading-relaxed outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
                  />

                  {/* Preview Pills matching the website */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-white border border-black/[0.06] px-3 py-1 text-[12px] font-medium text-ink shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================================================================= */}
        {/* TAB 5: ABOUT & PROFILE                                            */}
        {/* ================================================================= */}
        {activeTab === "profile" && (
          <section className="space-y-12">
            <div className="flex flex-col items-center gap-3">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted">
                Profile
              </p>
              <div className="section-divider" />
              <h2 className="mt-4 text-center text-[32px] sm:text-[40px] md:text-[48px] font-semibold tracking-tight text-ink">
                About & Bio
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-center text-[17px] leading-[1.65] text-muted">
                Edit your introductory summary, bio paragraph, and contact links.
              </p>
            </div>

            <div className="rounded-3xl bg-surface p-8 sm:p-12 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-8 mt-12">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-accent mb-4 border-b border-hair/60 pb-2">
                  Personal Details
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-[0.1em] text-muted mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={data.profile.name}
                      onChange={(e) => setData({ ...data, profile: { ...data.profile, name: e.target.value } })}
                      className="w-full rounded-2xl border border-hair/80 bg-white px-4 py-3 text-[15px] font-semibold text-ink outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-[0.1em] text-muted mb-2">
                      Job Title / Subtitle
                    </label>
                    <input
                      type="text"
                      value={data.profile.title}
                      onChange={(e) => setData({ ...data, profile: { ...data.profile, title: e.target.value } })}
                      className="w-full rounded-2xl border border-hair/80 bg-white px-4 py-3 text-[15px] text-ink outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-[0.1em] text-muted mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={data.profile.location}
                      onChange={(e) => setData({ ...data, profile: { ...data.profile, location: e.target.value } })}
                      className="w-full rounded-2xl border border-hair/80 bg-white px-4 py-3 text-[15px] text-ink outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-accent mb-4 border-b border-hair/60 pb-2">
                  Headline & Summary
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-[0.1em] text-muted mb-2">
                      Headline (Large Heading in About)
                    </label>
                    <input
                      type="text"
                      value={data.about.headline}
                      onChange={(e) => setData({ ...data, about: { ...data.about, headline: e.target.value } })}
                      className="w-full rounded-2xl border border-hair/80 bg-white px-4 py-3 text-[17px] font-semibold text-ink outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-[0.1em] text-muted mb-2">
                      Professional Summary Paragraph
                    </label>
                    <textarea
                      rows={5}
                      value={data.about.summary}
                      onChange={(e) => setData({ ...data, about: { ...data.about, summary: e.target.value } })}
                      className="w-full rounded-2xl border border-hair/80 bg-white px-4 py-3 text-[15px] text-ink leading-relaxed outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-accent mb-4 border-b border-hair/60 pb-2">
                  Contact & Links
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-[0.1em] text-muted mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={data.profile.email}
                      onChange={(e) => setData({ ...data, profile: { ...data.profile, email: e.target.value } })}
                      className="w-full rounded-2xl border border-hair/80 bg-white px-4 py-3 text-[14px] text-ink outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-[0.1em] text-muted mb-2">
                      Phone (Optional)
                    </label>
                    <input
                      type="text"
                      value={data.profile.phone || ""}
                      onChange={(e) => setData({ ...data, profile: { ...data.profile, phone: e.target.value } })}
                      placeholder="+91 ..."
                      className="w-full rounded-2xl border border-hair/80 bg-white px-4 py-3 text-[14px] text-ink outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-[0.1em] text-muted mb-2">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      value={data.profile.github}
                      onChange={(e) => setData({ ...data, profile: { ...data.profile, github: e.target.value } })}
                      className="w-full rounded-2xl border border-hair/80 bg-white px-4 py-3 text-[14px] text-ink outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-[0.1em] text-muted mb-2">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      value={data.profile.linkedin}
                      onChange={(e) => setData({ ...data, profile: { ...data.profile, linkedin: e.target.value } })}
                      className="w-full rounded-2xl border border-hair/80 bg-white px-4 py-3 text-[14px] text-ink outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================================================================= */}
        {/* TAB 6: EDUCATION                                                  */}
        {/* ================================================================= */}
        {activeTab === "education" && (
          <section className="space-y-12">
            <div className="flex flex-col items-center gap-3">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted">
                Academics
              </p>
              <div className="section-divider" />
              <h2 className="mt-4 text-center text-[32px] sm:text-[40px] md:text-[48px] font-semibold tracking-tight text-ink">
                Education
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-center text-[17px] leading-[1.65] text-muted">
                Update your degree, institution, and years of study.
              </p>
            </div>

            <div className="space-y-6 mt-12">
              {data.education.map((edu, idx) => (
                <div
                  key={edu.id || idx}
                  className="rounded-3xl bg-surface p-8 sm:p-10 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)]"
                >
                  <div className="flex items-center gap-2.5 mb-5 border-b border-hair/70 pb-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-[14px]">
                      🎓
                    </span>
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">
                      Degree Record #{idx + 1}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-[0.1em] text-muted mb-2">
                        Degree
                      </label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => {
                          const list = [...data.education];
                          list[idx] = { ...list[idx], degree: e.target.value };
                          setData({ ...data, education: list });
                        }}
                        className="w-full rounded-2xl border border-hair/80 bg-white px-4 py-3 text-[15px] font-semibold text-ink outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-[0.1em] text-muted mb-2">
                        Institution / University
                      </label>
                      <input
                        type="text"
                        value={edu.school}
                        onChange={(e) => {
                          const list = [...data.education];
                          list[idx] = { ...list[idx], school: e.target.value };
                          setData({ ...data, education: list });
                        }}
                        className="w-full rounded-2xl border border-hair/80 bg-white px-4 py-3 text-[15px] text-ink outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-[0.1em] text-muted mb-2">
                        Duration (Years)
                      </label>
                      <input
                        type="text"
                        value={edu.years}
                        onChange={(e) => {
                          const list = [...data.education];
                          list[idx] = { ...list[idx], years: e.target.value };
                          setData({ ...data, education: list });
                        }}
                        placeholder="2019 – 2023"
                        className="w-full rounded-2xl border border-hair/80 bg-white px-4 py-3 text-[15px] text-ink outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
