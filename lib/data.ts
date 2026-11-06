/**
 * =============================================================================
 * CENTRALIZED PORTFOLIO CONTENT & DATA STORE
 * =============================================================================
 *
 * This file is the single source of truth for all content displayed on your
 * portfolio website. You can edit, add, or remove records directly in this file
 * without needing to search through or modify any React/Next.js components.
 *
 * QUICK EDITING GUIDE:
 * -----------------------------------------------------------------------------
 * 1. Personal & Contact Info:  Update `profile` below.
 * 2. Professional Summary:     Update `about.headline` and `about.summary`.
 * 3. Education:                Add/edit/remove objects in `education`.
 * 4. Certifications:           Add/edit/remove objects in `certifications`.
 * 5. Work Experience:          Add/edit/remove objects in `experience`.
 * 6. Projects:                 Add/edit/remove objects in `projects`.
 * 7. Technical Skills:         Add/edit/remove items or groups in `skillGroups`.
 * 8. Navigation Links:         Update `navLinks`.
 * 9. Section Headings:         Update `sectionHeaders`.
 * 10. SEO Metadata:            Update `siteMetadata`.
 * =============================================================================
 */

// -----------------------------------------------------------------------------
// Type Definitions
// -----------------------------------------------------------------------------

export type SocialLink = {
  name: string;
  url: string;
  ariaLabel?: string;
};

export type Profile = {
  name: string;
  title: string;
  location: string;
  email: string;
  phone?: string;
  github: string;
  linkedin: string;
  leetcode?: string;
  photo: string;
  socialLinks?: SocialLink[];
};

export type NavLink = {
  href: string;
  label: string;
};

export type EducationEntry = {
  id: string;
  degree: string;
  school: string;
  years: string;
  specialization?: string;
  details?: string;
};

export type Certification = {
  id: string;
  name: string;
  issuer?: string;
  issueDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  image?: string;
};

export type ExperienceEntry = {
  id: string;
  role: string;
  company: string;
  location?: string;
  period: string;
  bullets: string[];
  technologies?: string[];
};

export type Project = {
  id: string;
  name: string;
  year?: string;
  description: string;
  tags?: string[];
  liveUrl?: string;
  githubUrl?: string;
};

export type SkillGroup = {
  id?: string;
  label: string;
  items: string[];
};

export type SectionHeaders = {
  about: { badge: string; headline?: string };
  projects: { badge: string; title: string };
  experience: { badge: string; title: string };
  skills: { badge: string; title: string };
  contact: {
    badge: string;
    title: string;
    subtitle?: string;
    successMessage: string;
    errorMessage: string;
  };
};

export type SiteMetadata = {
  title: string;
  description: string;
  siteUrl: string;
};

// -----------------------------------------------------------------------------
// 1. Profile & Contact Information
// -----------------------------------------------------------------------------
export const profile: Profile = {
  name: "Atharva Nandurkar",
  title: "Full Stack Developer (MERN)",
  location: "Pune, India",
  email: "atharvanandurkar2411@gmail.com",
  phone: "",
  github: "https://github.com/atharvanan",
  linkedin: "https://www.linkedin.com/in/atharvanandurkar2411",
  leetcode: "https://leetcode.com/u/atharva_n_24/",
  photo: "/profile.jpg",
  socialLinks: [
    { name: "GitHub", url: "https://github.com/atharvanan" },
    { name: "LinkedIn", url: "https://www.linkedin.com/in/atharvanandurkar2411" },
  ],
};

// -----------------------------------------------------------------------------
// 2. Navigation Bar Links
// -----------------------------------------------------------------------------
export const navLinks: NavLink[] = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

// -----------------------------------------------------------------------------
// 3. Education
// -----------------------------------------------------------------------------
export const education: EducationEntry[] = [
  {
    id: "edu-001",
    degree: "B.E. Electrical Engineering",
    school: "Yeshwantrao Chavan College of Engineering, Nagpur, India",
    years: "2019 – 2023",
  },
];

// -----------------------------------------------------------------------------
// 4. Certifications
// -----------------------------------------------------------------------------
export const certifications: Certification[] = [
  {
    id: "cert-new",
    name: "AWS Certified Solutions Architect - Associate",
    issuer: "Amazon Web Services",
    issueDate: "2026",
    credentialId: "AWS-123456",
    credentialUrl: "https://aws.amazon.com/verification",
    image: ""
  },
  {
    id: "cert-001",
    name: "Microsoft Certified: Azure Fundamentals (AZ-900)",
    issuer: "Microsoft",
    issueDate: "",
    credentialId: "",
    credentialUrl: "",
    image: "",
  },
  {
    id: "cert-002",
    name: "Microsoft Certified: Azure Developer Associate (AZ-204)",
    issuer: "Microsoft",
    issueDate: "",
    credentialId: "",
    credentialUrl: "",
    image: "",
  },
  {
    id: "cert-003",
    name: "Microsoft Certified: Azure DevOps Engineer Expert (AZ-400)",
    issuer: "Microsoft",
    issueDate: "",
    credentialId: "",
    credentialUrl: "",
    image: "",
  },
];

// -----------------------------------------------------------------------------
// 5. Professional Summary & About Section
// -----------------------------------------------------------------------------
export const about = {
  headline: "Architecting cloud-native web systems and resilient backends.",
  summary:
    "Full Stack Developer with 2+ years of experience building responsive and scalable web applications using React.js, Next.js, Node.js, Express.js, and MongoDB. Skilled in developing REST APIs, implementing JWT-based authentication, managing application state, and building reusable UI components. Experienced in Microsoft Azure deployment and CI/CD workflows, with a focus on clean code, performance optimization, and delivering reliable end-to-end web solutions.",
  education: education[0],
  educationList: education,
  certifications: certifications,
};

// -----------------------------------------------------------------------------
// 6. Projects
// -----------------------------------------------------------------------------
export const projects: Project[] = [
  {
    id: "proj-001",
    name: "AI Resume Ranker",
    year: "2025",
    description:
      "A full-stack application that analyzes and ranks resumes against a job description using skill extraction, match/miss analysis, and a relevance scoring system.",
    tags: ["React.js", "Node.js", "REST API"],
    liveUrl: "https://ai-resume-ranker-gamma.vercel.app/",
    githubUrl: "https://github.com/atharvanan",
  },
  {
    id: "proj-002",
    name: "System Design Visualizer",
    year: "2026",
    description:
      "An interactive tool for designing and visualizing scalable software architectures — components, APIs, databases, and data flows.",
    tags: ["React.js", "Visualization"],
    liveUrl: "https://system-design-visualizer-iota.vercel.app/",
    githubUrl: "https://github.com/atharvanan",
  },
];

// -----------------------------------------------------------------------------
// 7. Work Experience
// -----------------------------------------------------------------------------
export const experience: ExperienceEntry[] = [
  {
    id: "exp-001",
    role: "Full Stack Developer",
    company: "Utilized Private Ltd.",
    location: "Gurugram, India (Remote)",
    period: "Apr 2025 – Dec 2025",
    bullets: [
      "Built and shipped full-stack features end-to-end - REST APIs with Node.js/Express.js, MongoDB data handling, and React.js/Next.js UI for an EdTech platform used by students and instructors.",
      "Implemented JWT-based authentication workflows and integrated frontend features with backend APIs using Axios and Redux Toolkit for state management across course and dashboard modules.",
      "Improved cross-browser compatibility and UI consistency, reducing recurring UI-related bug reports, while contributing to Agile code reviews and CI/CD deployment workflows.",
    ],
    technologies: ["React.js", "Next.js", "Node.js", "Express.js", "MongoDB", "Redux Toolkit", "Axios"],
  },
  {
    id: "exp-002",
    role: "Full Stack Developer (MERN)",
    company: "Microland Private Ltd.",
    location: "Mumbai, India",
    period: "Jun 2023 – Feb 2025",
    bullets: [
      "Developed and maintained scalable React.js applications for a BFSI platform, delivering responsive UI features across 5+ modules using Tailwind CSS.",
      "Built 10+ reusable React components and custom hooks, improving maintainability and reducing feature development time by 20%.",
      "Debugged and modified MongoDB queries and Node.js/Express API logic, resolving data validation issues across 15+ backend endpoints.",
      "Integrated JWT-based authentication on the frontend and consumed secure REST APIs using Axios, managing session state across modules.",
      "Improved frontend performance using Chrome DevTools and Lighthouse, reducing unnecessary re-renders and page load time by 15%.",
      "Deployed application updates on Microsoft Azure and contributed to CI/CD pipelines via Git/GitHub in Agile release cycles.",
    ],
    technologies: ["React.js", "Tailwind CSS", "Node.js", "Express.js", "MongoDB", "Microsoft Azure", "Git"],
  },
];

// -----------------------------------------------------------------------------
// 8. Technical Skills
// -----------------------------------------------------------------------------
export const skillGroups: SkillGroup[] = [
  {
    id: "skills-lang",
    label: "Languages",
    items: ["JavaScript (ES6+)", "TypeScript", "HTML5", "CSS3"],
  },
  {
    id: "skills-frontend",
    label: "Frontend",
    items: [
      "React.js",
      "Next.js",
      "React Hooks",
      "Context API",
      "Redux Toolkit",
      "React Router",
      "Tailwind CSS",
      "Framer Motion",
      "Material UI",
      "Styled Components",
    ],
  },
  {
    id: "skills-backend",
    label: "Backend",
    items: [
      "Node.js",
      "Express.js",
      "MongoDB",
      "Mongoose",
    ],
  },
  {
    id: "skills-concepts",
    label: "Concepts",
    items: [
      "State Management",
      "Responsive Design",
      "Web Accessibility (a11y)",
      "REST API Integration",
      "REST API Development",
      "Server-Side Rendering (SSR)",
      "Authentication (JWT/OAuth)",
      "Role-Based Access Control (RBAC)",
      "CI/CD Pipelines",
      "MVC Architecture",
    ],
  },
  {
    id: "skills-tools",
    label: "Tools",
    items: [
      "Git",
      "GitHub",
      "Vite",
      "Chrome DevTools",
      "Lighthouse",
      "Axios",
      "NPM",
      "VS Code",
      "Postman",
      "Docker",
      "Vercel",
    ],
  },
  {
    id: "skills-cloud",
    label: "Cloud",
    items: ["Microsoft Azure", "AWS (basics)", "Vercel"],
  },
];

// -----------------------------------------------------------------------------
// 9. Section Headings & Static Labels
// -----------------------------------------------------------------------------
export const sectionHeaders: SectionHeaders = {
  about: {
    badge: "About",
    headline: "Building digital experiences with modern web technologies.",
  },
  projects: {
    badge: "Work",
    title: "Projects",
  },
  experience: {
    badge: "Career",
    title: "Experience",
  },
  skills: {
    badge: "Toolkit",
    title: "Skills",
  },
  contact: {
    badge: "Get in touch",
    title: "Let’s work together",
    subtitle: "Have a project in mind or an opportunity to discuss? Send a message and I’ll reply at {email}.",
    successMessage: "Thanks — your message has been sent.",
    errorMessage: "Something went wrong.",
  },
};

// -----------------------------------------------------------------------------
// 10. Site SEO & OpenGraph Metadata
// -----------------------------------------------------------------------------
export const siteMetadata: SiteMetadata = {
  title: `${profile.name} — ${profile.title}`,
  description: `${profile.name}, ${about.summary}`,
  siteUrl: "https://example.com",
};

export type PortfolioData = {
  profile: Profile;
  navLinks: NavLink[];
  about: {
    badge?: string;
    headline: string;
    summary: string;
  };
  education: EducationEntry[];
  certifications: Certification[];
  experience: ExperienceEntry[];
  projects: Project[];
  skillGroups: SkillGroup[];
  sectionHeaders: SectionHeaders;
  siteMetadata: SiteMetadata;
};

export const defaultPortfolioData: PortfolioData = {
  profile,
  navLinks,
  about: {
    badge: "About",
    headline: about.headline,
    summary: about.summary,
  },
  education,
  certifications,
  experience,
  projects,
  skillGroups,
  sectionHeaders,
  siteMetadata,
};
