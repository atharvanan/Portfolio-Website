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
  const [storageType, setStorageType] = useState<string>("local");

  // Check authentication & load data
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
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resData = await res.json();
      if (!res.ok) {
        showToast(resData.error || "Failed to save changes", "error");
        setSaving(false);
        return;
      }

      setStorageType(resData.storage || "local");
      showToast("🎉 Changes saved! Live website updated instantly.", "success");
    } catch (err) {
      showToast("An error occurred while saving.", "error");
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
      bullets: ["Describe your responsibility or achievement here."],
      technologies: ["React.js", "Node.js"],
    };
    setData({ ...data, experience: [newJob, ...data.experience] });
    showToast("Added new experience record (edit details below)");
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
      name: "New Project",
      year: new Date().getFullYear().toString(),
      description: "Project description and key impact.",
      tags: ["Next.js", "TypeScript"],
      liveUrl: "",
      githubUrl: "",
    };
    setData({ ...data, projects: [newProj, ...data.projects] });
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
      name: "New Certification Name",
      issuer: "Issuing Organization",
      issueDate: new Date().getFullYear().toString(),
      credentialId: "",
      credentialUrl: "",
    };
    setData({ ...data, certifications: [...data.certifications, newCert] });
  };

  const deleteCert = (index: number) => {
    const list = data.certifications.filter((_, idx) => idx !== index);
    setData({ ...data, certifications: list });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0e] flex items-center justify-center text-white/50 font-sans">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          <span>Loading portfolio editor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0e] text-white font-sans antialiased pb-24">
      {/* Sticky Header Bar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#121214]/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 text-accent font-semibold text-lg border border-accent/20">
              ⚡
            </span>
            <div>
              <h1 className="text-[15px] font-semibold text-white tracking-tight flex items-center gap-2">
                Portfolio CMS Editor
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Live Mode
                </span>
              </h1>
              <p className="text-xs text-white/40">
                Storage: <span className="text-white/70">{storageType === "mongodb" ? "MongoDB Atlas" : "Local / Cloud Sync"}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white/70 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <span>View Live Website</span>
              <span>↗</span>
            </a>

            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white rounded-xl bg-accent hover:bg-accent-hover transition-all duration-200 shadow-md shadow-accent/20 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>💾</span>
                  <span>Save All Changes</span>
                </>
              )}
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-2 text-xs text-white/50 hover:text-white/80 transition-colors"
              title="Sign Out"
            >
              Sign out
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-6xl mx-auto px-6 flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-white/5">
          {[
            { id: "experience", label: "💼 Work Experience", count: data.experience?.length },
            { id: "projects", label: "🚀 Projects", count: data.projects?.length },
            { id: "certifications", label: "🏅 Certifications", count: data.certifications?.length },
            { id: "skills", label: "🛠️ Skills", count: data.skillGroups?.length },
            { id: "profile", label: "👤 Profile & Bio" },
            { id: "education", label: "🎓 Education", count: data.education?.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`py-3 px-4 text-xs font-medium transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id
                  ? "border-accent text-accent"
                  : "border-transparent text-white/60 hover:text-white"
              }`}
            >
              <span>{tab.label}</span>
              {typeof tab.count === "number" && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/10 text-white/70">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl text-xs font-medium border shadow-2xl flex items-center gap-3 transition-all duration-300 animate-fade-in-up ${
            notification.type === "success"
              ? "bg-emerald-950/90 border-emerald-500/30 text-emerald-200"
              : "bg-rose-950/90 border-rose-500/30 text-rose-200"
          }`}
        >
          <span>{notification.type === "success" ? "✓" : "⚠"}</span>
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-6 pt-10">
        {/* ================================================================= */}
        {/* TAB 1: WORK EXPERIENCE */}
        {/* ================================================================= */}
        {activeTab === "experience" && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">Work Experience</h2>
                <p className="text-xs text-white/50 mt-1">
                  Edit job roles, employment duration, and interactive bullet points.
                </p>
              </div>
              <button
                onClick={addExperienceRecord}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-medium text-white border border-white/10 transition-colors flex items-center gap-2"
              >
                <span>+ Add Experience</span>
              </button>
            </div>

            <div className="space-y-6">
              {data.experience.map((job, jobIdx) => (
                <div
                  key={job.id || jobIdx}
                  className="rounded-2xl bg-[#161618] border border-white/10 p-6 sm:p-8 space-y-6 shadow-lg"
                >
                  <div className="flex items-start justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent/10 text-accent font-semibold text-xs border border-accent/20">
                        {jobIdx + 1}
                      </span>
                      <div>
                        <h3 className="text-base font-semibold text-white">
                          {job.role || "Untitled Role"}
                        </h3>
                        <p className="text-xs text-white/50">{job.company || "Company"}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteExperienceRecord(jobIdx)}
                      className="px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>

                  {/* Primary fields grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-[11px] font-medium uppercase tracking-wider text-white/50 mb-1.5">
                        Job Title / Role
                      </label>
                      <input
                        type="text"
                        value={job.role}
                        onChange={(e) => updateExperience(jobIdx, "role", e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white outline-none focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium uppercase tracking-wider text-white/50 mb-1.5">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={job.company}
                        onChange={(e) => updateExperience(jobIdx, "company", e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white outline-none focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium uppercase tracking-wider text-white/50 mb-1.5">
                        Duration (Period)
                      </label>
                      <input
                        type="text"
                        value={job.period}
                        onChange={(e) => updateExperience(jobIdx, "period", e.target.value)}
                        placeholder="e.g. Apr 2025 – Dec 2025"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white outline-none focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium uppercase tracking-wider text-white/50 mb-1.5">
                        Location
                      </label>
                      <input
                        type="text"
                        value={job.location || ""}
                        onChange={(e) => updateExperience(jobIdx, "location", e.target.value)}
                        placeholder="e.g. Pune, India (Remote)"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white outline-none focus:border-accent"
                      />
                    </div>
                  </div>

                  {/* Bullet Points Section */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-[11px] font-medium uppercase tracking-wider text-white/70">
                        Responsibility Bullet Points ({job.bullets.length})
                      </label>
                      <button
                        type="button"
                        onClick={() => addBulletPoint(jobIdx)}
                        className="text-xs text-accent hover:text-accent-hover font-medium flex items-center gap-1"
                      >
                        <span>+ Add Bullet Point</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {job.bullets.map((bullet, bulletIdx) => (
                        <div key={bulletIdx} className="flex items-start gap-3">
                          <span className="text-white/30 text-xs font-mono mt-2.5 w-5 text-right">
                            {bulletIdx + 1}.
                          </span>
                          <textarea
                            rows={2}
                            value={bullet}
                            onChange={(e) => updateBulletPoint(jobIdx, bulletIdx, e.target.value)}
                            placeholder="Describe achievement, feature built, or responsibility..."
                            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white outline-none focus:border-accent leading-relaxed"
                          />
                          <button
                            type="button"
                            onClick={() => removeBulletPoint(jobIdx, bulletIdx)}
                            className="text-white/40 hover:text-rose-400 mt-2 p-1 rounded transition-colors text-sm"
                            title="Remove bullet"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technologies Tags */}
                  <div>
                    <label className="block text-[11px] font-medium uppercase tracking-wider text-white/50 mb-1.5">
                      Technologies Used (comma separated)
                    </label>
                    <input
                      type="text"
                      value={job.technologies ? job.technologies.join(", ") : ""}
                      onChange={(e) => {
                        const tags = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                        updateExperience(jobIdx, "technologies", tags);
                      }}
                      placeholder="e.g. React.js, Next.js, Node.js, MongoDB"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white outline-none focus:border-accent"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: PROJECTS */}
        {/* ================================================================= */}
        {activeTab === "projects" && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">Projects</h2>
                <p className="text-xs text-white/50 mt-1">
                  Manage portfolio projects, descriptions, tags, and links.
                </p>
              </div>
              <button
                onClick={addProject}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-medium text-white border border-white/10 transition-colors flex items-center gap-2"
              >
                <span>+ Add Project</span>
              </button>
            </div>

            <div className="space-y-6">
              {data.projects.map((proj, idx) => (
                <div
                  key={proj.id || idx}
                  className="rounded-2xl bg-[#161618] border border-white/10 p-6 sm:p-8 space-y-5 shadow-lg"
                >
                  <div className="flex items-start justify-between border-b border-white/10 pb-4">
                    <h3 className="text-base font-semibold text-white">
                      {proj.name || "Untitled Project"}
                    </h3>
                    <button
                      onClick={() => deleteProject(idx)}
                      className="px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-medium uppercase tracking-wider text-white/50 mb-1.5">
                        Project Name
                      </label>
                      <input
                        type="text"
                        value={proj.name}
                        onChange={(e) => updateProject(idx, "name", e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white outline-none focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium uppercase tracking-wider text-white/50 mb-1.5">
                        Year
                      </label>
                      <input
                        type="text"
                        value={proj.year || ""}
                        onChange={(e) => updateProject(idx, "year", e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white outline-none focus:border-accent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium uppercase tracking-wider text-white/50 mb-1.5">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={proj.description}
                      onChange={(e) => updateProject(idx, "description", e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white outline-none focus:border-accent leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-medium uppercase tracking-wider text-white/50 mb-1.5">
                        Tech Tags (comma separated)
                      </label>
                      <input
                        type="text"
                        value={proj.tags ? proj.tags.join(", ") : ""}
                        onChange={(e) => {
                          const tags = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                          updateProject(idx, "tags", tags);
                        }}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white outline-none focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium uppercase tracking-wider text-white/50 mb-1.5">
                        Live Demo URL
                      </label>
                      <input
                        type="url"
                        value={proj.liveUrl || ""}
                        onChange={(e) => updateProject(idx, "liveUrl", e.target.value)}
                        placeholder="https://..."
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white outline-none focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium uppercase tracking-wider text-white/50 mb-1.5">
                        GitHub Repository URL
                      </label>
                      <input
                        type="url"
                        value={proj.githubUrl || ""}
                        onChange={(e) => updateProject(idx, "githubUrl", e.target.value)}
                        placeholder="https://github.com/..."
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white outline-none focus:border-accent"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: CERTIFICATIONS */}
        {/* ================================================================= */}
        {activeTab === "certifications" && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">Certifications</h2>
                <p className="text-xs text-white/50 mt-1">
                  Add, edit, or remove professional certifications.
                </p>
              </div>
              <button
                onClick={addCert}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-medium text-white border border-white/10 transition-colors flex items-center gap-2"
              >
                <span>+ Add Certification</span>
              </button>
            </div>

            <div className="space-y-4">
              {data.certifications.map((cert, idx) => (
                <div
                  key={cert.id || idx}
                  className="rounded-2xl bg-[#161618] border border-white/10 p-6 space-y-4 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                      Certification #{idx + 1}
                    </span>
                    <button
                      onClick={() => deleteCert(idx)}
                      className="text-xs text-rose-400 hover:text-rose-300"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2">
                      <label className="block text-[11px] font-medium uppercase tracking-wider text-white/50 mb-1.5">
                        Certification Title
                      </label>
                      <input
                        type="text"
                        value={cert.name}
                        onChange={(e) => updateCert(idx, "name", e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white outline-none focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium uppercase tracking-wider text-white/50 mb-1.5">
                        Issuer
                      </label>
                      <input
                        type="text"
                        value={cert.issuer || ""}
                        onChange={(e) => updateCert(idx, "issuer", e.target.value)}
                        placeholder="Microsoft, AWS, etc."
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white outline-none focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium uppercase tracking-wider text-white/50 mb-1.5">
                        Issue Date (Year)
                      </label>
                      <input
                        type="text"
                        value={cert.issueDate || ""}
                        onChange={(e) => updateCert(idx, "issueDate", e.target.value)}
                        placeholder="2024"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white outline-none focus:border-accent"
                      />
                    </div>
                    <div className="lg:col-span-2">
                      <label className="block text-[11px] font-medium uppercase tracking-wider text-white/50 mb-1.5">
                        Credential Verification URL
                      </label>
                      <input
                        type="url"
                        value={cert.credentialUrl || ""}
                        onChange={(e) => updateCert(idx, "credentialUrl", e.target.value)}
                        placeholder="https://..."
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white outline-none focus:border-accent"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 4: SKILLS */}
        {/* ================================================================= */}
        {activeTab === "skills" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Technical Skills</h2>
              <p className="text-xs text-white/50 mt-1">
                Edit skill categories and comma-separated tools, languages, and frameworks.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.skillGroups.map((group, idx) => (
                <div
                  key={group.id || idx}
                  className="rounded-2xl bg-[#161618] border border-white/10 p-6 space-y-4 shadow-lg"
                >
                  <label className="block text-xs font-semibold uppercase tracking-wider text-accent">
                    Category: {group.label}
                  </label>
                  <div>
                    <label className="block text-[11px] font-medium uppercase tracking-wider text-white/50 mb-1.5">
                      Skills List (comma-separated)
                    </label>
                    <textarea
                      rows={5}
                      value={group.items.join(", ")}
                      onChange={(e) => {
                        const items = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                        const list = [...data.skillGroups];
                        list[idx] = { ...list[idx], items };
                        setData({ ...data, skillGroups: list });
                      }}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white outline-none focus:border-accent leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 5: PROFILE & ABOUT */}
        {/* ================================================================= */}
        {activeTab === "profile" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Profile & Professional Summary</h2>
              <p className="text-xs text-white/50 mt-1">
                Edit your introduction, headline, summary description, and contact info.
              </p>
            </div>

            <div className="rounded-2xl bg-[#161618] border border-white/10 p-6 sm:p-8 space-y-6 shadow-lg">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-accent border-b border-white/10 pb-3">
                Personal Info
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-white/50 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={data.profile.name}
                    onChange={(e) => setData({ ...data, profile: { ...data.profile, name: e.target.value } })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-white/50 mb-1.5">
                    Job Title / Subtitle
                  </label>
                  <input
                    type="text"
                    value={data.profile.title}
                    onChange={(e) => setData({ ...data, profile: { ...data.profile, title: e.target.value } })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-white/50 mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    value={data.profile.location}
                    onChange={(e) => setData({ ...data, profile: { ...data.profile, location: e.target.value } })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white outline-none focus:border-accent"
                  />
                </div>
              </div>

              <h3 className="text-sm font-semibold uppercase tracking-wider text-accent border-b border-white/10 pb-3 pt-2">
                About & Summary Paragraph
              </h3>
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-white/50 mb-1.5">
                  Headline
                </label>
                <input
                  type="text"
                  value={data.about.headline}
                  onChange={(e) => setData({ ...data, about: { ...data.about, headline: e.target.value } })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-white/50 mb-1.5">
                  Professional Summary
                </label>
                <textarea
                  rows={4}
                  value={data.about.summary}
                  onChange={(e) => setData({ ...data, about: { ...data.about, summary: e.target.value } })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white outline-none focus:border-accent leading-relaxed"
                />
              </div>

              <h3 className="text-sm font-semibold uppercase tracking-wider text-accent border-b border-white/10 pb-3 pt-2">
                Contact & Links
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-white/50 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={data.profile.email}
                    onChange={(e) => setData({ ...data, profile: { ...data.profile, email: e.target.value } })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-white/50 mb-1.5">
                    Phone (Optional)
                  </label>
                  <input
                    type="text"
                    value={data.profile.phone || ""}
                    onChange={(e) => setData({ ...data, profile: { ...data.profile, phone: e.target.value } })}
                    placeholder="+91 ..."
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-white/50 mb-1.5">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={data.profile.github}
                    onChange={(e) => setData({ ...data, profile: { ...data.profile, github: e.target.value } })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-white/50 mb-1.5">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={data.profile.linkedin}
                    onChange={(e) => setData({ ...data, profile: { ...data.profile, linkedin: e.target.value } })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white outline-none focus:border-accent"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 6: EDUCATION */}
        {/* ================================================================= */}
        {activeTab === "education" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Education</h2>
              <p className="text-xs text-white/50 mt-1">
                Edit degree, institution, and graduation years.
              </p>
            </div>

            <div className="space-y-4">
              {data.education.map((edu, idx) => (
                <div
                  key={edu.id || idx}
                  className="rounded-2xl bg-[#161618] border border-white/10 p-6 space-y-4 shadow-lg"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-medium uppercase tracking-wider text-white/50 mb-1.5">
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
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white outline-none focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium uppercase tracking-wider text-white/50 mb-1.5">
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
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white outline-none focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium uppercase tracking-wider text-white/50 mb-1.5">
                        Duration / Years
                      </label>
                      <input
                        type="text"
                        value={edu.years}
                        onChange={(e) => {
                          const list = [...data.education];
                          list[idx] = { ...list[idx], years: e.target.value };
                          setData({ ...data, education: list });
                        }}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white outline-none focus:border-accent"
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
