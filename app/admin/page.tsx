"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
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

      setHasUnsavedChanges(false);
      showToast("Changes saved successfully! Live website updated.", "success");
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
    setHasUnsavedChanges(true);
  };

  const updateBulletPoint = (jobIndex: number, bulletIndex: number, text: string) => {
    const list = [...data.experience];
    const bullets = [...list[jobIndex].bullets];
    bullets[bulletIndex] = text;
    list[jobIndex] = { ...list[jobIndex], bullets };
    setData({ ...data, experience: list });
    setHasUnsavedChanges(true);
  };

  const addBulletPoint = (jobIndex: number) => {
    const list = [...data.experience];
    const bullets = [...list[jobIndex].bullets, ""];
    list[jobIndex] = { ...list[jobIndex], bullets };
    setData({ ...data, experience: list });
    setHasUnsavedChanges(true);
  };

  const removeBulletPoint = (jobIndex: number, bulletIndex: number) => {
    const list = [...data.experience];
    const bullets = list[jobIndex].bullets.filter((_, idx) => idx !== bulletIndex);
    list[jobIndex] = { ...list[jobIndex], bullets };
    setData({ ...data, experience: list });
    setHasUnsavedChanges(true);
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
    setHasUnsavedChanges(true);
    showToast("Added new experience record");
  };

  const deleteExperienceRecord = (index: number) => {
    if (!confirm("Are you sure you want to delete this experience record?")) return;
    const list = data.experience.filter((_, idx) => idx !== index);
    setData({ ...data, experience: list });
    setHasUnsavedChanges(true);
  };

  // ---------------------------------------------------------------------------
  // Project Handlers
  // ---------------------------------------------------------------------------
  const updateProject = (index: number, field: keyof Project, value: any) => {
    const list = [...data.projects];
    list[index] = { ...list[index], [field]: value };
    setData({ ...data, projects: list });
    setHasUnsavedChanges(true);
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
    setHasUnsavedChanges(true);
    showToast("Added new project");
  };

  const deleteProject = (index: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    const list = data.projects.filter((_, idx) => idx !== index);
    setData({ ...data, projects: list });
    setHasUnsavedChanges(true);
  };

  // ---------------------------------------------------------------------------
  // Certification Handlers
  // ---------------------------------------------------------------------------
  const updateCert = (index: number, field: keyof Certification, value: any) => {
    const list = [...data.certifications];
    list[index] = { ...list[index], [field]: value };
    setData({ ...data, certifications: list });
    setHasUnsavedChanges(true);
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
    setHasUnsavedChanges(true);
    showToast("Added new certification");
  };

  const deleteCert = (index: number) => {
    if (!confirm("Are you sure you want to delete this certification?")) return;
    const list = data.certifications.filter((_, idx) => idx !== index);
    setData({ ...data, certifications: list });
    setHasUnsavedChanges(true);
  };

  // ---------------------------------------------------------------------------
  // Education Handlers
  // ---------------------------------------------------------------------------
  const updateEducation = (index: number, field: keyof EducationEntry, value: string) => {
    const list = [...data.education];
    list[index] = { ...list[index], [field]: value };
    setData({ ...data, education: list });
    setHasUnsavedChanges(true);
  };

  const addEducation = () => {
    const newEdu: EducationEntry = {
      id: `edu-${Date.now()}`,
      degree: "Degree Name",
      school: "University / Institute Name",
      years: "2020 – 2024",
    };
    setData({ ...data, education: [...data.education, newEdu] });
    setHasUnsavedChanges(true);
    showToast("Added new education entry");
  };

  const deleteEducation = (index: number) => {
    if (!confirm("Are you sure you want to delete this education entry?")) return;
    const list = data.education.filter((_, idx) => idx !== index);
    setData({ ...data, education: list });
    setHasUnsavedChanges(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center text-muted font-sans">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-accent border-t-transparent mb-3" />
        <p className="text-sm font-medium text-ink">Loading editor...</p>
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
    <div className="min-h-screen bg-surface text-ink font-sans antialiased selection:bg-accent/15 selection:text-accent">
      {/* =================================================================== */}
      {/* 1. Sleek Apple Studio Fixed Header                                 */}
      {/* =================================================================== */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-hair/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Left: User Identity */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-9 w-9 overflow-hidden rounded-full ring-1 ring-black/10 shrink-0">
              <Image
                src={data.profile.photo}
                alt={data.profile.name}
                width={36}
                height={36}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-semibold text-ink truncate">
                  {data.profile.name}
                </span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-surface text-muted border border-hair/60 hidden sm:inline-block">
                  Admin Studio
                </span>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            {hasUnsavedChanges && (
              <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/80 hidden sm:inline-block animate-pulse">
                Unsaved edits
              </span>
            )}

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="pill-btn text-xs font-medium text-muted hover:text-ink px-3 py-1.5 border border-hair/80 hover:border-hair bg-white transition-all hidden sm:inline-flex items-center gap-1"
            >
              <span>View Site</span>
              <span className="text-[11px]">↗</span>
            </a>

            <button
              onClick={handleSave}
              disabled={saving}
              className="pill-btn bg-accent text-white hover:bg-accent-hover text-xs font-semibold px-4 py-2 shadow-sm disabled:opacity-50 transition-all flex items-center gap-1.5"
            >
              {saving ? (
                <>
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>Save Changes</span>
                </>
              )}
            </button>

            <button
              onClick={handleLogout}
              className="text-xs text-muted hover:text-ink p-2 rounded-lg hover:bg-surface transition-colors"
              title="Sign Out"
            >
              Exit
            </button>
          </div>
        </div>

        {/* =================================================================== */}
        {/* 2. Spacious Horizontal Segmented Navigation Tab Bar                 */}
        {/* =================================================================== */}
        <div className="border-t border-hair/40 bg-surface/60">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <nav className="flex items-center gap-1.5 py-2.5 overflow-x-auto no-scrollbar">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pill-btn text-xs font-medium py-1.5 px-3.5 whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                      isActive
                        ? "bg-ink text-white shadow-sm"
                        : "text-muted hover:text-ink hover:bg-white/80"
                    }`}
                  >
                    <span>{tab.label}</span>
                    {typeof tab.count === "number" && (
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-full ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-black/[0.06] text-muted"
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Floating Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 inset-x-0 z-50 flex justify-center pointer-events-none px-4">
          <div
            className={`pointer-events-auto rounded-full px-5 py-2.5 text-xs font-medium shadow-lg flex items-center gap-2 transition-all animate-fade-in-up ${
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
      {/* 3. Main Editor Work Area                                           */}
      {/* =================================================================== */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-32">
        {/* ================================================================= */}
        {/* TAB 1: WORK EXPERIENCE                                            */}
        {/* ================================================================= */}
        {activeTab === "experience" && (
          <div className="space-y-6">
            {/* Clean Section Header with Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-hair/60">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-ink">
                  Work Experience
                </h1>
                <p className="text-xs text-muted mt-0.5">
                  Manage your employment history, roles, and accomplishments.
                </p>
              </div>
              <button
                onClick={addExperienceRecord}
                className="pill-btn border border-hair hover:border-ink bg-white text-ink text-xs font-medium py-1.5 px-4 shadow-sm self-start sm:self-auto transition-all"
              >
                + Add Experience
              </button>
            </div>

            {/* List of Clean Experience Cards */}
            <div className="space-y-5">
              {data.experience.map((job, jobIdx) => (
                <div
                  key={job.id || jobIdx}
                  className="bg-white rounded-2xl border border-hair/70 p-5 sm:p-7 shadow-sm transition-all hover:border-hair"
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-4 mb-5 border-b border-hair/50">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 text-accent text-xs font-bold shrink-0">
                        {jobIdx + 1}
                      </span>
                      <span className="font-semibold text-[15px] text-ink truncate">
                        {job.role || "Untitled Role"}
                        <span className="font-normal text-muted"> · {job.company || "Company"}</span>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteExperienceRecord(jobIdx)}
                      className="text-xs font-medium text-rose-500 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1 rounded-lg transition-colors shrink-0"
                    >
                      Delete
                    </button>
                  </div>

                  {/* Primary Fields Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">
                        Job Title
                      </label>
                      <input
                        type="text"
                        value={job.role}
                        onChange={(e) => updateExperience(jobIdx, "role", e.target.value)}
                        placeholder="e.g. Full Stack Developer"
                        className="w-full rounded-xl border border-hair/70 bg-surface/30 px-3 py-2 text-sm text-ink outline-none focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={job.company}
                        onChange={(e) => updateExperience(jobIdx, "company", e.target.value)}
                        placeholder="e.g. Acme Corp"
                        className="w-full rounded-xl border border-hair/70 bg-surface/30 px-3 py-2 text-sm text-ink outline-none focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">
                        Duration / Period
                      </label>
                      <input
                        type="text"
                        value={job.period}
                        onChange={(e) => updateExperience(jobIdx, "period", e.target.value)}
                        placeholder="e.g. Apr 2025 – Dec 2025"
                        className="w-full rounded-xl border border-hair/70 bg-surface/30 px-3 py-2 text-sm text-ink outline-none focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">
                        Location
                      </label>
                      <input
                        type="text"
                        value={job.location || ""}
                        onChange={(e) => updateExperience(jobIdx, "location", e.target.value)}
                        placeholder="e.g. Mumbai, India (Remote)"
                        className="w-full rounded-xl border border-hair/70 bg-surface/30 px-3 py-2 text-sm text-ink outline-none focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
                      />
                    </div>
                  </div>

                  {/* Bullet Points: Clean, Comfortable, Edit-Friendly List */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                        Key Responsibilities & Bullet Points ({job.bullets.length})
                      </label>
                      <button
                        type="button"
                        onClick={() => addBulletPoint(jobIdx)}
                        className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
                      >
                        + Add Bullet
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {job.bullets.map((bullet, bulletIdx) => (
                        <div key={bulletIdx} className="flex items-start gap-2.5">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface text-[10px] font-semibold text-muted border border-hair/50 mt-2">
                            {bulletIdx + 1}
                          </span>
                          <textarea
                            rows={2}
                            value={bullet}
                            onChange={(e) => updateBulletPoint(jobIdx, bulletIdx, e.target.value)}
                            placeholder="Describe your achievement, responsibilities, or impact..."
                            className="flex-1 rounded-xl border border-hair/70 bg-surface/30 px-3.5 py-2 text-sm text-ink leading-relaxed outline-none focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => removeBulletPoint(jobIdx, bulletIdx)}
                            className="text-muted/60 hover:text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition-colors mt-1.5"
                            title="Remove bullet"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => addBulletPoint(jobIdx)}
                      className="w-full mt-3 py-2 border border-dashed border-hair/80 rounded-xl text-xs font-medium text-muted hover:text-accent hover:border-accent/40 hover:bg-accent/[0.02] transition-colors flex items-center justify-center gap-1"
                    >
                      <span>+</span>
                      <span>Add another bullet point</span>
                    </button>
                  </div>

                  {/* Technologies tags */}
                  <div className="mt-5 pt-4 border-t border-hair/50">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">
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
                      className="w-full rounded-xl border border-hair/70 bg-surface/30 px-3 py-2 text-sm text-ink outline-none focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
                    />

                    {job.technologies && job.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {job.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="inline-block rounded-full bg-surface px-2.5 py-0.5 text-[11px] font-medium text-muted border border-hair/50"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: PROJECTS                                                   */}
        {/* ================================================================= */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-hair/60">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-ink">
                  Featured Projects
                </h1>
                <p className="text-xs text-muted mt-0.5">
                  Edit your showcase projects, descriptions, tech stacks, and links.
                </p>
              </div>
              <button
                onClick={addProject}
                className="pill-btn border border-hair hover:border-ink bg-white text-ink text-xs font-medium py-1.5 px-4 shadow-sm self-start sm:self-auto transition-all"
              >
                + Add Project
              </button>
            </div>

            <div className="space-y-5">
              {data.projects.map((proj, idx) => (
                <div
                  key={proj.id || idx}
                  className="bg-white rounded-2xl border border-hair/70 p-5 sm:p-7 shadow-sm transition-all hover:border-hair"
                >
                  <div className="flex items-center justify-between pb-4 mb-5 border-b border-hair/50">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 text-accent text-xs font-bold shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-[15px] text-ink truncate">
                        {proj.name || "Untitled Project"}
                        {proj.year && <span className="font-normal text-muted"> ({proj.year})</span>}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteProject(idx)}
                      className="text-xs font-medium text-rose-500 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1 rounded-lg transition-colors shrink-0"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">
                        Project Title
                      </label>
                      <input
                        type="text"
                        value={proj.name}
                        onChange={(e) => updateProject(idx, "name", e.target.value)}
                        placeholder="e.g. My Awesome App"
                        className="w-full rounded-xl border border-hair/70 bg-surface/30 px-3 py-2 text-sm text-ink outline-none focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">
                        Year
                      </label>
                      <input
                        type="text"
                        value={proj.year || ""}
                        onChange={(e) => updateProject(idx, "year", e.target.value)}
                        placeholder="2026"
                        className="w-full rounded-xl border border-hair/70 bg-surface/30 px-3 py-2 text-sm text-ink outline-none focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={proj.description}
                      onChange={(e) => updateProject(idx, "description", e.target.value)}
                      placeholder="Explain what problem it solves and what technologies made it happen..."
                      className="w-full rounded-xl border border-hair/70 bg-surface/30 px-3.5 py-2 text-sm text-ink leading-relaxed outline-none focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">
                        Live Demo URL
                      </label>
                      <input
                        type="url"
                        value={proj.liveUrl || ""}
                        onChange={(e) => updateProject(idx, "liveUrl", e.target.value)}
                        placeholder="https://..."
                        className="w-full rounded-xl border border-hair/70 bg-surface/30 px-3 py-2 text-sm text-ink outline-none focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">
                        GitHub Repository URL
                      </label>
                      <input
                        type="url"
                        value={proj.githubUrl || ""}
                        onChange={(e) => updateProject(idx, "githubUrl", e.target.value)}
                        placeholder="https://github.com/..."
                        className="w-full rounded-xl border border-hair/70 bg-surface/30 px-3 py-2 text-sm text-ink outline-none focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">
                      Technologies & Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={proj.tags ? proj.tags.join(", ") : ""}
                      onChange={(e) => {
                        const tags = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                        updateProject(idx, "tags", tags);
                      }}
                      placeholder="React.js, Tailwind CSS, Node.js"
                      className="w-full rounded-xl border border-hair/70 bg-surface/30 px-3 py-2 text-sm text-ink outline-none focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
                    />
                    {proj.tags && proj.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {proj.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-block rounded-full bg-surface px-2.5 py-0.5 text-[11px] font-medium text-muted border border-hair/50"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: CERTIFICATIONS                                             */}
        {/* ================================================================= */}
        {activeTab === "certifications" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-hair/60">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-ink">
                  Certifications
                </h1>
                <p className="text-xs text-muted mt-0.5">
                  Manage your verified licenses, certificates, and credentials.
                </p>
              </div>
              <button
                onClick={addCert}
                className="pill-btn border border-hair hover:border-ink bg-white text-ink text-xs font-medium py-1.5 px-4 shadow-sm self-start sm:self-auto transition-all"
              >
                + Add Certification
              </button>
            </div>

            <div className="space-y-4">
              {data.certifications.map((cert, idx) => (
                <div
                  key={cert.id || idx}
                  className="bg-white rounded-2xl border border-hair/70 p-5 sm:p-6 shadow-sm transition-all hover:border-hair"
                >
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-hair/50">
                    <span className="font-semibold text-sm text-ink">
                      {cert.name || "Untitled Certification"}
                    </span>
                    <button
                      type="button"
                      onClick={() => deleteCert(idx)}
                      className="text-xs font-medium text-rose-500 hover:text-rose-700 hover:bg-rose-50 px-2 py-1 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">
                        Certification Name
                      </label>
                      <input
                        type="text"
                        value={cert.name}
                        onChange={(e) => updateCert(idx, "name", e.target.value)}
                        className="w-full rounded-xl border border-hair/70 bg-surface/30 px-3 py-2 text-sm text-ink outline-none focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">
                        Issuer
                      </label>
                      <input
                        type="text"
                        value={cert.issuer || ""}
                        onChange={(e) => updateCert(idx, "issuer", e.target.value)}
                        placeholder="Microsoft, AWS, etc."
                        className="w-full rounded-xl border border-hair/70 bg-surface/30 px-3 py-2 text-sm text-ink outline-none focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">
                        Year / Date
                      </label>
                      <input
                        type="text"
                        value={cert.issueDate || ""}
                        onChange={(e) => updateCert(idx, "issueDate", e.target.value)}
                        placeholder="2026"
                        className="w-full rounded-xl border border-hair/70 bg-surface/30 px-3 py-2 text-sm text-ink outline-none focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">
                        Credential Verification URL
                      </label>
                      <input
                        type="url"
                        value={cert.credentialUrl || ""}
                        onChange={(e) => updateCert(idx, "credentialUrl", e.target.value)}
                        placeholder="https://..."
                        className="w-full rounded-xl border border-hair/70 bg-surface/30 px-3 py-2 text-sm text-ink outline-none focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 4: SKILLS                                                     */}
        {/* ================================================================= */}
        {activeTab === "skills" && (
          <div className="space-y-6">
            <div className="pb-2 border-b border-hair/60">
              <h1 className="text-xl font-bold tracking-tight text-ink">
                Technical Skills
              </h1>
              <p className="text-xs text-muted mt-0.5">
                Update technologies and frameworks categorized by group.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.skillGroups.map((group, idx) => (
                <div
                  key={group.id || idx}
                  className="bg-white rounded-2xl border border-hair/70 p-5 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                      {group.label}
                    </span>
                    <span className="text-[11px] text-muted">
                      {group.items.length} skills
                    </span>
                  </div>

                  <textarea
                    rows={3}
                    value={group.items.join(", ")}
                    onChange={(e) => {
                      const items = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                      const list = [...data.skillGroups];
                      list[idx] = { ...list[idx], items };
                      setData({ ...data, skillGroups: list });
                      setHasUnsavedChanges(true);
                    }}
                    className="w-full rounded-xl border border-hair/70 bg-surface/30 p-3 text-sm text-ink leading-relaxed outline-none focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
                  />

                  <div className="flex flex-wrap gap-1 pt-1">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-surface border border-hair/50 px-2.5 py-0.5 text-[11px] font-medium text-ink"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 5: ABOUT & PROFILE                                            */}
        {/* ================================================================= */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <div className="pb-2 border-b border-hair/60">
              <h1 className="text-xl font-bold tracking-tight text-ink">
                About & Profile
              </h1>
              <p className="text-xs text-muted mt-0.5">
                Edit your personal identity, bio summary, and social links.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-hair/70 p-6 sm:p-7 shadow-sm space-y-6">
              {/* Identity Details */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3 pb-2 border-b border-hair/40">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={data.profile.name}
                      onChange={(e) => {
                        setData({ ...data, profile: { ...data.profile, name: e.target.value } });
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full rounded-xl border border-hair/70 bg-surface/30 px-3 py-2 text-sm text-ink outline-none focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">
                      Professional Title
                    </label>
                    <input
                      type="text"
                      value={data.profile.title}
                      onChange={(e) => {
                        setData({ ...data, profile: { ...data.profile, title: e.target.value } });
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full rounded-xl border border-hair/70 bg-surface/30 px-3 py-2 text-sm text-ink outline-none focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">
                      Location
                    </label>
                    <input
                      type="text"
                      value={data.profile.location}
                      onChange={(e) => {
                        setData({ ...data, profile: { ...data.profile, location: e.target.value } });
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full rounded-xl border border-hair/70 bg-surface/30 px-3 py-2 text-sm text-ink outline-none focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Bio & Headline */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3 pb-2 border-b border-hair/40">
                  Bio & Summary
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">
                      Headline (About Section Heading)
                    </label>
                    <input
                      type="text"
                      value={data.about.headline}
                      onChange={(e) => {
                        setData({ ...data, about: { ...data.about, headline: e.target.value } });
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full rounded-xl border border-hair/70 bg-surface/30 px-3 py-2 text-sm text-ink outline-none focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">
                      Professional Summary Paragraph
                    </label>
                    <textarea
                      rows={5}
                      value={data.about.summary}
                      onChange={(e) => {
                        setData({ ...data, about: { ...data.about, summary: e.target.value } });
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full rounded-xl border border-hair/70 bg-surface/30 px-3.5 py-2.5 text-sm text-ink leading-relaxed outline-none focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Links */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3 pb-2 border-b border-hair/40">
                  Contact & Links
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      value={data.profile.email}
                      onChange={(e) => {
                        setData({ ...data, profile: { ...data.profile, email: e.target.value } });
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full rounded-xl border border-hair/70 bg-surface/30 px-3 py-2 text-sm text-ink outline-none focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">
                      Phone (Optional)
                    </label>
                    <input
                      type="text"
                      value={data.profile.phone || ""}
                      onChange={(e) => {
                        setData({ ...data, profile: { ...data.profile, phone: e.target.value } });
                        setHasUnsavedChanges(true);
                      }}
                      placeholder="+91 ..."
                      className="w-full rounded-xl border border-hair/70 bg-surface/30 px-3 py-2 text-sm text-ink outline-none focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      value={data.profile.github}
                      onChange={(e) => {
                        setData({ ...data, profile: { ...data.profile, github: e.target.value } });
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full rounded-xl border border-hair/70 bg-surface/30 px-3 py-2 text-sm text-ink outline-none focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      value={data.profile.linkedin}
                      onChange={(e) => {
                        setData({ ...data, profile: { ...data.profile, linkedin: e.target.value } });
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full rounded-xl border border-hair/70 bg-surface/30 px-3 py-2 text-sm text-ink outline-none focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 6: EDUCATION                                                  */}
        {/* ================================================================= */}
        {activeTab === "education" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-hair/60">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-ink">
                  Education
                </h1>
                <p className="text-xs text-muted mt-0.5">
                  Update your degree, college, university, and graduation years.
                </p>
              </div>
              <button
                onClick={addEducation}
                className="pill-btn border border-hair hover:border-ink bg-white text-ink text-xs font-medium py-1.5 px-4 shadow-sm self-start sm:self-auto transition-all"
              >
                + Add Education
              </button>
            </div>

            <div className="space-y-4">
              {data.education.map((edu, idx) => (
                <div
                  key={edu.id || idx}
                  className="bg-white rounded-2xl border border-hair/70 p-5 sm:p-6 shadow-sm transition-all hover:border-hair"
                >
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-hair/50">
                    <span className="font-semibold text-sm text-ink">
                      {edu.degree || "Untitled Degree"}
                    </span>
                    <button
                      type="button"
                      onClick={() => deleteEducation(idx)}
                      className="text-xs font-medium text-rose-500 hover:text-rose-700 hover:bg-rose-50 px-2 py-1 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">
                        Degree
                      </label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => updateEducation(idx, "degree", e.target.value)}
                        className="w-full rounded-xl border border-hair/70 bg-surface/30 px-3 py-2 text-sm text-ink outline-none focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">
                        Institution / University
                      </label>
                      <input
                        type="text"
                        value={edu.school}
                        onChange={(e) => updateEducation(idx, "school", e.target.value)}
                        className="w-full rounded-xl border border-hair/70 bg-surface/30 px-3 py-2 text-sm text-ink outline-none focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">
                        Duration (Years)
                      </label>
                      <input
                        type="text"
                        value={edu.years}
                        onChange={(e) => updateEducation(idx, "years", e.target.value)}
                        placeholder="2019 – 2023"
                        className="w-full rounded-xl border border-hair/70 bg-surface/30 px-3 py-2 text-sm text-ink outline-none focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
